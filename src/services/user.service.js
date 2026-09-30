import { db } from "../db/index.js";
import { users } from "../db/schema/users.schema.js";
import { eq, or, desc, count, and, sql } from "drizzle-orm";
import { createUserValidator } from "../validator/user.validator.js";
import { v7 as uuidv7 } from "uuid"; // Changed this line
import { bufferToUuid, uuidToBuffer } from "../utils/uuid.handler.js";
import { membership } from "../db/schema/membership.schema.js";
import { membershipPlans } from "../db/schema/membershipPlans.schema.js";
import { membershipQueue } from "../config/bullmq.js";

export const createUserService = async (payload) => {
  const {
    name,
    email,
    phone,
    bloodGroup,
    age,
    height,
    membershipPlanId,
    price,
    weight,
    type,
    trainerId,
  } = payload;
  const { error } = createUserValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const [user, membershipPlan] = await Promise.all([
    db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone))),
    db
      .select()
      .from(membershipPlans)
      .where(eq(membershipPlans.id, membershipPlanId))
      .limit(1),
  ]);

  if (user.length > 0) {
    throw new Error("User already exists");
  }

  if (membershipPlan.length === 0) {
    throw new Error("Invalid membership plan id");
  }

  let userId = uuidv7();
  let membershipId = uuidv7();

  let planValidity = membershipPlan[0].validity;
  let expiryDate = new Date();
  expiryDate.setUTCDate(expiryDate.getUTCDate() + Number(planValidity));

  await db.transaction(async (tx) => {
    await tx.insert(users).values({
      id: userId,
      name,
      email,
      phone,
      bloodGroup,
      age,
      height,
    });

    await tx.insert(membership).values({
      id: membershipId,
      membershipPlan: membershipPlanId,
      user: userId,
      price:
        price !== undefined && price !== null && price !== ""
          ? Number(price)
          : membershipPlan[0].price,
      trainer: trainerId ? trainerId : null,
      expiryDate,
      weight: Number(weight),
      type,
    });
  });

  const delayMs = expiryDate.getTime() - Date.now();
  const jobId = `expire-membership-${membershipId}`;
  const redisdata = await membershipQueue.add(
    "expire-membership",
    {
      membershipId: membershipId,
      userId: userId,
    },
    {
      delay: delayMs, // Delay in milliseconds until expiryDate
      jobId: jobId, // Unique ID prevents duplicate jobs for the same record
      removeOnComplete: true, // Auto-cleanup completed jobs
    },
  );

  console.log("data added to redis", redisdata);
  const data = {
    id: userId,
    name,
    email,
    phone,
    bloodGroup,
    age,
    height,
    planName: membershipPlan[0].title,
  };

  return data;
};

export const getListOfUsersService = async (payload) => {
  const { status = "all", name, page = 1, limit = 10 } = payload;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pageNum - 1) * limitNum;

  let query = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      bloodGroup: users.bloodGroup,
      age: users.age,
      height: users.height,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      membershipId: membership.id,
      subscribedDate: membership.subscribedDate,
      expiryDate: membership.expiryDate,
      membershipPrice: membership.price,
      trainerId: membership.trainer,
      isMembershipActive: membership.isActive,
      isMembershipExpired: membership.isExpired,
      weight: membership.weight,
      type: membership.type,
      membershipPlanId: membershipPlans.id,
      planTitle: membershipPlans.title,
      planValidity: membershipPlans.validity,
    })
    .from(users)
    .leftJoin(
      membership,
      and(
        eq(users.id, membership.user),
        eq(membership.isActive, true),
        eq(membership.isExpired, false),
      ),
    )
    .leftJoin(
      membershipPlans,
      eq(membership.membershipPlan, membershipPlans.id),
    );

  let countQuery = db.select({ count: count() }).from(users); // added: separate count query builder

  if (status === "active") {
    query = query.where(eq(users.isActive, true));
    countQuery = countQuery.where(eq(users.isActive, true)); // added: keep count in sync with filter
  } else if (status === "inactive") {
    query = query.where(eq(users.isActive, false));
    countQuery = countQuery.where(eq(users.isActive, false)); // added
  } else if (status !== "all") {
    throw new Error("Invalid status");
  }

  if (name && name.trim()) {
    const searchTerm = `%${name.trim().toLowerCase()}%`;
    query = query.where(sql`LOWER(${users.name}) LIKE ${searchTerm}`);
    countQuery = countQuery.where(sql`LOWER(${users.name}) LIKE ${searchTerm}`);
  }

  const [result, totalUsers] = await Promise.all([
    query.orderBy(desc(users.createdAt)).limit(limitNum).offset(offset),
    countQuery,
  ]);

  const data = {
    totalUsers: totalUsers[0].count,
    page: pageNum,
    pageSize: limitNum,
    users: result,
  };
  return data;
};

export const getUserDetailsService = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }
  const user = await db
    .select()
    .from(users)
    .leftJoin(
      membership,
      and(
        eq(users.id, membership.user),
        eq(membership.isActive, true),
        eq(membership.isExpired, false),
      ),
    )
    .leftJoin(
      membershipPlans,
      eq(membership.membershipPlan, membershipPlans.id),
    )
    .where(eq(users.id, userId));
  if (user.length === 0) {
    throw new Error("User not found");
  }

  return user[0];
};

export const renewMembershipService = async (payload) => {
  const { userId, membershipPlanId, price, weight, type, trainerId } = payload;
  if (!userId) {
    throw new Error("UserId is required");
  }
  const [user, oldMembership] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)),
    db.select().from(membership).where(eq(membership.user, userId)),
  ]);
  if (user.length === 0) {
    throw new Error("User not found");
  }
  if (oldMembership.length > 0) {
    await db
      .update(membership)
      .set({
        isActive: false,
        isExpired: true,
      })
      .where(eq(membership.user, userId));
  }
  let finalMembershipPlanId =
    membershipPlanId || oldMembership[0].membershipPlan;
  const membershipPlan = await db
    .select()
    .from(membershipPlans)
    .where(eq(membershipPlans.id, finalMembershipPlanId));

  if (membershipPlan.length === 0) {
    throw new Error("Please provide valid membership plan Id");
  }
  let membershipId = uuidv7();
  let planValidity = membershipPlan[0].validity;
  let expiryDate = new Date();
  expiryDate.setUTCDate(expiryDate.getUTCDate() + Number(planValidity));

  const newMembership = await db.insert(membership).values({
    id: membershipId,
    membershipPlan: finalMembershipPlanId,
    user: userId,
    price:
      price !== undefined && price !== null && price !== ""
        ? Number(price)
        : membershipPlan[0].price,
    trainer: trainerId ? trainerId : null,
    expiryDate,
    weight: weight ? Number(weight) : oldMembership[0].weight,
    type: type || oldMembership[0].type,
  });

  const data = {
    membershipId,
    userId,
  };
  return data;
};
