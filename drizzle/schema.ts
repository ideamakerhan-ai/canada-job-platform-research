import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * CanadaJobBoard v1.0 - 고용주 중심의 채용 플랫폼
 * 
 * 주요 테이블:
 * - users: 고용주 및 구직자
 * - employers: 고용주 정보
 * - payment_packages: 결제 패키지
 * - payments: 결제 이력
 * - job_postings: 공고
 * - job_applications: 지원자
 */

// 사용자 테이블 (고용주 및 구직자)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "employer"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 고용주 정보 테이블
export const employers = mysqlTable("employers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyEmail: varchar("company_email", { length: 320 }).notNull(),
  companyPhone: varchar("company_phone", { length: 20 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  companyDescription: text("company_description"),
  industry: varchar("industry", { length: 100 }),
  employeeCount: varchar("employee_count", { length: 50 }),
  isVerified: int("is_verified").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Employer = typeof employers.$inferSelect;
export type InsertEmployer = typeof employers.$inferInsert;

// 결제 패키지 테이블
export const paymentPackages = mysqlTable("payment_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("CAD").notNull(),
  jobSlots: int("job_slots").notNull(), // 동시에 올릴 수 있는 공고 수
  durationDays: int("duration_days").notNull(), // 공고 게시 기간 (일)
  features: text("features"), // JSON 형식의 기능 목록
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PaymentPackage = typeof paymentPackages.$inferSelect;
export type InsertPaymentPackage = typeof paymentPackages.$inferInsert;

// 결제 이력 테이블
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employer_id").notNull(),
  packageId: int("package_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("CAD").notNull(),
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// 공고 테이블
export const jobPostings = mysqlTable("job_postings", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employer_id").notNull(),
  
  // 필수 필드
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), // 도시, 주
  jobType: mysqlEnum("job_type", ["full-time", "part-time", "contract", "temporary", "freelance"]).notNull(),
  salary: varchar("salary", { length: 100 }).notNull().default(""),
  
  // 선택 필드
  description: text("description").notNull().default(""),
  requirements: text("requirements").notNull().default(""),
  benefits: text("benefits").notNull().default(""),
  contactEmail: varchar("contact_email", { length: 320 }).notNull().default(""),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull().default(""),
  
  // 상태
  status: mysqlEnum("status", ["active", "closed", "draft"]).default("active").notNull(),
  expiresAt: timestamp("expires_at"),
  
  // 메타데이터
  viewCount: int("view_count").default(0).notNull(),
  applicationCount: int("application_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

// 공고 지원 테이블
export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("job_id").notNull(),
  employerId: int("employer_id").notNull(),
  
  // 지원자 정보
  applicantName: varchar("applicant_name", { length: 255 }).notNull(),
  applicantEmail: varchar("applicant_email", { length: 320 }).notNull(),
  applicantPhone: varchar("applicant_phone", { length: 20 }).notNull().default(""),
  applicantMessage: text("applicant_message").notNull().default(""),
  
  // 상태
  status: mysqlEnum("status", ["applied", "reviewed", "rejected", "accepted"]).default("applied").notNull(),
  
  // 메타데이터
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;
