import Stripe from "stripe";
import { getDb } from "../db";
import { payments, employerProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// Note: Stripe SDK handles API versioning automatically

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(
  body: Buffer,
  signature: string
): Promise<void> {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    throw new Error("Webhook signature verification failed");
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      await handleCheckoutSessionCompleted(session);
    } catch (err) {
      console.error("Error handling checkout.session.completed:", err);
      throw err;
    }
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get metadata from session
  const employerId = session.metadata?.employerId;
  const packageType = session.metadata?.packageType;

  if (!employerId || !packageType) {
    console.error("Missing metadata in session:", session.id);
    return;
  }

  // Determine job posting count based on package type
  let jobPostingCount = 0;
  switch (packageType) {
    case "1":
      jobPostingCount = 1;
      break;
    case "5":
      jobPostingCount = 5;
      break;
    case "10":
      jobPostingCount = 10;
      break;
    default:
      console.error("Unknown package type:", packageType);
      return;
  }

  try {
    // Update payment status to completed
    await db
      .update(payments)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(payments.stripePaymentId, session.payment_intent as string));

    // Get current credits
    const employerProfile = await db
      .select()
      .from(employerProfiles)
      .where(eq(employerProfiles.userId, parseInt(employerId)))
      .limit(1);

    if (employerProfile.length === 0) {
      console.error("Employer profile not found:", employerId);
      return;
    }

    const currentCredits = employerProfile[0].jobPostingCredits || 0;
    const newCredits = currentCredits + jobPostingCount;

    // Update employer credits
    await db
      .update(employerProfiles)
      .set({
        jobPostingCredits: newCredits,
      })
      .where(eq(employerProfiles.userId, parseInt(employerId)));

    console.log(
      `✓ Payment completed: Employer ${employerId} received ${jobPostingCount} credits (total: ${newCredits})`
    );
  } catch (err) {
    console.error("Error updating payment and credits:", err);
    throw err;
  }
}
