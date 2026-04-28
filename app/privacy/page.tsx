import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Privacy Policy | RankFinal',
  description: 'Read our Privacy Policy to understand how RankFinal collects, uses, and protects your personal information when you use our service.',
  alternates: {
    canonical: 'https://www.rankfinal.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, 
                subscribe to a plan, or contact us for support.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground">
                If you are in the European Economic Area, you have the right to access, correct, delete, 
                and export your personal data.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Contact</h2>
              <p className="text-muted-foreground">
                For privacy-related questions, contact us at{' '}
                <a href="mailto:privacy@rankfinal.com" className="text-accent-amber hover:underline">
                  privacy@rankfinal.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
