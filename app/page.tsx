import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RankFinal - AI-Powered Product Recommendations',
  description: 'Get unbiased, AI-powered recommendations for the best products and services. Compare options and make informed decisions with our advanced AI.',
  alternates: {
    canonical: 'https://www.rankfinal.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Welcome to RankFinal (Next.js SSR)</h1>
        <p className="text-xl mb-8">
          AI-powered product recommendations with server-side rendering for better SEO.
        </p>
        <div className="bg-accent-amber/10 border border-accent-amber/40 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🚀 SSR Migration in Progress</h2>
          <p className="mb-4">
            This is the Next.js version of RankFinal. The Vite build still exists at <code>/src</code>.
          </p>
          <p>
            <strong>Status:</strong> Phase 1 - Foundation Setup Complete
          </p>
        </div>
      </main>
    </div>
  );
}
