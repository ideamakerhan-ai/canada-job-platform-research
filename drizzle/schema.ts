import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// NOC Occupations Table
export const nocOccupations = mysqlTable("noc_occupations", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  nocCode: varchar("noc_code", { length: 10 }).notNull().unique(),
  teerLevel: int("teer_level").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NocOccupation = typeof nocOccupations.$inferSelect;
export type InsertNocOccupation = typeof nocOccupations.$inferInsert;

// Cities Table
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  province: varchar("province", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

// Job Listings Table
export const jobListings = mysqlTable("job_listings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 50 }).notNull(),
  salary: varchar("salary", { length: 255 }),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  nocCode: varchar("noc_code", { length: 10 }),
  teerLevel: int("teer_level"),
  lmiaAvailable: int("lmia_available").default(0).notNull(),
  visaSponsorship: int("visa_sponsorship").default(0).notNull(),
  applicationMethod: varchar("application_method", { length: 50 }).notNull(),
  applicationEmail: varchar("application_email", { length: 320 }),
  applicationLink: varchar("application_link", { length: 500 }),
  postedBy: int("posted_by").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = typeof jobListings.$inferInsert;

// Job Reports Table (Scam Prevention)
export const jobReports = mysqlTable("job_reports", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("job_id").notNull(),
  userId: int("user_id"),
  reason: varchar("reason", { length: 100 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type JobReport = typeof jobReports.$inferSelect;
export type InsertJobReport = typeof jobReports.$inferInsert;

// Saved Jobs Table
export const savedJobs = mysqlTable("saved_jobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  jobId: int("job_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = typeof savedJobs.$inferInsert;

// Job Applications Table
export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  jobId: int("job_id").notNull(),
  status: varchar("status", { length: 50 }).default("applied").notNull(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

// User Profiles Table
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  bio: text("bio"),
  skills: text("skills"),
  experience: text("experience"),
  education: text("education"),
  resumeUrl: varchar("resume_url", { length: 500 }),
  location: varchar("location", { length: 255 }),
  jobPreferences: text("job_preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
