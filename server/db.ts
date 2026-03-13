import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobPostings, jobApplications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _lastDbUrl: string | undefined;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const currentUrl = process.env.DATABASE_URL;
  
  // Recreate connection if DATABASE_URL changed (handles dev env changes)
  if (_lastDbUrl !== currentUrl) {
    _db = null;
    _lastDbUrl = currentUrl;
  }
  
  if (!_db && currentUrl) {
    try {
      _db = drizzle(currentUrl);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
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

    for (const field of textFields) {
      if (user[field] !== undefined) {
        values[field] = user[field];
        updateSet[field] = user[field];
      }
    }

    // Try to update, if no rows affected, insert
    const result = await db
      .update(users)
      .set(updateSet)
      .where(eq(users.openId, user.openId));

    // If no rows were updated, insert the user
    if (!result) {
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
    throw error;
  }
}

// Job Postings
export async function getJobPostings(employerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(jobPostings).where(eq(jobPostings.employerId, employerId));
  } catch (error) {
    console.error("[Database] Error getting job postings:", error);
    return [];
  }
}

// Job Applications
export async function getJobApplications(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
  } catch (error) {
    console.error("[Database] Error getting job applications:", error);
    return [];
  }
}

// Import eq for where clauses
import { eq } from "drizzle-orm";

// Get user by openId
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select().from(users).where(eq(users.openId, openId));
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting user by openId:", error);
    return null;
  }
}
