# Monitoring & Analytics Setup Guide - Phase 4 Step 5

**Date**: April 28, 2026  
**Status**: ✅ Documentation Complete

---

## Overview

This guide covers setting up comprehensive monitoring and analytics for RankFinal after deployment.

---

## 1. Google Search Console

### Purpose
- Monitor search performance
- Track indexing status
- Identify crawl errors
- Submit sitemaps

### Setup Steps

1. **Add Property**
   - Visit: https://search.google.com/search-console
   - Click "Add property"
   - Enter: `https://www.rankfinal.com`
   - Choose verification method: HTML file upload (recommended)

2. **Verify Ownership**
   ```bash
   # Download verification file from Google
   # Upload to /public/ directory
   # Example: google1234567890abcdef.html
   ```
   - Redeploy site
   - Click "Verify" in Google Search Console

3. **Submit Sitemap**
   - Go to Sitemaps section
   - Enter: `https://www.rankfinal.com/sitemap.xml`
   - Click "Submit"
   - Expected: 92+ URLs discovered

4. **Request Indexing**
   Priority pages to request indexing for:
   - `/` (home)
   - `/browse`
   - `/search`
   - `/pricing`
   - Top 10 ranking pages (electronics, insurance, etc.)

### Key Metrics to Monitor

| Metric | Target | Alert If |
|--------|--------|----------|
| Pages indexed | 90+ of 92 | < 70 |
| Average position | < 20 | > 30 |
| Click-through rate | > 2% | < 1% |
| Crawl errors | 0 | > 5 |

### Timeline Expectations

- Sitemap processed: 1-3 days
- First pages indexed: 3-7 days
- All pages indexed: 2-4 weeks
- First traffic: 1-2 weeks
- Ranking positions: 4-12 weeks

---

## 2. Google Analytics 4 (GA4)

### Purpose
- Track visitor behavior
- Monitor Core Web Vitals
- Measure conversion goals
- Analyze traffic sources

### Setup Steps

1. **Create Property**
   - Visit: https://analytics.google.com
   - Click "Create Property"
   - Name: "RankFinal"
   - Time zone: Europe/Oslo (or your location)
   - Currency: EUR

2. **Get Measurement ID**
   - Copy your `G-XXXXXXXXXX` ID

3. **Install Tracking Code**
   
   Create `/app/components/analytics.tsx`:
   ```typescript
   'use client';
   
   import Script from 'next/script';
   
   export function Analytics() {
     const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
     
     if (!GA_ID) return null;
     
     return (
       <>
         <Script
           strategy="afterInteractive"
           src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
         />
         <Script id="google-analytics" strategy="afterInteractive">
           {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${GA_ID}', {
               page_path: window.location.pathname,
               send_page_view: true
             });
           `}
         </Script>
       </>
     );
   }
   ```

4. **Add to Root Layout**
   
   Update `/app/layout.tsx`:
   ```typescript
   import { Analytics } from '@/components/analytics';
   
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

5. **Set Environment Variable**
   ```bash
   # In Vercel/Netlify dashboard
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Recommended Events to Track

**Automatic Events**:
- Page views
- Scroll depth
- Outbound clicks
- File downloads

**Custom Events** (add later):
```typescript
// Search performed
gtag('event', 'search', {
  search_term: query,
  country: selectedCountry
});

// Recommendation clicked
gtag('event', 'select_content', {
  content_type: 'ranking',
  item_id: categoryId
});

