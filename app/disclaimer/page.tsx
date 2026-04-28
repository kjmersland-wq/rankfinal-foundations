import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Disclaimer | RankFinal',
  description: 'Read our disclaimer to understand the limitations and conditions of using RankFinal product rankings and recommendations.',
  alternates: {
    canonical: 'https://www.rankfinal.com/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Disclaimer
          </h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. No Warranty</h2>
              <p className="text-muted-foreground">
                RankFinal rankings and recommendations are provided "as is" without warranty of any kind. 
                We strive for accuracy but do not guarantee completeness or suitability for your specific needs.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Independence</h2>
              <p className="text-muted-foreground">
                RankFinal is an independent service. We do not receive payment from brands we review or recommend. 
                Our rankings are based on verified independent sources.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                We are not liable for any decisions made based on our rankings. Always verify information and 
                consider your specific circumstances before making purchase decisions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
