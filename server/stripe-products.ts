/**
 * Stripe Products and Pricing for Job Postings
 * Define all products and their prices here for centralized management
 */

export const STRIPE_PRODUCTS = {
  SINGLE_POSTING: {
    name: "Single Job Posting",
    description: "Post 1 job listing",
    postingCount: 1,
    priceInCents: 2999, // $29.99 CAD
  },
  FIVE_POSTINGS: {
    name: "5 Job Postings",
    description: "Post 5 job listings",
    postingCount: 5,
    priceInCents: 12499, // $124.99 CAD (20% discount)
  },
  TEN_POSTINGS: {
    name: "10 Job Postings",
    description: "Post 10 job listings",
    postingCount: 10,
    priceInCents: 19999, // $199.99 CAD (33% discount)
  },
  MONTHLY_UNLIMITED: {
    name: "Monthly Unlimited",
    description: "Unlimited job postings for 30 days",
    postingCount: -1, // -1 means unlimited
    priceInCents: 9999, // $99.99 CAD per month
  },
};

export type PackageType = keyof typeof STRIPE_PRODUCTS;

export function getPackageInfo(packageType: PackageType) {
  return STRIPE_PRODUCTS[packageType];
}

export function getAllPackages() {
  return Object.entries(STRIPE_PRODUCTS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}
