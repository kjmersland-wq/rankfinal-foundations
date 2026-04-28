'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase-client';

const STRIPE_PRICES = {
  pro_monthly: 'price_1TQQhZ6NvmaIR5d662w4MVtT',
  pro_yearly: 'price_1TQQil6NvmaIR5d6nly0iWNR',
  business_monthly: 'price_1TQQjc6NvmaIR5d6A99MebfU',
  business_yearly: 'price_1TQQkN6NvmaIR5d6CTowCElR',
};

const plans = [
  {
    name: 'Free',
    monthly: '€0',
    annual: '€0',
    button: 'Get started free',
    featured: false,
    included: ['5 searches per day', 'Global sources', 'Top recommendation only', 'Basic score breakdown'],
    excluded: ['Country filtering', 'Full source list', 'PDF export', 'Save results', 'Email alerts'],
  },
  {
    name: 'Pro',
    monthly: '€9',
    annual: '€7',
    button: 'Start Pro – 14 days free',
    featured: true,
    included: ['Unlimited searches', 'All countries & regions', 'Full recommendations', 'Complete score breakdown', 'Full verified source list', 'PDF export', 'Save & compare up to 20 results', 'Email alerts', 'Early access to new categories'],
    excluded: ['API access', 'B2B data reports'],
  },
  {
    name: 'Business',
    monthly: '€49',
    annual: '€39',
    button: 'Get Business',
    featured: false,
    included: ['Everything in Pro', 'API access (1,000 queries/month)', 'Bulk category analysis', 'B2B market insight reports', 'White-label result embedding', 'Priority support (< 4h response)', 'Dedicated account manager'],
    excluded: [],
  },
];

function FeatureRow({ children, included }: { children: React.ReactNode; included: boolean }) {
  return (
    <li className="flex gap-3 text-sm leading-6">
      {included ? (
        <Check className="mt-1 h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <X className="mt-1 h-4 w-4 shrink-0 text-red-500" />
      )}
      <span className={included ? '' : 'text-muted-foreground'}>
        {children}
      </span>
    </li>
  );
}

export function PricingPlans() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePlanClick(planName: string) {
    if (planName === 'Free') {
      router.push('/');
      return;
    }

    setLoading(planName);

    try {
      // Check if user is authenticated
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to signin with redirect back to pricing
        router.push(`/signin?redirect=${encodeURIComponent('/pricing')}`);
        return;
      }

      // Determine which price ID to use
      let priceId: string;
      if (planName === 'Business') {
        priceId = annual ? STRIPE_PRICES.business_yearly : STRIPE_PRICES.business_monthly;
      } else if (planName === 'Pro') {
        priceId = annual ? STRIPE_PRICES.pro_yearly : STRIPE_PRICES.pro_monthly;
      } else {
        return;
      }

      // Call the checkout API
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {/* Toggle for annual/monthly */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <span className={`text-sm font-semibold ${!annual ? 'text-accent-amber' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2"
          style={{ backgroundColor: annual ? '#f59e0b' : '#d1d5db' }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              annual ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-semibold ${annual ? 'text-accent-amber' : 'text-muted-foreground'}`}>
          Annual <span className="text-xs">(save 22%)</span>
        </span>
      </div>

      {/* Plans Grid */}
      <section className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.featured ? 'border-accent-amber shadow-lg lg:-translate-y-3' : ''}
          >
            {plan.featured && (
              <div className="absolute right-5 top-5 inline-flex items-center rounded-full border border-accent-amber/40 bg-accent-amber/20 px-3 py-1 text-xs font-semibold text-accent-amber">
                Most popular
              </div>
            )}
            <CardHeader className="space-y-4 relative">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div>
                <span className="text-5xl font-extrabold">
                  {annual ? plan.annual : plan.monthly}
                </span>
                <span className="ml-1 text-sm font-semibold text-muted-foreground">
                  /month {annual && plan.name !== 'Free' && '(billed annually)'}
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
                variant={plan.name === 'Free' ? 'ghost' : plan.featured ? 'default' : 'secondary'}
                size="lg"
                onClick={() => handlePlanClick(plan.name)}
                disabled={loading === plan.name}
                className={plan.featured ? 'w-full bg-accent-amber hover:bg-accent-amber/90' : 'w-full'}
              >
                {loading === plan.name ? 'Loading...' : plan.button}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
