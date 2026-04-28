import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { cn } from "@/lib/utils";

const STRIPE_PRICES = {
  pro_monthly: "price_1TQQhZ6NvmaIR5d662w4MVtT",
  pro_yearly: "price_1TQQil6NvmaIR5d6nly0iWNR",
  business_monthly: "price_1TQQjc6NvmaIR5d6A99MebfU",
  business_yearly: "price_1TQQkN6NvmaIR5d6CTowCElR",
};

const plans = [
  {
    name: "Free",
    monthly: "€0",
    annual: "€0",
    suffix: "/month",
    button: "Get started free",
    variant: "ghost" as const,
    featured: false,
    included: ["5 searches per day", "Global sources", "Top recommendation only", "Basic score breakdown"],
    excluded: ["Country-specific filtering", "Full source list", "PDF export", "Save & compare results", "Email alerts", "Priority updates"],
  },
  {
    name: "Pro",
    monthly: "€9",
    annual: "€7",
    suffix: "/mo billed annually",
    button: "Start Pro – 14 days free",
    variant: "amber" as const,
    featured: true,
    included: ["Unlimited searches", "All countries & regions", "Full recommendation (🥇🥈❌)", "Complete score breakdown", "Full verified source list", "PDF export & print", "Save & compare up to 20 results", "Weekly email digest", "Price & update alerts", "Early access to new categories"],
    excluded: ["API access", "B2B data reports"],
  },
  {
    name: "Business",
    monthly: "€49",
    annual: "€39",
    suffix: "/mo annually",
    button: "Get Business",
    variant: "secondary" as const,
    featured: false,
    included: ["Everything in Pro", "API access (1,000 queries/month)", "Bulk category analysis", "B2B market insight reports", "White-label result embedding", "Custom country/category packages", "Priority support (< 4h response)", "Dedicated account manager", "Invoice billing available"],
    excluded: [],
  },
];

const matrix = [
  ["Daily searches", "5/day", "Unlimited", "Unlimited"],
  ["Country-specific filtering", false, true, true],
  ["Full recommendation layouts", false, true, true],
  ["Complete score breakdown", false, true, true],
  ["Full verified source list", false, true, true],
  ["PDF export & print", false, true, true],
  ["Save & compare results", false, "20 results", "Unlimited"],
  ["Email alerts", false, true, true],
  ["API access", false, false, "1,000 queries/month"],
  ["B2B market reports", false, false, true],
  ["Priority support", false, false, "< 4h response"],
];

const faqs = [
  ["How does the free plan work?", "Free gives you 5 searches per day, global source coverage, the top recommendation, and a basic score breakdown."],
  ["Can I cancel anytime?", "Yes. You can cancel monthly or annual plans anytime with no hidden fees or cancellation penalties."],
  ["What payment methods do you accept?", "RankFinal accepts all major credit and debit cards via Stripe. Business customers can request invoice billing."],
  ["How are results kept up to date?", "Financial, insurance, and energy categories update daily; electronics and vehicles update weekly; outdoor and sports update monthly."],
  ["Is RankFinal completely independent?", "Yes. RankFinal rankings are based on verified independent sources and scoring criteria, not sponsorship placements."],
  ["Do you receive money from brands you recommend?", "No. RankFinal receives no payment from reviewed brands and does not sell recommendation placement."],
];

function FeatureRow({ children, included }: { children: React.ReactNode; included: boolean }) {
  return (
    <li className="flex gap-3 text-sm leading-6">
      {included ? (
        <Check className="mt-1 size-4 shrink-0 text-success" />
      ) : (
        <X className="mt-1 size-4 shrink-0 text-destructive" />
      )}
      <span className={included ? "text-text-primary" : "text-text-secondary"}>
        {children}
      </span>
    </li>
  );
}

function MatrixValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto size-5 text-success" />;
  if (value === false) return <X className="mx-auto size-5 text-destructive" />;
  return <span className="font-semibold text-text-primary">{value}</span>;
}

async function redirectToStripe(priceId: string) {
  try {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("No URL returned from checkout");
    }
  } catch (error) {
    console.error("Stripe checkout error:", error);
  }
}

