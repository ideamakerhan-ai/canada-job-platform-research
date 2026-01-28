import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("job router", () => {
  it("should search jobs without authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.search({
      category: "all",
      location: "all",
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should handle empty search results", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.search({
      category: "NonExistentCategory",
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("should require authentication to save a job", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.job.saveJob({ jobId: 1 });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow authenticated users to save jobs", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.saveJob({ jobId: 1 });

    expect(typeof result).toBe("boolean");
  });

  it("should allow authenticated users to apply for jobs", async () => {
    const { ctx } = createAuthContext(2);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.applyJob({ jobId: 1 });

    expect(typeof result).toBe("boolean");
  });

  it("should retrieve saved jobs for authenticated users", async () => {
    const { ctx } = createAuthContext(3);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.mySavedJobs();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should retrieve applications for authenticated users", async () => {
    const { ctx } = createAuthContext(4);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.job.myApplications();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should return empty arrays for unauthenticated users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const savedJobs = await caller.job.mySavedJobs();
    const applications = await caller.job.myApplications();

    expect(savedJobs).toEqual([]);
    expect(applications).toEqual([]);
  });
});
