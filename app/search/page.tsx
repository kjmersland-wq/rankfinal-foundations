import type { Metadata } from 'next';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamic metadata based on search query
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  const country = params.country || 'Global';

  if (query) {
    const title = `Best ${query} in ${country} 2026 | RankFinal`;
    const description = `Find the best ${query} in ${country}. AI-powered recommendations based on verified independent test data from trusted sources. Compare top options now.`;

    return {
      title,
      description,
      keywords: [query, 'best', country, 'review', 'comparison', 'recommendation'],
      openGraph: {
        title,
        description,
        url: `https://www.rankfinal.com/search?q=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`,
        type: 'website',
        images: [
          {
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: `Best ${query} in ${country}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
      },
      alternates: {
        canonical: `https://www.rankfinal.com/search?q=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`,
      },
    };
  }

  // Default metadata for empty search state
  return {
    title: 'Search for Product Rankings & Reviews | RankFinal',
    description: 'Search thousands of independent product and service rankings. Get AI-powered recommendations based on verified test data from trusted sources worldwide.',
    keywords: ['product search', 'service rankings', 'independent reviews', 'ai recommendations'],
    openGraph: {
      title: 'Search for Product Rankings & Reviews | RankFinal',
      description: 'Search thousands of independent product and service rankings.',
      url: 'https://www.rankfinal.com/search',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'RankFinal Search',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Search for Product Rankings & Reviews | RankFinal',
      description: 'Search thousands of independent product and service rankings.',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: 'https://www.rankfinal.com/search',
    },
  };
}

// Server-side rendering for dynamic queries
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string }>;
}) {
  const params = await searchParams;
  const query = params.q;
  const country = params.country || 'Norway';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data - SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
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
                name: 'Search',
                item: 'https://www.rankfinal.com/search',
              },
            ],
          }),
        }}
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {query ? `Results for "${query}"` : 'Search Rankings'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {query
              ? `AI-powered recommendations for the best ${query} in ${country}`
              : 'Get unbiased, AI-powered recommendations based on verified test data'}
          </p>
        </div>

        {/* Search Form - Client Component Will Be Loaded */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Enter a product or service to get AI-powered recommendations based on verified test data
              </p>
              <div className="flex items-center gap-2 p-4 rounded-lg border border-accent-amber/40 bg-accent-amber/5">
                <SearchIcon className="h-5 w-5 text-accent-amber flex-shrink-0" />
                <span className="text-sm">
                  Client-side search component will be loaded here with real-time AI search
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Searches */}
        {!query && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
              <CardDescription>Trending product and service searches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Best EV 2026',
                  'Best smartphone',
                  'Cheapest electricity Norway',
                  'Best bank Norway',
                  'Best travel insurance',
                  'Best laptop 2026',
                  'Home insurance UK',
                  'Best car insurance',
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}&country=Norway`}
                    className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:border-accent-amber/60 hover:bg-accent-amber/5 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Query Results Placeholder */}
        {query && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-accent-amber/10 border-accent-amber/40">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-amber/20 mb-2">
                    <SearchIcon className="h-6 w-6 text-accent-amber" />
                  </div>
                  <h2 className="text-xl font-bold">Searching for: {query}</h2>
                  <p className="text-muted-foreground">
                    Country: {country}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    This is the SSR-rendered search page. The actual search results will be loaded
                    via the client-side component that calls the AI API endpoint.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How RankFinal Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-amber/20 mb-2">
                      <span className="text-lg font-bold text-accent-amber">1</span>
                    </div>
                    <h3 className="font-semibold">Collect</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI collects independent test data from verified global sources
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-amber/20 mb-2">
                      <span className="text-lg font-bold text-accent-amber">2</span>
                    </div>
                    <h3 className="font-semibold">Analyze</h3>
                    <p className="text-sm text-muted-foreground">
                      Removes bias and weighs quality of testing, not quantity of reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-amber/20 mb-2">
                      <span className="text-lg font-bold text-accent-amber">3</span>
                    </div>
                    <h3 className="font-semibold">Recommend</h3>
                    <p className="text-sm text-muted-foreground">
                      Delivers one clear recommendation with full source transparency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
