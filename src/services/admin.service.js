import { v7 as uuidv7 } from "uuid"; // Changed this line
import { db } from "../db/index.js";
import { eq, or, desc, count, gte, and, lte, lt, sql } from "drizzle-orm";
import { admin } from "../db/schema/admin.schema.js";
import { createAdminValidator } from "../validator/admin.validator.js";
import { bufferToUuid, uuidToBuffer } from "../utils/uuid.handler.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token.handler.js";
import { users } from "../db/schema/users.schema.js";
import { membership } from "../db/schema/membership.schema.js";
import { membershipPlans } from "../db/schema/membershipPlans.schema.js";

export const createAdminService = async (payload) => {
  const { name, email, phone, password, avatar } = payload;
  const { error } = createAdminValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const existingAdmin = await db
    .select()
    .from(admin)
    .where(or(eq(admin.email, email), eq(admin.phone, phone)));

  if (existingAdmin.length > 0) {
    throw new Error("Admin already exists");
  }
  let id = uuidv7();
  let hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await db.insert(admin).values({
    id,
    name,
    email,
    phone,
    password: hashedPassword,
    avatar,
  });
  const data = {
    name,
    email,
    phone,
  };
  return data;
};

export const adminLoginService = async (payload) => {
  const { emailOrPhone, password } = payload;
  if (!emailOrPhone || !password) {
    throw new Error("EmailOrPhone/password is required");
  }
  const existingAdmin = await db
    .select()
    .from(admin)
    .where(or(eq(admin.email, emailOrPhone), eq(admin.phone, emailOrPhone)))
    .limit(1);

  if (existingAdmin.length === 0) {
    throw new Error("Admin not found. Please use correct email/password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingAdmin[0].password,
  );
  if (!isPasswordValid) {
    throw new Error("Password didnot matched");
  }
  const tokenPayload = {
    id: existingAdmin[0].id,
  };
  let token = createToken(tokenPayload);
  const data = {
    id: existingAdmin[0].id,
    token,
    name: existingAdmin[0].name,
    phone: existingAdmin[0].phone,
  };
  return data;
};

export const getAdminProfileService = async (adminId) => {
  if (!adminId) {
    throw new Error("Admin not found");
  }
  const adminProfile = await db
    .select()
    .from(admin)
    .where(eq(admin.id, adminId));

  if (!adminProfile) {
    throw new Error("Admin not found");
  }

  const data = {
    id: adminProfile[0].id,
    name: adminProfile[0].name,
    email: adminProfile[0].email,
    avatar: adminProfile[0].avatar,
    role: adminProfile[0].role || "Admin",
  };
  return data;
};

export const adminDashboardService = async (adminId) => {
  if (!adminId) {
    throw new Error("Admin Id is required");
  }
  const today = new Date();
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 7);
  endDate.setUTCHours(23, 59, 59, 999);

  const startOfMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 0, 0, 0, 0),
  );
  const startOfNextMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1, 0, 0, 0, 0),
  );

  const [
    totalUsers,
    activeUsers,
    expiringSoon,
    newUsers,
    totalRevenew,
    monthlyRevenew,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db
      .select({ count: count() })
      .from(membership)
      .where(eq(membership.isActive, true)),
    db
      .select({
        id: membership.id,
        expiryDate: membership.expiryDate,

        user: {
          id: users.id,
          name: users.name,
        },
        membershipPlan: {
          id: membershipPlans.id,
          name: membershipPlans.title,
          price: membership.price,
        },
      })
      .from(membership)
      .innerJoin(users, eq(membership.user, users.id))
      .innerJoin(
        membershipPlans,
        eq(membership.membershipPlan, membershipPlans.id),
      )
      .where(
        and(
          gte(membership.expiryDate, startDate),
          lte(membership.expiryDate, endDate),
        ),
      ),

    db.select().from(users).orderBy(desc(users.createdAt)).limit(5),
    db
      .select({
        totalRevenue: sql`COALESCE(SUM(${membership.price}), 0)`,
      })
      .from(membership),
    db
      .select({
        monthlyRevenue: sql`COALESCE(SUM(${membership.price}), 0)`,
      })
      .from(membership)
      .where(
        and(
          gte(membership.createdAt, startOfMonth),
          lt(membership.createdAt, startOfNextMonth),
        ),
      ),
  ]);

  const data = {
    totalUsers: Number(totalUsers[0]?.count || 0),
    activeUsers: Number(activeUsers[0]?.count || 0),
    totalRevenew: Number(totalRevenew[0]?.totalRevenue || 0),
    monthlyRevenew: Number(monthlyRevenew[0]?.monthlyRevenue || 0),
    expiringSoon,
    newUsers,
  };
  return data;
};
