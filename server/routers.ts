import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { users, jobPostings, jobApplications, employers, paymentPackages, payments } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

// Employer procedure - checks if user is employer
const employerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "employer") {
    throw new Error("Unauthorized: Employer access required");
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 구직자 관련 라우터
  job: router({
    // 공고 검색 (지역 + 키워드)
    search: publicProcedure
      .input(z.object({
        location: z.string().optional(),
        keyword: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const conditions = [eq(jobPostings.status, "active")];

        if (input?.location && input.location !== "all") {
          conditions.push(eq(jobPostings.location, input.location));
        }

        if (input?.keyword) {
          conditions.push(eq(jobPostings.jobTitle, input.keyword));
        }

        return await db.select().from(jobPostings)
          .where(and(...conditions))
          .orderBy(desc(jobPostings.createdAt));
      }),

    // 공고 상세 조회
    getDetail: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const job = await db.select().from(jobPostings).where(eq(jobPostings.id, input));
        return job[0] || null;
      }),

    // 공고에 지원
    apply: publicProcedure
      .input(z.object({
        jobId: z.number(),
        applicantName: z.string(),
        applicantEmail: z.string().email(),
        applicantPhone: z.string().optional(),
        applicantMessage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // 공고 조회
        const job = await db.select().from(jobPostings).where(eq(jobPostings.id, input.jobId));
        if (!job[0]) throw new Error("Job not found");

        // 지원 저장
        await db.insert(jobApplications).values({
          jobId: input.jobId,
          employerId: job[0].employerId,
          applicantName: input.applicantName,
          applicantEmail: input.applicantEmail,
          applicantPhone: input.applicantPhone || "",
          applicantMessage: input.applicantMessage || "",
          status: "applied",
        });

        // 공고의 지원자 수 증가
        await db.update(jobPostings)
          .set({ applicationCount: job[0].applicationCount + 1 })
          .where(eq(jobPostings.id, input.jobId));

        return { success: true };
      }),
  }),

  // 고용주 관련 라우터
  employer: router({
    // 고용주 정보 조회
    getProfile: employerProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employer = await db.select().from(employers).where(eq(employers.userId, ctx.user.id));
      return employer[0] || null;
    }),

    // 고용주 정보 생성/업데이트
    updateProfile: employerProcedure
      .input(z.object({
        companyName: z.string(),
        companyEmail: z.string().email(),
        companyPhone: z.string().optional(),
        companyWebsite: z.string().optional(),
        companyDescription: z.string().optional(),
        industry: z.string().optional(),
        employeeCount: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const existing = await db.select().from(employers).where(eq(employers.userId, ctx.user.id));

        if (existing[0]) {
          await db.update(employers)
            .set(input)
            .where(eq(employers.userId, ctx.user.id));
        } else {
          await db.insert(employers).values({
            userId: ctx.user.id,
            ...input,
          });
        }

        return { success: true };
      }),

    // 공고 목록 조회
    getJobPostings: employerProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employer = await db.select().from(employers).where(eq(employers.userId, ctx.user.id));
      if (!employer[0]) throw new Error("Employer profile not found");

      return await db.select().from(jobPostings)
        .where(eq(jobPostings.employerId, employer[0].id))
        .orderBy(desc(jobPostings.createdAt));
    }),

    // 공고 생성
    createJobPosting: employerProcedure
      .input(z.object({
        jobTitle: z.string(),
        companyName: z.string(),
        location: z.string(),
        jobType: z.enum(["full-time", "part-time", "contract", "temporary", "freelance"]),
        salary: z.string().optional(),
        description: z.string().optional(),
        requirements: z.string().optional(),
        benefits: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const employer = await db.select().from(employers).where(eq(employers.userId, ctx.user.id));
        if (!employer[0]) throw new Error("Employer profile not found");

        await db.insert(jobPostings).values({
          employerId: employer[0].id,
          ...input,
          status: "active",
        });

        return { success: true };
      }),

    // 공고 수정
    updateJobPosting: employerProcedure
      .input(z.object({
        jobId: z.number(),
        jobTitle: z.string().optional(),
        companyName: z.string().optional(),
        location: z.string().optional(),
        jobType: z.enum(["full-time", "part-time", "contract", "temporary", "freelance"]).optional(),
        salary: z.string().optional(),
        description: z.string().optional(),
        requirements: z.string().optional(),
        benefits: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { jobId, ...updateData } = input;

        await db.update(jobPostings)
          .set(updateData)
          .where(eq(jobPostings.id, jobId));

        return { success: true };
      }),

    // 공고 삭제
    deleteJobPosting: employerProcedure
      .input(z.number())
      .mutation(async ({ input: jobId }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(jobPostings).where(eq(jobPostings.id, jobId));
        return { success: true };
      }),

    // 공고 마감
    closeJobPosting: employerProcedure
      .input(z.number())
      .mutation(async ({ input: jobId }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.update(jobPostings)
          .set({ status: "closed" })
          .where(eq(jobPostings.id, jobId));

        return { success: true };
      }),

    // 지원자 목록 조회
    getApplications: employerProcedure
      .input(z.number())
      .query(async ({ input: jobId }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.select().from(jobApplications)
          .where(eq(jobApplications.jobId, jobId))
          .orderBy(desc(jobApplications.appliedAt));
      }),

    // 지원자 상태 업데이트
    updateApplicationStatus: employerProcedure
      .input(z.object({
        applicationId: z.number(),
        status: z.enum(["applied", "reviewed", "rejected", "accepted"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.update(jobApplications)
          .set({ status: input.status })
          .where(eq(jobApplications.id, input.applicationId));

        return { success: true };
      }),
  }),

  // 결제 관련 라우터
  payment: router({
    // 패키지 목록 조회
    getPackages: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db.select().from(paymentPackages)
        .where(eq(paymentPackages.isActive, 1));
    }),

    // 결제 이력 조회
    getPaymentHistory: employerProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employer = await db.select().from(employers).where(eq(employers.userId, ctx.user.id));
      if (!employer[0]) throw new Error("Employer profile not found");

      return await db.select().from(payments)
        .where(eq(payments.employerId, employer[0].id))
        .orderBy(desc(payments.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
