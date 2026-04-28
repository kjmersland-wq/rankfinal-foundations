import type { Metadata } from 'next';
import { ArrowRight, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'About RankFinal - Honest AI-Powered Recommendations',
  description: 'RankFinal delivers unbiased product recommendations based on independent test data. No paid reviews, no affiliate bias - just honest answers backed by verified sources.',
  keywords: ['about rankfinal', 'ai recommendations', 'unbiased reviews', 'independent testing', 'product research'],
  openGraph: {
    title: 'About RankFinal - Honest AI-Powered Recommendations',
    description: 'RankFinal delivers unbiased product recommendations based on independent test data. No paid reviews, no affiliate bias.',
    url: 'https://www.rankfinal.com/about',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About RankFinal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About RankFinal - Honest AI-Powered Recommendations',
    description: 'RankFinal delivers unbiased product recommendations based on independent test data.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com/about',
  },
};

// This is a static page - use Static Site Generation (SSG)
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate (pure static)

const steps = [
  ["1", "Collect", "Our AI collects independent test data from verified global sources across 50+ countries."],
  ["2", "Clean", "It removes bias, sponsored content, and fake reviews while weighting quality of testing — not quantity of reviews."],
  ["3", "Recommend", "RankFinal delivers one recommendation with full source transparency. You see exactly why we picked it."],
];

const principles = [
  ["🎯", "Independence", "We never accept payment to recommend products."],
  ["🔍", "Transparency", "Every recommendation shows its sources."],
  ["✋", "Honesty", "We show weaknesses, not just strengths."],
  ["⚡", "Accuracy", "Results updated continuously from live sources."],
];

const methodology = [
  "Must be fully independent (no manufacturer funding)",
  "Must have documented, repeatable test methodology",
  "Must be publicly accessible and verifiable",
  "Credibility weighted by: recency, test depth, independence score, geographic coverage",
];

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const colors = {
    amber: 'bg-accent-amber/20 text-accent-amber border-accent-amber/40',
    red: 'bg-red-500/20 text-red-400 border-red-500/40',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    green: 'bg-green-500/20 text-green-400 border-green-500/40',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
  };
  return (
    <span className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs font-semibold ${colors[variant as keyof typeof colors]}`}>
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-16 py-10 lg:py-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-lg sm:px-10 lg:py-24">
          <div className="absolute inset-x-10 top-0 h-48 rounded-full bg-accent-amber/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl space-y-5">
            <Badge variant="amber">About RankFinal</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              We built the tool we always wanted.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
              RankFinal exists because honest, clear purchase decisions are hard to find.
            </p>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="mx-auto max-w-4xl space-y-5 text-center">
          <Badge variant="red">The problem</Badge>
          <p className="text-2xl font-bold leading-10">
            The internet is full of paid reviews, SEO articles, and influencer recommendations. You can't trust them. 
            Google is full of noise. Review sites are compromised by affiliate deals. Nobody gives you a straight answer. 
            We built RankFinal to fix that.
          </p>
        </section>

        {/* How It Works */}
        <section className="space-y-6" aria-labelledby="about-how-it-works">
          <div className="text-center">
            <Badge variant="purple">How it works</Badge>
            <h2 id="about-how-it-works" className="mt-4 text-3xl font-extrabold sm:text-4xl">
              A cleaner path from research to decision
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([number, title, text]) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber text-lg font-extrabold text-primary-foreground">
                    {number}
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="space-y-6" aria-labelledby="principles">
          <div className="text-center">
            <Badge variant="amber">Our principles</Badge>
            <h2 id="principles" className="mt-4 text-3xl font-extrabold sm:text-4xl">
              What RankFinal will not compromise
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([icon, title, text]) => (
              <Card key={title}>
                <CardHeader>
                  <div className="text-3xl" aria-hidden="true">{icon}</div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <Badge variant="green">Source methodology</Badge>
            <h2 className="text-3xl font-extrabold">
              How we select and verify sources
            </h2>
          </div>
          <Card>
            <CardContent className="space-y-4 p-6">
              {methodology.map((item) => (
                <div key={item} className="rounded-lg border border-border bg-background p-4 text-sm font-semibold leading-6">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Company & Contact */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Badge variant="gray">The company</Badge>
              <CardTitle>Built by KM TECH LABS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
              <p>RankFinal is built and operated by KM TECH LABS, based in Kristiansand, Norway.</p>
              <p>We believe people deserve better than endless lists and paid reviews. So we built the tool we always wanted ourselves.</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-bold">
                <MapPin className="h-4 w-4 text-accent-amber" />
                KM TECH LABS — Kristiansand, Norway
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="amber">Contact</Badge>
              <CardTitle>Reach the RankFinal team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-accent-amber" />
                <span>Have a question or partnership inquiry?</span>
              </p>
              <Button asChild variant="default" className="bg-accent-amber hover:bg-accent-amber/90">
                <Link href="/contact">
                  Contact us 
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              name: 'About RankFinal',
              description: 'RankFinal delivers unbiased product recommendations based on independent test data from verified sources worldwide.',
              publisher: {
                '@type': 'Organization',
                name: 'KM TECH LABS',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Kristiansand',
                  addressCountry: 'NO',
                },
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
