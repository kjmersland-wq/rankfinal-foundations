import type { Metadata } from 'next';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Static Site Generation
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Contact Us | RankFinal',
  description: 'Get in touch with the RankFinal team. Have questions or partnership inquiries? Contact us at KM TECH LABS, Kristiansand, Norway.',
  keywords: ['contact', 'support', 'help', 'rankfinal contact', 'customer service'],
  openGraph: {
    title: 'Contact Us | RankFinal',
    description: 'Get in touch with the RankFinal team.',
    url: 'https://www.rankfinal.com/contact',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact RankFinal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | RankFinal',
    description: 'Get in touch with the RankFinal team.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.rankfinal.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Structured Data - ContactPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact RankFinal',
            description: 'Get in touch with the RankFinal team for questions, support, or partnership inquiries.',
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

      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or partnership inquiry? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/20">
                  <MessageSquare className="h-5 w-5 text-accent-amber" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Inquiries</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Questions about RankFinal or how it works?
              </p>
              <a
                href="mailto:hello@rankfinal.com"
                className="text-sm font-semibold text-accent-amber hover:underline"
              >
                hello@rankfinal.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/20">
                  <Mail className="h-5 w-5 text-accent-amber" />
                </div>
                <div>
                  <CardTitle className="text-lg">Support</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Need help with your account or subscription?
              </p>
              <a
                href="mailto:support@rankfinal.com"
                className="text-sm font-semibold text-accent-amber hover:underline"
              >
                support@rankfinal.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/20">
                  <MapPin className="h-5 w-5 text-accent-amber" />
                </div>
                <div>
                  <CardTitle className="text-lg">Location</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                RankFinal is operated by KM TECH LABS
              </p>
              <p className="text-sm font-semibold">
                Kristiansand, Norway
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>About KM TECH LABS</CardTitle>
            <CardDescription>The company behind RankFinal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              RankFinal is built and operated by KM TECH LABS, based in Kristiansand, Norway.
            </p>
            <p>
              We believe people deserve better than endless lists and paid reviews. So we built 
              the tool we always wanted ourselves — one that delivers clear, honest recommendations 
              based on verified independent test data.
            </p>
            <p>
              Our mission is to make purchase decisions easier and more trustworthy by removing 
              bias, sponsored content, and noise from the product research process.
            </p>
          </CardContent>
        </Card>

        {/* Partnership Section */}
        <Card className="max-w-3xl mx-auto bg-accent-amber/10 border-accent-amber/40">
          <CardHeader>
            <CardTitle>Partnership Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Interested in partnering with RankFinal? We work with:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent-amber mt-1">•</span>
                <span>Independent testing laboratories looking to share verified data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-amber mt-1">•</span>
                <span>Consumer organizations committed to transparency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-amber mt-1">•</span>
                <span>B2B clients seeking market intelligence and category insights</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Reach out to{' '}
              <a href="mailto:partnerships@rankfinal.com" className="font-semibold text-accent-amber hover:underline">
                partnerships@rankfinal.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Help Center Link */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Looking for answers to common questions?
          </p>
          <a
            href="/help"
            className="inline-flex items-center justify-center rounded-full bg-accent-amber hover:bg-accent-amber/90 text-primary-foreground font-semibold px-6 py-3 transition-colors"
          >
            Visit Help Center
          </a>
        </div>
      </div>
    </div>
  );
}
