# SSR Migration Guide: Vite + React → Next.js 14+

## Executive Summary

**Goal**: Migrate RankFinal from pure client-side rendering (CSR) to Server-Side Rendering (SSR) with Next.js 14+ App Router to unlock organic search traffic.

**Timeline**: 4-6 weeks  
**ROI**: €20-50K/year in equivalent paid advertising  
**Impact**: 40-100x increase in indexed pages, 300-500% organic traffic increase  

---

## Phase 1: Foundation Setup (Week 1)

### 1.1 Install Next.js

```bash
# Install Next.js 14+ and required dependencies
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/node

# Install Next.js specific utilities
npm install server-only
```

### 1.2 Create Next.js Directory Structure

```
rankfinal-foundations/
├── app/                    # Next.js App Router (new)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── api/               # API routes
│   │   ├── rankfinal-ai/
│   │   │   └── route.ts
│   │   └── stripe-webhook/
│   │       └── route.ts
│   └── globals.css
├── src/                    # Existing Vite app (keep during migration)
│   └── ... (existing code)
├── public/
├── components/            # Shared components (moved from src/components)
│   ├── ui/               # shadcn components
│   └── rankfinal/        # Custom components
└── lib/                  # Shared utilities
```

### 1.3 Configure Next.js

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
}

module.exports = nextConfig
```

### 1.4 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "dev:vite": "vite",
    "build:vite": "vite build",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

### 1.5 Migrate Tailwind Config

Update `tailwind.config.ts` to support both Vite and Next.js:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Next.js App Router
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Existing Vite app (during migration)
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
};

export default config;
```

---

## Phase 2: Core Infrastructure (Week 2)

### 2.1 Migrate API Routes

**Before (Vite + Express/Vercel Functions):**
```typescript
// api/rankfinal-ai.ts
export default async function handler(req, res) {
  const { query, country } = req.body;
  // ... logic
  res.json(result);
}
```

**After (Next.js API Route):**
```typescript
// app/api/rankfinal-ai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { query, country } = await request.json();
    
    // Input validation
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Invalid query' },
        { status: 400 }
      );
    }
    
    // Rate limiting check
    const ip = request.ip ?? 'unknown';
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // Process request
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, // Server-side only
    });
    
    const result = await getAIRecommendation(anthropic, query, country);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Rate limiting helper
async function checkRateLimit(ip: string): Promise<boolean> {
  // Implement with Redis or database
  return false;
}
```

### 2.2 Implement Middleware

Create `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CSRF protection
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin && !origin.includes(host || '')) {
      return new NextResponse('CSRF validation failed', { status: 403 });
    }
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 2.3 Set Up Server-Side Auth

```typescript
// lib/auth.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getServerSession() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
```

---

## Phase 3: Page Migration (Weeks 3-4)

### 3.1 Create Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/rankfinal/layout/Nav';
import { Footer } from '@/components/rankfinal/layout/Footer';
import { CookieConsent } from '@/components/rankfinal/CookieConsent';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'RankFinal - AI-Powered Product Recommendations',
    template: '%s | RankFinal',
  },
  description: 'Get unbiased, AI-powered recommendations for products and services. Compare options and make informed decisions.',
  keywords: ['product comparison', 'AI recommendations', 'unbiased reviews'],
  authors: [{ name: 'RankFinal' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rankfinal.com',
    siteName: 'RankFinal',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Nav />
            <main>{children}</main>
            <Footer />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

### 3.2 Migrate Home Page (SSR)

```typescript
// app/page.tsx
import type { Metadata } from 'next';
import { HeroSection } from '@/components/rankfinal/HeroSection';
import { FeaturesSection } from '@/components/rankfinal/FeaturesSection';
import { CTASection } from '@/components/rankfinal/CTASection';

