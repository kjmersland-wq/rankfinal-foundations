import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Static Site Generation - pre-render all help articles
export const dynamic = 'force-static';
export const revalidate = false;

// Import help articles data
import { helpArticles, type HelpArticle } from '@/data/helpArticles';

interface HelpArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-generate all help article pages
export async function generateStaticParams() {
  return helpArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Dynamic metadata generation per article
export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = helpArticles.find((a) => a.slug === slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | RankFinal Help',
    };
  }
  
  const title = `${article.title} | RankFinal Help`;
  const description = article.sections[0]?.paragraphs[0]?.slice(0, 160) || 
    `Learn about ${article.title.toLowerCase()} in our comprehensive help guide.`;
  
  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    keywords: ['help', article.category, ...article.title.toLowerCase().split(' ')],
    authors: [{ name: 'RankFinal Team' }],
    openGraph: {
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      url: `https://www.rankfinal.com/help/${slug}`,
      type: 'article',
      publishedTime: new Date(article.lastUpdated).toISOString(),
      modifiedTime: new Date(article.lastUpdated).toISOString(),
      authors: ['RankFinal Team'],
      section: article.category,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://www.rankfinal.com/help/${slug}`,
    },
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { slug } = await params;
  const article = helpArticles.find((a) => a.slug === slug);
  
  if (!article) {
    notFound();
  }
  
  // Check if this article has FAQ-like sections
  const hasFAQStructure = article.sections.length > 2;
  
  return (
    <>
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
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://www.rankfinal.com/help/${slug}`,
              },
            ],
          }),
        }}
      />
      
      {/* Structured Data - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.sections[0]?.paragraphs[0],
            articleSection: article.category,
            author: {
              '@type': 'Organization',
              name: 'RankFinal',
              url: 'https://www.rankfinal.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RankFinal',
              url: 'https://www.rankfinal.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.rankfinal.com/logo.png',
              },
            },
            datePublished: new Date(article.lastUpdated).toISOString(),
            dateModified: new Date(article.lastUpdated).toISOString(),
          }),
        }}
      />
      
      {/* Structured Data - FAQPage (if applicable) */}
      {hasFAQStructure && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: article.sections.map((section) => ({
                '@type': 'Question',
                name: section.heading,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: section.paragraphs.join(' '),
                },
              })),
            }),
          }}
        />
      )}
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Back to Help Link */}
        <Link
          href="/help"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-amber"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Help Center
        </Link>
        
        {/* Article Header */}
        <div className="mb-8 space-y-4">
          <div className="inline-flex items-center rounded-full border border-accent-amber/40 bg-accent-amber/10 px-3 py-1 text-xs font-semibold text-accent-amber">
            {article.category}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {article.lastUpdated}</span>
          </div>
        </div>
        
        {/* Article Content */}
        <article className="prose prose-invert max-w-none space-y-8">
          {article.sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
        
        {/* Related Articles */}
        {article.related && article.related.length > 0 && (
          <div className="mt-12 space-y-6 border-t border-border pt-8">
            <h2 className="text-2xl font-bold">Related articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.related.map((related) => (
                <Link
                  key={related.slug}
                  href={`/help/${related.slug}`}
                  className="group"
                >
                  <Card className="h-full p-5 transition-all hover:-translate-y-1 hover:border-accent-amber">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium group-hover:text-accent-amber">
                        {related.title}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent-amber" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact Support CTA */}
        <div className="mt-12 space-y-4 rounded-lg border border-accent-amber/50 bg-accent-amber/5 p-6 text-center">
          <h3 className="text-xl font-bold">Still need help?</h3>
          <p className="text-muted-foreground">
            Our support team is here to help. We typically respond within 24 hours.
          </p>
          <Link href="/contact">
            <Button variant="default" className="bg-accent-amber hover:bg-accent-amber/90">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
