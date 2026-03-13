import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, jobListings, savedJobs, jobApplications, InsertJobListing,
  resumes, InsertResume, Resume,
  jobPostings, InsertJobPosting, JobPosting, jobPostingApplications, InsertJobPostingApplication
} from "../drizzle/schema";
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
    } else {
      // 새 사용자는 기본값으로 'user' 역할을 가짐
      values.role = 'user';
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
  
  try {
    const conditions = [eq(jobListings.isActive, 1)];
    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(jobListings.category, filters.category));
    }
    if (filters?.location && filters.location !== "all") {
      conditions.push(eq(jobListings.location, filters.location));
    }
    return await db
      .select()
      .from(jobListings)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .limit(50);
  } catch (error) {
    console.error("[Database] getJobListings error:", error);
    return [];
  }
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

// Resume Management Functions

export async function createResume(data: InsertResume): Promise<Resume | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(resumes).values(data);
    return data as Resume;
  } catch (error) {
    console.error("Failed to create resume:", error);
    return null;
  }
}

export async function getUserResumes(userId: number): Promise<Resume[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId));
  } catch (error) {
    console.error("Failed to get user resumes:", error);
    return [];
  }
}

export async function getResumeById(resumeId: number): Promise<Resume | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get resume:", error);
    return null;
  }
}

export async function updateResume(resumeId: number, data: Partial<InsertResume>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(resumes)
      .set(data)
      .where(eq(resumes.id, resumeId));
    return true;
  } catch (error) {
    console.error("Failed to update resume:", error);
    return false;
  }
}

export async function deleteResume(resumeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(resumes)
      .where(eq(resumes.id, resumeId));
    return true;
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return false;
  }
}

export async function setDefaultResume(userId: number, resumeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Reset all resumes for this user
    await db
      .update(resumes)
      .set({ isDefault: 0 })
      .where(eq(resumes.userId, userId));

    // Set the selected resume as default
    await db
      .update(resumes)
      .set({ isDefault: 1 })
      .where(eq(resumes.id, resumeId));

    return true;
  } catch (error) {
    console.error("Failed to set default resume:", error);
    return false;
  }
}

export async function applyForJobWithResume(userId: number, jobId: number, resumeId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .insert(jobApplications)
      .values({ userId, jobId, resumeId, status: "applied" });
    return true;
  } catch (error) {
    console.error("Failed to apply for job:", error);
    return false;
  }
}

// Job Posting Management Functions

export async function createJobPosting(data: InsertJobPosting): Promise<JobPosting | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(jobPostings).values(data);
    return data as JobPosting;
  } catch (error) {
    console.error("Failed to create job posting:", error);
    return null;
  }
}

export async function getEmployerJobPostings(employerId: number): Promise<JobPosting[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.employerId, employerId));
  } catch (error) {
    console.error("Failed to get employer job postings:", error);
    return [];
  }
}

export async function getJobPostingById(jobPostingId: number): Promise<JobPosting | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.id, jobPostingId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get job posting:", error);
    return null;
  }
}

export async function updateJobPosting(jobPostingId: number, data: Partial<InsertJobPosting>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(jobPostings)
      .set(data)
      .where(eq(jobPostings.id, jobPostingId));
    return true;
  } catch (error) {
    console.error("Failed to update job posting:", error);
    return false;
  }
}

export async function deleteJobPosting(jobPostingId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(jobPostings)
      .where(eq(jobPostings.id, jobPostingId));
    return true;
  } catch (error) {
    console.error("Failed to delete job posting:", error);
    return false;
  }
}

export async function createJobPostingApplication(data: InsertJobPostingApplication): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(jobPostingApplications).values(data);
    return true;
  } catch (error) {
    console.error("Failed to create job posting application:", error);
    return false;
  }
}

export async function getJobPostingApplications(jobPostingId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(jobPostingApplications)
      .where(eq(jobPostingApplications.jobPostingId, jobPostingId));
  } catch (error) {
    console.error("Failed to get job posting applications:", error);
    return [];
  }
}
