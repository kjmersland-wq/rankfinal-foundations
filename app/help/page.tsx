import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Static Site Generation
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Help Center | RankFinal',
  description: 'Find answers about rankings, scores, sources, billing, alerts, and support. Browse help articles or contact our team for assistance.',
  keywords: ['help', 'support', 'faq', 'how to', 'documentation'],
  openGraph: {
    title: 'Help Center | RankFinal',
    description: 'Find answers about rankings, scores, sources, billing, alerts, and support.',
    url: 'https://www.rankfinal.com/help',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RankFinal Help Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center | RankFinal',
    description: 'Find answers about rankings, scores, sources, billing, alerts, and support.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com/help',
  },
};

const helpCategories = [
  { icon: "🔍", title: "Getting Started", count: 5 },
  { icon: "🧠", title: "How RankFinal Works", count: 6 },
  { icon: "📊", title: "Understanding Scores", count: 4 },
  { icon: "💳", title: "Plans & Billing", count: 6 },
  { icon: "🔔", title: "Alerts & Saved Results", count: 3 },
  { icon: "🔧", title: "Technical Issues", count: 4 },
  { icon: "🤝", title: "Business & API", count: 4 },
  { icon: "📬", title: "Contact Support", count: 1 },
];

const featuredArticles = [
  { title: "How does RankFinal score products and services?", slug: "how-scoring-works" },
  { title: "Why do we only give one recommendation?", slug: "why-one-recommendation" },
  { title: "How often are results updated?", slug: "update-frequency" },
  { title: "What sources do we use and how are they verified?", slug: "sources-and-verification" },
  { title: "How to use country filtering", slug: "country-filtering" },
  { title: "How to export or print a result", slug: "export-print" },
  { title: "Understanding the scoring breakdown table", slug: "scoring-breakdown" },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.rankfinal.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Help Center',
                item: 'https://www.rankfinal.com/help',
              },
            ],
          }),
        }}
      />

      <div className="space-y-14">
        {/* Header */}
        <section className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center rounded-full border border-accent-amber/40 bg-accent-amber/10 px-4 py-1.5 text-sm font-semibold text-accent-amber">
            Help center
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              How can we help?
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers about rankings, scores, sources, billing, alerts, and support.
            </p>
          </div>
          <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-3 rounded-lg border border-border bg-surface px-5 shadow-md transition-all focus-within:border-accent-amber focus-within:shadow-lg">
            <Search className="h-5 w-5 text-accent-amber" aria-hidden="true" />
            <input
              className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              placeholder="Search help articles..."
              type="search"
            />
          </div>
        </section>

        {/* Help Categories */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category) => (
            <Card key={category.title} className="group hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary text-2xl transition-transform group-hover:-translate-y-1" aria-hidden="true">
                  {category.icon}
                </div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.count} articles</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        {/* Featured Articles & Contact */}
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <div className="inline-flex w-fit items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                Featured articles
              </div>
              <CardTitle className="text-3xl">Start here</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/help/${article.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 text-sm font-bold transition-colors hover:text-accent-amber"
                >
                  <span>{article.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-accent-amber/50">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-amber/15 text-accent-amber">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle>Contact support</CardTitle>
              <CardDescription>Real help from the RankFinal team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                <span className="font-bold text-foreground">Response time:</span> &lt; 24 hours (Pro: &lt; 4 hours)
              </p>
              <Link href="/contact">
                <Button variant="default" className="w-full bg-accent-amber hover:bg-accent-amber/90">
                  Send us a message
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
