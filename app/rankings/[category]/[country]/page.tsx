import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ISR with 1 hour revalidation
export const revalidate = 3600;

// For dynamic routes, we can use fallback: 'blocking' for on-demand generation
export const dynamicParams = true;

// Import data (will be replaced with Supabase queries in production)
import { categories, countries } from '@/data/categories';
import { mockSearchResults } from '@/data/searchResults';

interface RankingPageProps {
  params: Promise<{
    category: string;
    country: string;
  }>;
}

// Pre-generate the top 100 most important category/country combinations
export async function generateStaticParams() {
  // Generate params for all categories with top countries
  const topCountries = ['norway', 'uk', 'germany', 'france', 'sweden', 'usa'];
  
  const params: Array<{ category: string; country: string }> = [];
  
  categories.forEach((cat) => {
    topCountries.forEach((country) => {
      params.push({
        category: cat.id,
        country: country.toLowerCase(),
      });
    });
  });
  
  // Return top 100 (or all if less)
  return params.slice(0, 100);
}

// Dynamic metadata generation
export async function generateMetadata({ params }: RankingPageProps): Promise<Metadata> {
  const { category, country } = await params;
  
  // Find category and country
  const categoryData = categories.find(c => c.id === category);
  const countryName = countries.find(c => c.toLowerCase() === country.toLowerCase()) || country;
  
  if (!categoryData) {
    return {
      title: 'Ranking Not Found | RankFinal',
    };
  }
  
  const currentYear = new Date().getFullYear();
  const title = `Best ${categoryData.name} in ${countryName} ${currentYear} | RankFinal`;
  const description = `Independent rankings for ${categoryData.name.toLowerCase()} in ${countryName}. AI-powered recommendations based on ${categoryData.sourceCount}+ verified tests and expert reviews. Updated ${categoryData.frequency}.`;
  
  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    keywords: [
      `best ${categoryData.name}`,
      `${categoryData.name} ${countryName}`,
      `${categoryData.name} rankings`,
      `${categoryData.name} reviews`,
      countryName,
    ],
    openGraph: {
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      url: `https://www.rankfinal.com/rankings/${category}/${country}`,
      type: 'article',
      images: [
        {
          url: `/api/og?category=${encodeURIComponent(categoryData.name)}&country=${encodeURIComponent(countryName)}`,
          width: 1200,
          height: 630,
          alt: `${categoryData.name} Rankings in ${countryName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      images: [`/api/og?category=${encodeURIComponent(categoryData.name)}&country=${encodeURIComponent(countryName)}`],
    },
    alternates: {
      canonical: `https://www.rankfinal.com/rankings/${category}/${country}`,
    },
  };
}

export default async function RankingPage({ params }: RankingPageProps) {
  const { category, country } = await params;
  
  // Find category and country
  const categoryData = categories.find(c => c.id === category);
  const countryName = countries.find(c => c.toLowerCase() === country.toLowerCase()) || country;
  
  if (!categoryData) {
    notFound();
  }
  
  // In production, this would fetch from Supabase
  // For now, use mock data based on category
  const mockRanking = mockSearchResults.find(r => 
    r.category.toLowerCase().includes(categoryData.name.toLowerCase().split(' ')[0])
  ) || mockSearchResults[0];
  
  const currentYear = new Date().getFullYear();
  
  // Generate ranking items from subcategories (mock data)
  const rankingItems = categoryData.subcategories.slice(0, 10).map((subcategory, index) => ({
    position: index + 1,
    name: subcategory,
    score: 9.5 - (index * 0.3),
    sources: Math.max(15, Math.round(categoryData.sourceCount / (index + 5))),
  }));
  
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
                name: 'Browse',
                item: 'https://www.rankfinal.com/browse',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: categoryData.name,
                item: `https://www.rankfinal.com/rankings/${category}/${country}`,
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
            itemListElement: rankingItems.map((item) => ({
              '@type': 'ListItem',
              position: item.position,
              name: item.name,
              url: `https://www.rankfinal.com/rankings/${category}/${country}#${item.name.toLowerCase().replace(/\s+/g, '-')}`,
            })),
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
                name: `What is the best ${categoryData.name.toLowerCase()} in ${countryName}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Based on ${categoryData.sourceCount}+ verified tests, the top ${categoryData.name.toLowerCase()} in ${countryName} is ranked according to independent expert reviews and user satisfaction data.`,
                },
              },
              {
                '@type': 'Question',
                name: `How often are ${categoryData.name.toLowerCase()} rankings updated?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `${categoryData.name} rankings are updated ${categoryData.frequency} based on new test data and market changes.`,
                },
              },
            ],
          }),
        }}
      />
      
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-foreground transition-colors">Browse</Link>
          <span>/</span>
          <Link href={`/browse?category=${category}`} className="hover:text-foreground transition-colors">
            {categoryData.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{countryName}</span>
        </nav>
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{categoryData.icon}</span>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Best {categoryData.name} in {countryName} {currentYear}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {categoryData.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="gap-2">
              <TrendingUp className="h-3 w-3" />
              Updated {categoryData.frequency}
            </Badge>
            <Badge variant="secondary">
              {categoryData.sourceCount}+ verified sources
            </Badge>
            <Badge variant="secondary">
              {rankingItems.length} ranked items
            </Badge>
          </div>
        </div>
        
        {/* Top Recommendation */}
        {mockRanking.bestChoice && (
          <Card className="border-accent-amber/40 bg-accent-amber/5">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent-amber" />
                    <CardTitle className="text-2xl">Top Recommendation</CardTitle>
                  </div>
                  <h2 className="text-3xl font-extrabold text-accent-amber">
                    {mockRanking.bestChoice.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-muted-foreground">Overall Score</div>
                  <div className="text-4xl font-extrabold text-accent-amber">
                    {mockRanking.bestChoice.score}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                {mockRanking.bestChoice.recommendation}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {mockRanking.bestChoice.strengths.map((strength, i) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-orange-500" />
                    Considerations
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {mockRanking.bestChoice.weaknesses.map((weakness, i) => (
                      <li key={i}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Typical Price Range</div>
                  <div className="text-lg font-bold">{mockRanking.bestChoice.price}</div>
                </div>
                <Button className="bg-accent-amber hover:bg-accent-amber/90">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Complete Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Complete Rankings</CardTitle>
            <p className="text-muted-foreground">
              All {categoryData.name.toLowerCase()} options ranked by independent testing and expert reviews
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankingItems.map((item) => (
                <div
                  key={item.position}
                  id={item.name.toLowerCase().replace(/\s+/g, '-')}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-accent-amber/40 hover:bg-accent-amber/5 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent-amber/20 text-accent-amber font-bold text-lg">
                    #{item.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on {item.sources} verified sources
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-accent-amber">
                      {item.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Score Breakdown */}
        {mockRanking.scores && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Score Breakdown</CardTitle>
              <p className="text-muted-foreground">
                How we calculate the overall score
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRanking.scores.map((criterion) => (
                  <div key={criterion.criteria}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{criterion.criteria}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Weight: {criterion.weight}</span>
                        <span className="font-bold text-accent-amber">{criterion.score.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-amber rounded-full transition-all"
                        style={{ width: `${(criterion.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Verified Sources */}
        {mockRanking.sources && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Verified Sources</CardTitle>
              <p className="text-muted-foreground">
                Independent test data and expert reviews used for this ranking
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRanking.sources.map((source, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg border border-border">
                    <div className="text-3xl flex-shrink-0">{source.flag}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold">{source.name}</h4>
                        <Badge variant="secondary">{source.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* CTA */}
        <Card className="bg-accent-amber/10 border-accent-amber/40">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Want More Detailed Analysis?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upgrade to Pro for full score breakdowns, source transparency, PDF exports, and personalized alerts when rankings change.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-accent-amber hover:bg-accent-amber/90">
                  See Pricing Plans
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Browse
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
