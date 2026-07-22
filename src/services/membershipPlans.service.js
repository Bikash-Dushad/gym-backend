import { v7 as uuidv7 } from "uuid"; // Changed this line
import { db } from "../db/index.js";
import { eq, or, desc, count, asc } from "drizzle-orm";
import { admin } from "../db/schema/admin.schema.js";
import { createAdminValidator } from "../validator/admin.validator.js";
import { bufferToUuid, uuidToBuffer } from "../utils/uuid.handler.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token.handler.js";
import { createMembershipPlanValidator } from "../validator/membershipPlan.validator.js";
import { membershipPlans } from "../db/schema/membershipPlans.schema.js";

export const createMembershipPlanService = async (payload) => {
  const { title, validity, price } = payload;
  const { error } = createMembershipPlanValidator.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const existingMembershipPlan = await db
    .select()
    .from(membershipPlans)
    .where(eq(membershipPlans.title, title))
    .limit(1);

  if (existingMembershipPlan.length > 0) {
    throw new Error("Plan already exists");
  }
  const id = uuidv7();

  const newMembershipPlan = await db.insert(membershipPlans).values({
    id,
    title,
    validity,
    price,
  });
  const data = {
    title,
    validity,
    price,
  };
  return data;
};

export const listOfMemberShipPlansService = async () => {
  const existingMembershipPlans = await db
    .select()
    .from(membershipPlans)
    .orderBy(asc(membershipPlans.price));


  return existingMembershipPlans;
};
