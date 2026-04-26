import { loadStripe, type Stripe } from "@stripe/stripe-js";

export type StripeEnv = "sandbox" | "live";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;
const environment: StripeEnv = clientToken?.startsWith("pk_test_") ? "sandbox" : "live";
let stripePromise: Promise<Stripe | null> | null = null;

export const PLANS = {
  free: {
    name: "Free",
    price_monthly: 0,
    price_yearly: 0,
    searches_per_day: 5,
    features: ["5 searches per day", "Global sources", "Top recommendation only", "Basic score breakdown"],
    stripe_monthly_price_id: null,
    stripe_yearly_price_id: null,
  },
  pro: {
    name: "Pro",
    price_monthly: 9,
    price_yearly: 84,
    searches_per_day: -1,
    features: [
      "Unlimited searches",
      "All countries & regions",
      "Full recommendation (🥇🥈❌)",
      "Complete score breakdown",
      "Full verified source list",
      "PDF export & print",
      "Save & compare up to 20 results",
      "Weekly email digest",
      "Price & update alerts",
      "Early access to new categories",
    ],
    stripe_monthly_price_id: "pro_monthly",
    stripe_yearly_price_id: "pro_yearly",
  },
  business: {
    name: "Business",
    price_monthly: 49,
    price_yearly: 468,
    searches_per_day: -1,
    features: [
      "Everything in Pro",
      "API access (1,000 queries/month)",
      "Bulk category analysis",
      "B2B market insight reports",
      "White-label result embedding",
      "Custom country/category packages",
      "Priority support (< 4h response)",
      "Dedicated account manager",
      "Invoice billing available",
    ],
    stripe_monthly_price_id: "business_monthly",
    stripe_yearly_price_id: "business_yearly",
  },
} as const;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!clientToken) throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");
    stripePromise = loadStripe(clientToken);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return environment;
}