// Contact form submitted
gtag('event', 'generate_lead', {
  value: 1
});
```

### Core Web Vitals Setup

1. Enable in GA4:
   - Admin → Data Streams → Your stream
   - Enhanced measurement → Configure
   - Enable "Page views" with web vitals

2. View Reports:
   - Reports → Engagement → Pages and screens
   - Add dimensions: LCP, FID, CLS

**Targets**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 3. Vercel Analytics (Recommended if using Vercel)

### Purpose
- Real-time performance monitoring
- Web Vitals tracking (no code needed)
- Geographic traffic breakdown
- Automatic error tracking

### Setup Steps

1. **Enable in Dashboard**
   - Go to Project Settings
   - Click "Analytics" tab
   - Click "Enable Analytics"
   - Done! (no code changes needed)

2. **Enable Speed Insights**
   - Same page as Analytics
   - Click "Enable Speed Insights"
   - Real User Monitoring (RUM) enabled automatically

### What You Get

**Analytics**:
- Page views per route
- Unique visitors
- Top pages
- Top referrers
- Countries
- Devices

**Speed Insights**:
- Real Web Vitals scores
- Performance by route
- Performance by region
- Performance by device

**No Configuration Required** - Works automatically with Next.js

---

## 4. Alternative: Plausible Analytics (Privacy-Friendly)

### Why Plausible?
- GDPR compliant (no cookies, no consent needed)
- Lightweight (< 1 KB script)
- Simple, beautiful dashboard
- €9/month (10k pageviews)

### Setup Steps

1. **Sign Up**
   - Visit: https://plausible.io
   - Create account
   - Add domain: `rankfinal.com`

2. **Install Script**
   
   Update `/app/layout.tsx`:
   ```typescript
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           <script
             defer
             data-domain="rankfinal.com"
             src="https://plausible.io/js/script.js"
           />
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

3. **View Dashboard**
   - Visit: https://plausible.io/rankfinal.com
   - Real-time visitor count
   - Top pages, sources, countries
   - No cookies, no tracking

**Recommended for**: Privacy-focused sites, EU compliance

---

## 5. Uptime Monitoring

### Purpose
- Detect downtime immediately
- Monitor API endpoint health
- Alert team when issues occur

### Option 1: UptimeRobot (Free)

1. **Sign Up**
   - Visit: https://uptimerobot.com
   - Create free account (50 monitors)

2. **Add Monitors**
   ```
   Monitor 1: Homepage
   - Type: HTTP(S)
   - URL: https://www.rankfinal.com
   - Interval: 5 minutes
   
   Monitor 2: API Health
   - Type: HTTP(S)
   - URL: https://www.rankfinal.com/api/health (create this)
   - Interval: 5 minutes
   
   Monitor 3: Search Page
   - Type: HTTP(S)
   - URL: https://www.rankfinal.com/search
   - Interval: 5 minutes
   ```

3. **Set Up Alerts**
   - Email alerts (free)
   - SMS alerts (paid)
   - Slack/Discord webhooks
   - Alert when down for > 2 checks (10 minutes)

### Option 2: Vercel Uptime Monitoring (Built-in)

If using Vercel:
- Automatic monitoring
- Alerts via email
- Dashboard shows uptime %
- No setup required

---

## 6. Error Tracking (Optional but Recommended)

### Sentry Setup

1. **Sign Up**
   - Visit: https://sentry.io
   - Create account (free tier: 5K errors/month)

2. **Install**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure**
   
   Wizard creates these files:
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`

4. **Add Environment Variable**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

5. **Test Error Tracking**
   ```typescript
   // Add to any page for testing
   import * as Sentry from '@sentry/nextjs';
   
   try {
     throw new Error('Test Sentry');
   } catch (error) {
     Sentry.captureException(error);
   }
   ```

### What You Get

- Automatic error capture
- Source map upload
- User context (IP, browser, OS)
- Error grouping and deduplication
- Performance monitoring
- Release tracking

---

## 7. Performance Monitoring Dashboard

### Create a Simple Health Check Endpoint

Create `/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Check critical services
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
    },
  };
  
  const allHealthy = Object.values(checks.checks).every(c => c === 'ok');
  
  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}

async function checkDatabase() {
  try {
    // Ping Supabase
    // const { error } = await supabase.from('profiles').select('count').limit(1);
    // return error ? 'error' : 'ok';
    return 'ok'; // Placeholder
  } catch {
    return 'error';
  }
}

async function checkCache() {
  // Check if ISR is working
  return 'ok';
}
```

### Monitor This Endpoint

- UptimeRobot: Every 5 minutes
- Vercel: Automatic
- Your own cron: `curl https://rankfinal.com/api/health`

---

## 8. SEO Monitoring

### Tools to Use

1. **Google Search Console** (primary)
   - Covered in section 1

