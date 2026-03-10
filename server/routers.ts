import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getJobListings, getJobById, saveJob, applyForJob, getSavedJobs, getUserApplications, createJobListing, getDb } from "./db";
import { users, jobApplications, jobListings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Admin procedure - checks if user is admin
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
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

  job: router({
    search: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        location: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getJobListings(input);
      }),

    getDetail: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getJobById(input);
      }),

    saveJob: publicProcedure
      .input(z.object({
        jobId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await saveJob(ctx.user.id, input.jobId);
      }),

    applyJob: publicProcedure
      .input(z.object({
        jobId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await applyForJob(ctx.user.id, input.jobId);
      }),

    mySavedJobs: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) return [];
        return await getSavedJobs(ctx.user.id);
      }),

    myApplications: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) return [];
        return await getUserApplications(ctx.user.id);
      }),

    postJob: publicProcedure
      .input(z.object({
        title: z.string(),
        company: z.string(),
        location: z.string(),
        category: z.string(),
        description: z.string(),
        salaryType: z.enum(["hourly", "annual"]),
        salaryMin: z.number(),
        salaryMax: z.number(),
        jobType: z.string(),
        experienceRequired: z.string(),
        accommodation: z.string(),
        lmiaSponsorship: z.boolean(),
        visaSponsorship: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const jobData = {
          title: input.title,
          company: input.company,
          location: input.location,
          category: input.category,
          description: input.description,
          salaryType: input.salaryType,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          jobType: input.jobType,
          experienceRequired: input.experienceRequired,
          accommodation: input.accommodation,
          lmiaAvailable: input.lmiaSponsorship ? 1 : 0,
          visaSponsorship: input.visaSponsorship ? 1 : 0,
          postedBy: ctx.user.id,
          applicationMethod: "email",
          applicationEmail: ctx.user.email || "",
          status: "active",
        };

        return await createJobListing(jobData);
      }),
  }),

  admin: router({
    // Get dashboard stats
    stats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const totalApplications = await db.select().from(jobApplications);
      const totalJobs = await db.select().from(jobListings).where(eq(jobListings.status, "active"));
      const totalUsers = await db.select().from(users);

      return {
        totalApplications: totalApplications.length,
        totalJobs: totalJobs.length,
        totalUsers: totalUsers.length,
        recentApplications: totalApplications.slice(-5),
      };
    }),

    // Get all applications
    applications: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(jobApplications);
    }),

    // Get all jobs
    jobs: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(jobListings);
    }),

    // Get all users
    usersList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(users);
    }),

    // Delete job
    deleteJob: adminProcedure
      .input(z.number())
      .mutation(async ({ input: jobId }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(jobListings).where(eq(jobListings.id, jobId));
        return { success: true };
      }),

    // Update job status
    updateJobStatus: adminProcedure
      .input(z.object({
        jobId: z.number(),
        status: z.enum(["active", "inactive", "expired"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(jobListings)
          .set({ status: input.status })
          .where(eq(jobListings.id, input.jobId));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
