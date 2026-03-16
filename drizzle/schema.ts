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
  role: mysqlEnum("role", ["job_seeker", "employer", "admin"]).default("job_seeker").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
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
  location: varchar("location", { length: 255 }).notNull(),
  salary: varchar("salary", { length: 255 }),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  postedBy: int("posted_by").notNull(),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = typeof jobListings.$inferInsert;

// Extended job listing fields (stored separately or in application logic)
export interface ExtendedJobListing extends JobListing {
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  experienceRequired?: string;
  accommodation?: string;
  nocCode?: string;
  teerLevel?: number;
  lmiaAvailable?: number;
  visaSponsorship?: number;
  applicationMethod?: string;
  applicationEmail?: string;
  applicationLink?: string;
  expiresAt?: Date;
}

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
  resumeId: int("resume_id"),
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

// Resumes Table - Store multiple resumes per user
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  summary: text("summary"),
  experience: text("experience"),
  education: text("education"),
  skills: text("skills"),
  resumeUrl: varchar("resume_url", { length: 500 }),
  isDefault: int("is_default").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

// Recently Viewed Jobs Table
export const recentlyViewedJobs = mysqlTable("recently_viewed_jobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  jobId: int("job_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export type RecentlyViewedJob = typeof recentlyViewedJobs.$inferSelect;
export type InsertRecentlyViewedJob = typeof recentlyViewedJobs.$inferInsert;

// Job Postings Table (고용주가 작성한 공고)
export const jobPostings = mysqlTable("job_postings", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employer_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  salaryMin: int("salary_min"),
  salaryMax: int("salary_max"),
  salaryType: mysqlEnum("salary_type", ["annual", "hourly"]).default("annual").notNull(),
  currency: varchar("currency", { length: 10 }).default("CAD").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  lmiaAvailable: int("lmia_available").default(0).notNull(),
  visaSponsorship: int("visa_sponsorship").default(0).notNull(),
  accommodationProvided: int("accommodation_provided").default(0).notNull(),
  applicationEmail: varchar("application_email", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "closed", "archived"]).default("draft").notNull(),
  isActive: int("is_active").default(1).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

// Job Posting Applications Table (공고에 대한 지원)
export const jobPostingApplications = mysqlTable("job_posting_applications", {
  id: int("id").autoincrement().primaryKey(),
  jobPostingId: int("job_posting_id").notNull(),
  applicantEmail: varchar("applicant_email", { length: 320 }).notNull(),
  applicantName: varchar("applicant_name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "rejected", "accepted"]).default("new").notNull(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobPostingApplication = typeof jobPostingApplications.$inferSelect;
export type InsertJobPostingApplication = typeof jobPostingApplications.$inferInsert;

// Employer Profiles Table (고용주 프로필)
export const employerProfiles = mysqlTable("employer_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyWebsite: varchar("company_website", { length: 500 }),
  companyPhone: varchar("company_phone", { length: 20 }),
  companyDescription: text("company_description"),
  industryType: varchar("industry_type", { length: 100 }),
  employeeCount: varchar("employee_count", { length: 50 }),
  jobPostingCredits: int("job_posting_credits").default(0).notNull(), // 남은 공고 크레딧
  verificationStatus: mysqlEnum("verification_status", ["pending", "verified", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = typeof employerProfiles.$inferInsert;

// Payments Table (결제 기록)
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employer_id").notNull(),
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }).notNull().unique(),
  packageType: varchar("package_type", { length: 50 }).notNull(), // "single", "five", "ten", etc.
  amount: int("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 10 }).default("CAD").notNull(),
  jobPostingCount: int("job_posting_count").notNull(), // 1, 5, 10 등
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Job Posting Legal Compliance Table (법규 준수 정보)
export const jobPostingCompliance = mysqlTable("job_posting_compliance", {
  id: int("id").autoincrement().primaryKey(),
  jobPostingId: int("job_posting_id").notNull().unique(),
  usesAi: int("uses_ai").default(0).notNull(), // AI 사용 여부
  vacancyStatus: mysqlEnum("vacancy_status", ["existing", "future"]).default("existing").notNull(), // 기존 공석 또는 향후 예정
  interviewDate: timestamp("interview_date"), // 면접 날짜 (면접 후 통보용)
  notificationSentDate: timestamp("notification_sent_date"), // 통보 날짜
  canadianExperienceRequired: int("canadian_experience_required").default(0).notNull(), // 캐나다 경력 요구 여부 (위반 확인용)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobPostingCompliance = typeof jobPostingCompliance.$inferSelect;
export type InsertJobPostingCompliance = typeof jobPostingCompliance.$inferInsert;

// Job Posting Reports Table (사기성 공고 신고)
export const jobPostingReports = mysqlTable("job_posting_reports", {
  id: int("id").autoincrement().primaryKey(),
  jobPostingId: int("job_posting_id").notNull(),
  reporterEmail: varchar("reporter_email", { length: 320 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewed", "removed", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: int("reviewed_by"), // Admin user ID
});

export type JobPostingReport = typeof jobPostingReports.$inferSelect;
export type InsertJobPostingReport = typeof jobPostingReports.$inferInsert;

// Admin Dashboard Logs Table (관리자 활동 로그)
export const adminDashboardLogs = mysqlTable("admin_dashboard_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // "delete_posting", "verify_employer", "remove_report", etc.
  targetType: varchar("target_type", { length: 50 }).notNull(), // "job_posting", "employer", "report", etc.
  targetId: int("target_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminDashboardLog = typeof adminDashboardLogs.$inferSelect;
export type InsertAdminDashboardLog = typeof adminDashboardLogs.$inferInsert;

