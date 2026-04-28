import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Terms of Service | RankFinal',
  description: 'Read the Terms of Service for RankFinal. By using our service, you agree to these terms governing your use of our AI-powered product ranking platform.',
  alternates: {
    canonical: 'https://www.rankfinal.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using RankFinal, you accept and agree to be bound by the terms and 
                provisions of this agreement.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use of Service</h2>
              <p className="text-muted-foreground">
                RankFinal provides AI-powered product and service rankings based on verified independent 
                test data. Free users are limited to 5 searches per day.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at{' '}
                <a href="mailto:legal@rankfinal.com" className="text-accent-amber hover:underline">
                  legal@rankfinal.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
