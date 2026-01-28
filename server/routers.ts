import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getJobListings, getJobById, saveJob, applyForJob, getSavedJobs, getUserApplications } from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;
