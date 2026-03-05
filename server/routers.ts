import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getJobListings, getJobById, saveJob, applyForJob, getSavedJobs, getUserApplications, createJobListing } from "./db";

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
        
        const locationParts = input.location.split(",");
        const city = locationParts[0].trim();
        const province = locationParts.length > 1 ? locationParts[1].trim() : "ON";

        const jobData = {
          title: input.title,
          company: input.company,
          city,
          province,
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
});

export type AppRouter = typeof appRouter;
