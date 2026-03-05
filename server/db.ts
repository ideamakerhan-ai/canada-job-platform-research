import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobListings, savedJobs, jobApplications, InsertJobListing } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getJobListings(filters?: {
  category?: string;
  location?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(jobListings.status, "active")];

  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(jobListings.category, filters.category));
  }

  if (filters?.location && filters.location !== "all") {
    conditions.push(eq(jobListings.city, filters.location));
  }

  return await db
    .select()
    .from(jobListings)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .limit(50);
}

export async function getJobById(jobId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(jobListings)
    .where(eq(jobListings.id, jobId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function saveJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(savedJobs).values({ userId, jobId });
    return true;
  } catch (error) {
    console.error("Failed to save job:", error);
    return false;
  }
}

export async function getSavedJobs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(savedJobs)
    .where(eq(savedJobs.userId, userId));
}

export async function applyForJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .insert(jobApplications)
      .values({ userId, jobId, status: "applied" });
    return true;
  } catch (error) {
    console.error("Failed to apply for job:", error);
    return false;
  }
}

export async function getUserApplications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(jobApplications)
    .where(eq(jobApplications.userId, userId));
}

export async function createJobListing(data: InsertJobListing) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create job listing: database not available");
    return null;
  }

  try {
    const result = await db.insert(jobListings).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create job listing:", error);
    throw error;
  }
}
