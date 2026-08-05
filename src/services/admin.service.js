import { v7 as uuidv7 } from "uuid"; // Changed this line
import { db } from "../db/index.js";
import { eq, or, desc, count } from "drizzle-orm";
import { admin } from "../db/schema/admin.schema.js";
import { createAdminValidator } from "../validator/admin.validator.js";
import { bufferToUuid, uuidToBuffer } from "../utils/uuid.handler.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token.handler.js";

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
    role: adminProfile[0].role || "Admin"
  };
  return data;
};
