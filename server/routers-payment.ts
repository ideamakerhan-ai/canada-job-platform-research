import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { payments } from "../drizzle/schema";

export const paymentRouter = router({
  createCheckoutSession: publicProcedure
    .input(z.object({
      packageType: z.enum(["1", "5", "10"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      
      // Define package details
      const packages: Record<string, { name: string; amount: number; credits: number }> = {
        "1": { name: "1 Job Posting", amount: 9900, credits: 1 },
        "5": { name: "5 Job Postings", amount: 39900, credits: 5 },
        "10": { name: "10 Job Postings", amount: 69900, credits: 10 },
      };

      const pkg = packages[input.packageType];
      if (!pkg) throw new Error("Invalid package type");

      // Import Stripe dynamically
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

      try {
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "cad",
                product_data: {
                  name: pkg.name,
                  description: `Post ${pkg.credits} job listing${pkg.credits > 1 ? "s" : ""} on CanadaJobBoard`,
                },
                unit_amount: pkg.amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/employer-dashboard?payment=success`,
          cancel_url: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/payment-checkout`,
          metadata: {
            employerId: ctx.user.id.toString(),
            packageType: input.packageType,
          },
        });

        // Save payment record to database
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.insert(payments).values({
          employerId: ctx.user.id,
          stripePaymentId: session.payment_intent as string,
          packageType: input.packageType,
          amount: pkg.amount,
          currency: "CAD",
          jobPostingCount: pkg.credits,
          status: "pending",
        });

        return {
          checkoutUrl: session.url || "",
          sessionId: session.id,
        };
      } catch (err) {
        console.error("Error creating checkout session:", err);
        throw new Error("Failed to create checkout session");
      }
    }),
});
