import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingPlans } from './PricingPlans';

// Static Site Generation
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Pricing Plans & Features | RankFinal',
  description: 'Choose the perfect plan for your needs. Free plan with 5 searches per day. Pro plan with unlimited searches at €9/month. Business plan with API access at €49/month.',
  keywords: ['pricing', 'plans', 'subscription', 'rankfinal pricing', 'product research tool'],
  openGraph: {
    title: 'Pricing Plans & Features | RankFinal',
    description: 'Choose the perfect plan for your needs. Free plan available.',
    url: 'https://www.rankfinal.com/pricing',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RankFinal Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans & Features | RankFinal',
    description: 'Choose the perfect plan for your needs.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com/pricing',
  },
};

const faqs = [
  {
    question: "How does the free plan work?",
    answer: "Free gives you 5 searches per day, global source coverage, the top recommendation, and a basic score breakdown."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can cancel monthly or annual plans anytime with no hidden fees or cancellation penalties."
  },
  {
    question: "What payment methods do you accept?",
    answer: "RankFinal accepts all major credit and debit cards via Stripe. Business customers can request invoice billing."
  },
  {
    question: "How are results kept up to date?",
    answer: "Financial, insurance, and energy categories update daily; electronics and vehicles update weekly; outdoor and sports update monthly."
  },
  {
    question: "Is RankFinal completely independent?",
    answer: "Yes. RankFinal rankings are based on verified independent sources and scoring criteria, not sponsorship placements."
  },
  {
    question: "Do you receive money from brands you recommend?",
    answer: "No. RankFinal receives no payment from reviewed brands and does not sell recommendation placement."
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Structured Data - Product (for plans) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: plans.map((plan, index) => ({
              '@type': 'Product',
              position: index + 1,
              name: `RankFinal ${plan.name} Plan`,
              description: plan.included.join(', '),
              offers: {
                '@type': 'Offer',
                price: plan.monthly.replace('€', ''),
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
              },
            })),
          }),
        }}
      />

      <div className="space-y-16">
        {/* Header */}
        <section className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center rounded-full border border-accent-amber/40 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            Pricing
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Choose the plan that fits your needs
            </h1>
            <p className="text-lg font-medium text-muted-foreground">
              All prices in Euro. Cancel anytime. No hidden fees.
            </p>
          </div>
        </section>

        {/* Plans */}
        <PricingPlans />

        {/* FAQs */}
        <section className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-accent-amber/10 border-accent-amber/40">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Join thousands making smarter purchase decisions with RankFinal
            </p>
            <Link href="/signin">
              <Button size="lg" className="bg-accent-amber hover:bg-accent-amber/90">
                Start your 14-day free trial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