export const metadata: Metadata = {
  title: 'RankFinal - AI-Powered Product Recommendations',
  description: 'Get unbiased, AI-powered recommendations for the best products and services. Compare options and make informed decisions.',
  alternates: {
    canonical: 'https://www.rankfinal.com',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
```

### 3.3 Migrate Search Page (SSR with Dynamic Metadata)

```typescript
// app/search/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SearchResults } from '@/components/rankfinal/SearchResults';
import { getRankFinalRecommendation } from '@/lib/rankfinal-ai-server';

type Props = {
  searchParams: { q?: string; country?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.q;
  const country = searchParams.country || 'Global';
  
  if (!query) {
    return {
      title: 'Search - RankFinal',
      description: 'Search for product and service recommendations',
    };
  }
  
  return {
    title: `Best ${query} in ${country} - RankFinal`,
    description: `AI-powered recommendation for the best ${query} in ${country}. Compare top options with unbiased analysis.`,
    alternates: {
      canonical: `https://www.rankfinal.com/search?q=${encodeURIComponent(query)}`,
    },
    openGraph: {
      title: `Best ${query} in ${country}`,
      description: `AI-powered recommendation for the best ${query} in ${country}.`,
      url: `https://www.rankfinal.com/search?q=${encodeURIComponent(query)}`,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q;
  const country = searchParams.country || 'Global';
  
  if (!query) {
    return <SearchForm />;
  }
  
  try {
    const result = await getRankFinalRecommendation(query, country);
    
    return (
      <div className="container py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: result.best.name,
              description: result.best.reason,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: result.best.score,
                bestRating: 100,
              },
            }),
          }}
        />
        <SearchResults result={result} />
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    notFound();
  }
}
```

### 3.4 Migrate Browse Pages (ISR)

```typescript
// app/browse/[category]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/rankfinal/CategoryPage';
import { getCategories, getCategoryBySlug } from '@/lib/categories';

export const revalidate = 3600; // ISR: Revalidate every hour

type Props = {
  params: { category: string };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  
  if (!category) {
    return {};
  }
  
  return {
    title: `${category.name} - Browse Categories`,
    description: category.description,
    alternates: {
      canonical: `https://www.rankfinal.com/browse/${category.slug}`,
    },
  };
}

export default async function BrowseCategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }
  
  return <CategoryPage category={category} />;
}
```

---

## Phase 4: Polish and Launch (Weeks 5-6)

### 4.1 Dynamic Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getCategories } from '@/lib/categories';
import { getTopSearches } from '@/lib/search-history';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rankfinal.com';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/pricing',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  // Category pages
  const categories = await getCategories();
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/browse/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));
  
  // Top search pages (server-rendered, indexable)
  const topSearches = await getTopSearches(50);
  const searchPages = topSearches.map((search) => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(search.query)}`,
    lastModified: new Date(search.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  return [...staticPages, ...categoryPages, ...searchPages];
}
```

### 4.2 Update CI/CD for Next.js

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Lint
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Security audit
        run: npm audit --omit=dev --audit-level=high
        continue-on-error: true
```

### 4.3 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Configure environment variables in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## Migration Checklist

### Week 1: Foundation
- [ ] Install Next.js 14+ and dependencies
- [ ] Create App Router directory structure
- [ ] Configure `next.config.js`
- [ ] Update `package.json` scripts
- [ ] Migrate Tailwind config
- [ ] Move shared components to root `/components` directory
- [ ] Create root layout
- [ ] Migrate About page (simple static page)

### Week 2: Infrastructure
- [ ] Create API route structure
- [ ] Migrate `/api/rankfinal-ai` to Next.js API route
- [ ] Migrate `/api/create-checkout` to Next.js API route
- [ ] Implement Stripe webhook handler
- [ ] Set up middleware (CSRF, security headers)
- [ ] Configure server-side auth with Supabase
- [ ] Test all API routes

### Week 3: Page Migration Part 1
- [ ] Migrate Home page with SSR
- [ ] Migrate Pricing page with SSR
- [ ] Migrate Help pages with SSR
- [ ] Migrate Contact page with SSR
- [ ] Add dynamic metadata to all pages
- [ ] Test SEO with Google Rich Results Test

### Week 4: Page Migration Part 2
- [ ] Migrate Browse pages with ISR
- [ ] Migrate Search page with SSR and dynamic metadata
- [ ] Add structured data (Product, FAQ, Breadcrumb)
- [ ] Implement canonical tags
- [ ] Test all pages render correctly

### Week 5: Optimization
- [ ] Optimize bundle size (code splitting)
- [ ] Implement image optimization (Next.js Image)
- [ ] Add prefetching for key routes
- [ ] Optimize fonts (next/font)
- [ ] Run Lighthouse audits
- [ ] Fix performance issues

### Week 6: Launch
- [ ] Generate dynamic sitemap
- [ ] Configure redirects from old URLs
- [ ] Update CI/CD pipeline
- [ ] Deploy to Vercel production
- [ ] Submit new sitemap to Google Search Console
- [ ] Monitor search indexing
- [ ] Set up analytics and error tracking

---

## Key Benefits After Migration

### SEO Improvements
- **Before**: 10 indexed pages (static only)
- **After**: 300-500 indexed pages (all search results + categories)
- **Impact**: 40-100x increase in indexed content

### Metadata
- **Before**: Duplicate metadata on all pages
- **After**: Unique title, description, OG tags per page
- **Impact**: Better click-through rates from search results

### Performance
- **Before**: 171 KB gzipped main bundle
- **After**: 85-95 KB gzipped, code-split by route
- **Impact**: Faster initial page load

### Security
- **Before**: API keys exposed in client bundle
- **After**: Server-side only, CSRF protection, rate limiting
- **Impact**: Production-grade security

### Organic Traffic
- **Baseline**: ~0 organic visits/month (CSR not indexed)
- **6 months**: 500-1,000 organic visits/month
- **12 months**: 2,000-5,000 organic visits/month
- **Value**: €20-50K/year equivalent in paid advertising

---

## Rollback Plan

If migration needs to be paused or rolled back:

1. Keep Vite build scripts in `package.json` during migration
2. Maintain both `/src` (Vite) and `/app` (Next.js) directories
3. Use git branches for incremental migration
4. Deploy Vite build to staging while Next.js is in development
5. Use feature flags to gradually route traffic to Next.js pages

---

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Google Search Central](https://developers.google.com/search)

---

## Questions or Issues?

Contact: kjmersland@gmail.com
