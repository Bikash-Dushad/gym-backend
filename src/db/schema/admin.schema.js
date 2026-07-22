import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  binary,
  boolean,
  decimal,
  char,
} from "drizzle-orm/mysql-core";

export const admin = mysqlTable("admin", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 10 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  otp: varchar("otp", { length: 6 }),
  isActve: boolean().default(true),
  isDeleted: boolean().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
