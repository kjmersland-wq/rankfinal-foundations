import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Cookie Policy | RankFinal',
  description: 'Learn about how RankFinal uses cookies to enhance your experience and improve our service.',
  alternates: {
    canonical: 'https://www.rankfinal.com/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device that help us provide and improve our service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies for authentication, preferences, analytics, and to enhance your user experience.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. Note that disabling cookies may affect site functionality.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
