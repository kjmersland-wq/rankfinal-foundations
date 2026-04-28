# RankFinal Foundations

AI-powered product and service recommendation platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linter
npm run lint
```

## 📋 Environment Variables

### Required for Development

```bash
# Supabase
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

### Required for Production (Server-side only)

These should **NEVER** be prefixed with `VITE_` and should only be configured in your deployment platform (Vercel/Netlify environment variables):

```bash
ANTHROPIC_API_KEY="sk-ant-your-key-here"
STRIPE_SECRET_KEY="sk_live_your-key-here"
SUPABASE_SERVICE_KEY="your-service-role-key-here"
```

### Optional

```bash
VITE_FORMSPREE_FORM_ID="your-form-id"
VITE_SENTRY_DSN="your-sentry-dsn"
```

## 🗄️ Database Setup

This project uses Supabase for backend. To set up the database:

1. Create a new Supabase project at https://supabase.com
2. Run the migrations in order:
   ```bash
   # In Supabase SQL Editor, run each migration file:
   supabase/migrations/20260426101102_fff329a0-cc43-49a3-a340-3f53d11ac95f.sql
   supabase/migrations/20260428_fix_subscriptions_schema.sql
   supabase/migrations/20260428_add_missing_tables.sql
   ```

3. Configure Row Level Security (RLS) policies are included in the migrations

## 🔐 Security Notes

- **NEVER** commit `.env` files to git
- Use `.env.local` for local development
- Configure production secrets in your deployment platform's environment variables
- The `VITE_` prefix makes variables available in the client bundle - only use for public values
- Keep API keys and secrets server-side only

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Anthropic Claude (via serverless functions)
- **Payments**: Stripe

## 📦 Bundle Size

Current bundle sizes:
- Main bundle: ~171 KB gzipped (target: <100 KB)
- Search page: ~16 KB gzipped
- Contact page: ~14 KB gzipped

## 🧪 Testing

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📝 License

Proprietary - All rights reserved

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Production Site](https://www.rankfinal.com)

## ⚠️ Known Issues

### Bundle Size
The main bundle currently exceeds recommended size (171 KB vs 100 KB target). This is due to:
- Multiple Radix UI components
- Hardcoded data in src/data/
- Not all routes are code-split

**TODO**: Implement code splitting and move data to API endpoints.

### SEO Limitations
The app uses client-side rendering (CSR) which limits SEO capabilities:
- Search engines cannot index dynamic content
- All pages have the same metadata
- No server-side rendering for search results

**Future**: Consider migrating to Next.js for better SEO.

## 🛠️ Development Tools

- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting (via ESLint)
- **Vitest**: Unit testing
- **GitHub Actions**: CI/CD pipeline

