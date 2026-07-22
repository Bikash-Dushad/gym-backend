import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  binary,
  char,
} from "drizzle-orm/mysql-core";

export const membershipPlans = mysqlTable("membershipPlans", {
  id: char("id",{ length: 36 }).primaryKey(),
  title: varchar("title",{ length: 255 }).notNull(),
  validity: varchar("validity",{ length: 255 }).notNull(),
  price: int().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
