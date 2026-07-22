import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  binary,
  boolean,
  decimal,
  char
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: char("id",{ length: 36 }).primaryKey(),
  name: varchar("name",{ length: 255 }).notNull(),
  email: varchar("email",{ length: 255 }).notNull().unique(),
  phone: varchar("phone",{ length: 10 }).notNull().unique(),
  bloodGroup: varchar("bloodGroup",{ length: 5 }),
  age: int().notNull(),
  height: decimal("height", {
    precision: 3,
    scale: 1,
  }).notNull(),
  isActive: boolean().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