export default function Pricing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanClick = async (planName: string) => {
    if (planName === "Free") {
      navigate("/");
      return;
    }

    if (planName === "Business") {
      const priceId = annual
        ? STRIPE_PRICES.business_yearly
        : STRIPE_PRICES.business_monthly;
      setLoading(planName);
      await redirectToStripe(priceId);
      setLoading(null);
      return;
    }

    if (planName === "Pro") {
      const priceId = annual
        ? STRIPE_PRICES.pro_yearly
        : STRIPE_PRICES.pro_monthly;
      setLoading(planName);
      await redirectToStripe(priceId);
      setLoading(null);
      return;
    }
  };

  return (
    <PageWrapper className="space-y-16 py-10 lg:py-16">

      {/* Header */}
      <section className="mx-auto max-w-4xl space-y-6 text-center">
        <Badge variant="amber">Pricing</Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">
            Choose the plan that fits your needs
          </h1>
          <p className="text-lg font-medium text-text-secondary">
            All prices in Euro. Cancel anytime. No hidden fees.
          </p>
        </div>
        <div className="mx-auto inline-flex items-center rounded-pill border border-border bg-surface p-1 shadow-surface">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={cn(
              "rounded-pill px-5 py-2 text-sm font-bold transition-all",
              !annual
                ? "bg-accent-amber text-primary-foreground"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={cn(
              "rounded-pill px-5 py-2 text-sm font-bold transition-all",
              annual
                ? "bg-accent-amber text-primary-foreground"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Annual{" "}
            <span className="ml-1 opacity-80">2 months free</span>
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="grid gap-5 lg:grid-cols-3" aria-label="Pricing plans">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.name === "Free" && "border-accent-purple",
              plan.featured &&
                "border-accent-amber shadow-amber lg:-translate-y-3"
            )}
          >
            {plan.featured && (
              <Badge variant="amber" className="absolute right-5 top-5">
                Most popular
              </Badge>
            )}
            {plan.name === "Free" && (
              <Badge variant="gray" className="absolute right-5 top-5">
                Current plan
              </Badge>
            )}
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div>
                <span className="text-5xl font-extrabold text-text-primary">
                  {annual ? plan.annual : plan.monthly}
                </span>
                <span className="ml-1 text-sm font-semibold text-text-secondary">
                  {annual && plan.name !== "Free" ? plan.suffix : "/month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <ul className="space-y-3">
                {plan.included.map((feature) => (
                  <FeatureRow key={feature} included>
                    {feature}
                  </FeatureRow>
                ))}
                {plan.excluded.map((feature) => (
                  <FeatureRow key={feature} included={false}>
                    {feature}
                  </FeatureRow>
                ))}
              </ul>
              <Button
                variant={plan.name === "Free" ? "ghost" : plan.variant}
                size="lg"
                className="mt-auto w-full"
                disabled={loading === plan.name}
                onClick={() => handlePlanClick(plan.name)}
              >
                {loading === plan.name ? "Loading..." : plan.button}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Feature Matrix */}
      <section className="space-y-6" aria-labelledby="comparison">
        <div className="space-y-2 text-center">
          <Badge variant="purple">Compare</Badge>
          <h2
            id="comparison"
            className="text-3xl font-extrabold text-text-primary"
          >
            Full feature matrix
          </h2>
        </div>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-text-secondary">Feature</th>
                  <th className="p-4 text-center text-text-primary">Free</th>
                  <th className="p-4 text-center text-accent-amber">Pro</th>
                  <th className="p-4 text-center text-text-primary">Business</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map(([feature, free, pro, business]) => (
                  <tr
                    key={String(feature)}
                    className="border-b border-border"
                  >
                    <td className="p-4 font-bold text-text-primary">
                      {feature}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      <MatrixValue value={free} />
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      <MatrixValue value={pro} />
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      <MatrixValue value={business} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section
        className="mx-auto max-w-3xl space-y-5"
        aria-labelledby="faq"
      >
        <div className="text-center">
          <Badge variant="gray">FAQ</Badge>
          <h2
            id="faq"
            className="mt-4 text-3xl font-extrabold text-text-primary"
          >
            Questions before you choose?
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map(([question, answer], index) => (
            <Card key={question} className="hover:shadow-surface">
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? -1 : index)
                }
                className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-extrabold text-text-primary">
                  {question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-accent-amber transition-transform",
                    openFaq === index && "rotate-180"
                  )}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-sm leading-7 text-text-secondary animate-fade-in">
                  {answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-card border border-accent-amber/60 bg-surface p-6 text-center shadow-amber sm:p-10">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="text-3xl font-extrabold text-text-primary">
            Still not sure? Try Pro free for 14 days.
          </h2>
          <Button
            variant="amber"
            size="lg"
            onClick={() => handlePlanClick("Pro")}
            disabled={loading === "Pro"}
          >
            {loading === "Pro" ? "Loading..." : "Start free trial"}
          </Button>
        </div>
      </section>

    </PageWrapper>
  );
}
