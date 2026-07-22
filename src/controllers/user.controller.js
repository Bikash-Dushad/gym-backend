import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { createUserService } from "../services/user.service.js";
import { handleError } from "../utils/error.handler.js";

export const getAllUsers = async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
};

export const getUserById = async (req, res) => {
  const user = await db.select().from(users).where(eq(users.id, req.params.id));
  res.json(user[0] || {});
};
