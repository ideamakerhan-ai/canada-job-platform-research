import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const PACKAGES = [
  {
    id: "SINGLE_POSTING",
    name: "Single Job Posting",
    description: "Post 1 job listing",
    postingCount: 1,
    price: 29.99,
    priceInCents: 2999,
    features: ["1 job posting", "30 days visibility", "Email notifications"],
  },
  {
    id: "FIVE_POSTINGS",
    name: "5 Job Postings",
    description: "Post 5 job listings",
    postingCount: 5,
    price: 124.99,
    priceInCents: 12499,
    features: ["5 job postings", "30 days visibility each", "Email notifications", "20% savings"],
    popular: true,
  },
  {
    id: "TEN_POSTINGS",
    name: "10 Job Postings",
    description: "Post 10 job listings",
    postingCount: 10,
    price: 199.99,
    priceInCents: 19999,
    features: ["10 job postings", "30 days visibility each", "Email notifications", "33% savings"],
  },
];

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to purchase job posting packages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You need to be signed in to purchase job posting packages.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSelectPackage = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsLoading(true);

    try {
      // Map package ID to correct enum value
      let packageType: "1" | "5" | "10" = "1";
      if (packageId === "FIVE_POSTINGS") packageType = "5";
      if (packageId === "TEN_POSTINGS") packageType = "10";

      const result = await createCheckoutMutation.mutateAsync({
        packageType,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to create checkout session. Please try again.");
    } finally {
      setIsLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Choose Your Package</h1>
          <p className="text-slate-600">Select a job posting package that works for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative flex flex-col transition-all ${
                pkg.popular ? "ring-2 ring-red-500 scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-500 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-slate-900 mb-1">
                    ${pkg.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-slate-600">CAD</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={isLoading && selectedPackage === pkg.id}
                  className={`w-full ${pkg.popular ? "bg-red-500 hover:bg-red-600" : ""}`}
                >
                  {isLoading && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Select Package"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💳 Test Payment</h3>
          <p className="text-sm text-blue-800">
            Use card number <code className="font-mono bg-white px-2 py-1 rounded">4242 4242 4242 4242</code> for testing.
            Use any future expiration date and any 3-digit CVC.
          </p>
        </div>
      </div>
    </div>
  );
}
