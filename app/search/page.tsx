import type { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

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

// Server-side rendering for SEO, client component handles interactivity
export default async function SearchPage() {
  return (
    <>
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

      <SearchPageClient />
    </>
  );
}
