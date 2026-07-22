import {
  mysqlTable,
  int,
  timestamp,
  boolean,
  varchar,
  binary,
  decimal,
  char
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema.js";
import { membershipPlans } from "./membershipPlans.schema.js";
import { trainer } from "./trainer.schema.js";

export const membership = mysqlTable("membership", {
  id: char("id", { length: 36 }).primaryKey(),
  membershipPlan: char("membershipPlan", { length: 36 })
    .references(() => membershipPlans.id)
    .notNull(),
  user: char("user", { length: 36 })
    .notNull()
    .references(() => users.id),
  price: int().notNull(),
  trainer: char("trainer", { length: 36 })
    .references(() => trainer.id)
    .default(null),
  subscribedDate: timestamp().defaultNow(),
  expiryDate: timestamp("expiry_date").notNull(),
  isActive: boolean().default(true),
  isExpired: boolean().default(false),
  weight: decimal("weight", {
    precision: 3,
    scale: 1,
  }).notNull(),
  type: varchar("type", { length: 255 }), // gain, weightloss...
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
