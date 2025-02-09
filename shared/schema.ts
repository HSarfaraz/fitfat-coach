import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  email: text("email").notNull(),
  phone: text("phone"),
  currentPackage: text("current_package"),
  packageStartDate: timestamp("package_start_date"),
  packageEndDate: timestamp("package_end_date")
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: text("status").notNull(), // scheduled, completed, cancelled
  notes: text("notes")
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  weight: integer("weight"),
  notes: text("notes")
});

export const packages = {
  monthly: {
    id: "monthly",
    name: "1 Month Package",
    duration: 1,
    price: 500,
    features: [
      "15-min zoom consultation",
      "Diet planning",
      "Exercise routines",
      "Progress tracking"
    ]
  },
  quarterly: {
    id: "quarterly",
    name: "3 Month Package",
    duration: 3,
    price: 1000,
    features: [
      "15-min zoom consultation",
      "Diet planning",
      "Exercise routines",
      "Progress tracking",
      "10% discount"
    ]
  },
  halfYearly: {
    id: "halfYearly",
    name: "6 Month Package",
    duration: 6,
    price: 4500,
    features: [
      "15-min zoom consultation",
      "Diet planning",
      "Exercise routines",
      "Progress tracking",
      "25% discount",
      "Priority scheduling"
    ]
  },
  yearly: {
    id: "yearly",
    name: "12 Month Package",
    duration: 12,
    price: 6000,
    features: [
      "15-min zoom consultation",
      "Diet planning",
      "Exercise routines",
      "Progress tracking",
      "50% discount",
      "Priority scheduling",
      "24/7 WhatsApp support"
    ]
  }
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true
});

export const insertConsultationSchema = createInsertSchema(consultations);
export const insertProgressSchema = createInsertSchema(progress);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Package = typeof packages.monthly;
