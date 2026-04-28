import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Shield, Zap, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Static Site Generation
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'RankFinal - AI-Powered Independent Product Rankings',
  description: 'Get unbiased AI recommendations for the best products and services. 10,000+ verified tests from 50+ countries. No sponsored content, just honest answers backed by independent sources.',
  keywords: ['product rankings', 'ai recommendations', 'independent reviews', 'product comparison', 'unbiased reviews'],
  openGraph: {
    title: 'RankFinal - AI-Powered Independent Product Rankings',
    description: 'Get unbiased AI recommendations for the best products and services.',
    url: 'https://www.rankfinal.com',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RankFinal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RankFinal - AI-Powered Independent Product Rankings',
    description: 'Get unbiased AI recommendations for the best products and services.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com',
  },
};

const TRUST_STATS = [
  { icon: <Globe className="h-5 w-5" />, label: "50+ countries" },
  { icon: <Shield className="h-5 w-5" />, label: "10,000+ verified tests" },
  { icon: <Zap className="h-5 w-5" />, label: "No sponsored content" },
  { icon: <RefreshCw className="h-5 w-5" />, label: "Updated daily" },
  { icon: <Search className="h-5 w-5" />, label: "100% independent" },
];

const HOW_IT_WORKS = [
  {
    step: "1. Ask",
    desc: "Type what you need in plain language",
    icon: "🔍",
  },
  {
    step: "2. Analyze",
    desc: "AI scans verified tests from 50+ countries, removes bias and sponsored content",
    icon: "🧠",
  },
  {
    step: "3. Decide",
    desc: "One clear recommendation, full source transparency",
    icon: "✅",
  },
];

const POPULAR_SEARCHES = [
  "Best EV 2026",
  "Cheapest electricity UK",
  "Top smartphone",
  "Best travel insurance",
  "Home loan Norway",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'RankFinal',
            url: 'https://www.rankfinal.com',
            logo: 'https://www.rankfinal.com/logo.png',
            description: 'AI-powered independent product and service rankings',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Kristiansand',
              addressCountry: 'NO',
            },
          }),
        }}
      />

      {/* Structured Data - WebSite with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'RankFinal',
            url: 'https://www.rankfinal.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.rankfinal.com/search?q={search_term_string}&country={country}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Structured Data - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How does RankFinal work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'RankFinal uses AI to collect independent test data from verified global sources, removes bias and sponsored content, and delivers one clear recommendation with full source transparency.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is RankFinal truly independent?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. RankFinal rankings are based on verified independent sources and scoring criteria, not sponsorship placements. We never accept payment to recommend products.',
                },
              },
              {
                '@type': 'Question',
                name: 'How often are rankings updated?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Financial, insurance, and energy categories update daily; electronics and vehicles update weekly; outdoor and sports update monthly.',
                },
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 px-4 py-16 text-center">
        <div className="inline-flex items-center rounded-full border border-accent-amber/40 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
          RankFinal.com
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Find the best <span className="text-accent-amber">product for you.</span>
        </h1>

        <p className="max-w-xl text-lg font-medium text-muted-foreground">
          One answer. Verified sources. No noise.
        </p>

        <div className="w-full max-w-2xl">
          <Link href="/search">
            <div className="flex items-center gap-3 rounded-full border-2 border-accent-amber/40 bg-accent-amber/5 px-6 py-4 transition-all hover:border-accent-amber/60 hover:bg-accent-amber/10">
              <Search className="h-6 w-6 text-accent-amber flex-shrink-0" />
              <span className="text-left text-muted-foreground">
                What are you looking for?
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}&country=Norway`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-accent-amber hover:text-accent-amber"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border bg-surface py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6 px-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="text-accent-amber">{stat.icon}</span>
              {stat.label}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-sm font-semibold text-purple-400">
              How it works
            </div>
            <h2 className="text-3xl font-extrabold">
              From question to ranked answer
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl">{item.icon}</div>
                  <h3 className="text-lg font-extrabold">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold">
            Ready to find the right product?
          </h2>
          <p className="text-muted-foreground">
            Join thousands making smarter purchase decisions with RankFinal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse">
              <Button variant="default" size="lg" className="bg-accent-amber hover:bg-accent-amber/90">
                Browse all categories →
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
