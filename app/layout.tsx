import type { Metadata } from 'next';
import './globals.css';
import { Nav } from './_components/Nav';
import { Footer } from './_components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'RankFinal - AI-Powered Product Recommendations',
    template: '%s | RankFinal',
  },
  description: 'Get unbiased, AI-powered recommendations for products and services. Compare options and make informed decisions.',
  keywords: ['product comparison', 'AI recommendations', 'unbiased reviews', 'best products', 'service comparison'],
  authors: [{ name: 'RankFinal' }],
  metadataBase: new URL('https://www.rankfinal.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rankfinal.com',
    siteName: 'RankFinal',
    title: 'RankFinal - AI-Powered Product Recommendations',
    description: 'Get unbiased, AI-powered recommendations for products and services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RankFinal - AI-Powered Product Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RankFinal - AI-Powered Product Recommendations',
    description: 'Get unbiased, AI-powered recommendations for products and services.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