2. **Bing Webmaster Tools**
   - Visit: https://www.bing.com/webmasters
   - Import from Google Search Console
   - Submit same sitemap

3. **Rich Results Test**
   - Visit: https://search.google.com/test/rich-results
   - Test each page type:
     - Home (Organization, WebSite, FAQPage)
     - Ranking pages (BreadcrumbList, Product)
     - Help articles (Article, FAQPage)
   - Fix any warnings

4. **PageSpeed Insights**
   - Visit: https://pagespeed.web.dev
   - Test key pages monthly
   - Target: 90+ on all metrics
   - Monitor Core Web Vitals

### SEO Alerts to Set Up

- Weekly email: Google Search Console summary
- Alert if: Pages indexed drops by 10%
- Alert if: Average position increases by 5
- Alert if: Click-through rate drops by 20%

---

## 9. Monitoring Checklist

### Daily (First Week)
- [ ] Check Vercel deployments status
- [ ] Review error logs (if Sentry enabled)
- [ ] Check uptime status
- [ ] Monitor Core Web Vitals

### Weekly
- [ ] Google Search Console summary
- [ ] Analytics traffic review
- [ ] Top pages performance
- [ ] Indexing status (until 92 pages indexed)

### Monthly
- [ ] Full PageSpeed Insights audit
- [ ] Security audit (npm audit)
- [ ] Review SEO rankings
- [ ] Analyze top search queries
- [ ] Review conversion goals

### Quarterly
- [ ] Comprehensive performance review
- [ ] SEO strategy adjustment
- [ ] Bundle size optimization
- [ ] Database performance review
- [ ] Infrastructure cost review

---

## 10. Success Metrics Dashboard

### Create a Simple Dashboard

**Option 1**: Use Vercel Analytics (built-in)

**Option 2**: Google Data Studio
1. Connect Google Analytics
2. Connect Google Search Console
3. Create report with:
   - Traffic over time
   - Pages indexed
   - Average position
   - Core Web Vitals
   - Top pages
   - Conversion goals

**Option 3**: Custom Dashboard (future)
- Build with Recharts
- Pull data from GA4 API
- Show on `/dashboard/analytics` (auth required)

### Key Metrics to Track

| Category | Metric | Target (Month 1) | Target (Month 6) |
|----------|--------|------------------|------------------|
| **Traffic** | Organic visits | 100+ | 1,000+ |
| **SEO** | Pages indexed | 70+ | 92+ |
| **SEO** | Average position | < 30 | < 10 |
| **Performance** | LCP | < 2.5s | < 2s |
| **Performance** | FID | < 100ms | < 50ms |
| **Performance** | CLS | < 0.1 | < 0.05 |
| **Reliability** | Uptime | 99.5% | 99.9% |
| **Reliability** | Error rate | < 1% | < 0.1% |

---

## 11. Alert Configuration

### Critical Alerts (Immediate Action)
- Site down for > 10 minutes
- Error rate > 5%
- Database connection failed
- API rate limit exceeded

### Warning Alerts (Review Within 24h)
- LCP > 4 seconds
- Pages indexed dropped 10%
- Organic traffic dropped 20%
- Build failed

### Info Alerts (Review Weekly)
- New pages indexed
- Traffic milestone reached
- Performance improved
- New referring domains

---

## Implementation Priority

### Week 1 (Must Have)
1. ✅ Google Search Console
2. ✅ Uptime monitoring (UptimeRobot)
3. ✅ Vercel Analytics (if using Vercel)

### Week 2-4 (Should Have)
4. ⏳ Google Analytics 4
5. ⏳ PageSpeed Insights baseline
6. ⏳ Bing Webmaster Tools

### Month 2+ (Nice to Have)
7. ⏳ Sentry error tracking
8. ⏳ Custom dashboard
9. ⏳ A/B testing (if needed)

---

## Resources

- [Next.js Analytics](https://nextjs.org/analytics)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Google Analytics](https://support.google.com/analytics)
- [Web Vitals](https://web.dev/vitals)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Prepared by**: GitHub Copilot Agent  
**Date**: April 28, 2026  
**Status**: ✅ Complete - Ready for Implementation  
**Estimated Setup Time**: 2-3 hours
