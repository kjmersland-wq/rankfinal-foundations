import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, countries, getFrequencyLabel } from '@/data/categories';

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Browse Rankings by Category & Country | RankFinal',
  description: 'Explore independent product and service rankings across 300+ categories in 20+ countries. Updated daily with verified test data from trusted sources worldwide.',
  keywords: ['product rankings', 'service comparisons', 'independent reviews', 'category rankings', 'country comparisons'],
  openGraph: {
    title: 'Browse Rankings by Category & Country | RankFinal',
    description: 'Explore independent product and service rankings across 300+ categories in 20+ countries.',
    url: 'https://www.rankfinal.com/browse',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Browse RankFinal Rankings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Rankings by Category & Country | RankFinal',
    description: 'Explore independent product and service rankings across 300+ categories in 20+ countries.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com/browse',
  },
};

// Server-side data fetching (runs at build time and every revalidation)
async function getBrowseData() {
  // In a real app, this would fetch from an API or database
  // For now, return the static categories data
  return {
    categories,
    countries,
    totalSubcategories: categories.reduce((sum, cat) => sum + cat.subcategories.length, 0),
    totalSources: categories.reduce((sum, cat) => sum + cat.sourceCount, 0),
  };
}

export default async function BrowsePage() {
  const data = await getBrowseData();

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
                name: 'Browse Rankings',
                item: 'https://www.rankfinal.com/browse',
              },
            ],
          }),
        }}
      />

      {/* Structured Data - ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'RankFinal Category Rankings',
            description: 'Independent rankings across multiple categories and countries',
            numberOfItems: data.categories.length,
            itemListElement: data.categories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.name,
              description: category.description,
            })),
          }),
        }}
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Browse Rankings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore {data.totalSubcategories}+ independent rankings across {data.categories.length} categories 
            and {data.countries.length} countries. Backed by {data.totalSources.toLocaleString()}+ verified sources.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent-amber">{data.categories.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent-amber">{data.totalSubcategories}+</div>
              <div className="text-sm text-muted-foreground mt-1">Subcategories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent-amber">{data.countries.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Countries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent-amber">{data.totalSources.toLocaleString()}+</div>
              <div className="text-sm text-muted-foreground mt-1">Sources</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((category) => (
            <Card key={category.id} className="hover:border-accent-amber/60 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">{category.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {getFrequencyLabel(category.frequency)} Updates
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{category.subcategories.length} subcategories</span>
                  <span>{category.sourceCount.toLocaleString()} sources</span>
                </div>

                {/* Subcategories Preview */}
                <div className="space-y-1 border-t border-border pt-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Top subcategories:</div>
                  {category.subcategories.slice(0, 4).map((subcategory) => (
                    <div key={subcategory} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      • {subcategory}
                    </div>
                  ))}
                  {category.subcategories.length > 4 && (
                    <div className="text-xs text-muted-foreground italic pt-1">
                      +{category.subcategories.length - 4} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Country List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-accent-amber" />
              Available Countries
            </CardTitle>
            <CardDescription>
              Rankings available across {data.countries.length} countries worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {data.countries.map((country) => (
                <div
                  key={country}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:border-accent-amber/60 transition-colors"
                >
                  {country}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-accent-amber/10 border-accent-amber/40">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to find the best option for you?</h2>
            <p className="text-muted-foreground mb-4">
              Get AI-powered recommendations based on verified test data
            </p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-accent-amber hover:bg-accent-amber/90 text-primary-foreground font-semibold px-6 py-3 transition-colors"
            >
              Start Searching
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
