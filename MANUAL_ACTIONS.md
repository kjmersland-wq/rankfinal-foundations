# Manual Actions Required

This document lists all actions that must be performed outside the codebase to complete the deployment and fixes.

## 🔐 1. Rotate Supabase Credentials (CRITICAL)

**Why**: The `.env` file was previously committed to git, exposing the Supabase publishable key.

**Actions**:
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to Project Settings → API
3. Click "Reset Database Password"
4. Generate new "anon/public" key
5. Generate new "service_role" key
6. Update environment variables in your deployment platform with new keys

**Verification**: Old keys should no longer work after rotation.

---

## 🌍 2. Configure Environment Variables in Deployment Platform

**Platform**: Vercel / Netlify / Your hosting provider

**Required Variables**:

### Production Environment
```
VITE_SUPABASE_PROJECT_ID=<new_project_id>
VITE_SUPABASE_PUBLISHABLE_KEY=<new_anon_key>
VITE_SUPABASE_URL=https://<new_project_id>.supabase.co

ANTHROPIC_API_KEY=sk-ant-<production_key>
STRIPE_SECRET_KEY=sk_live_<production_key>
SUPABASE_SERVICE_KEY=<new_service_role_key>
```

### Preview/Staging Environment
```
VITE_SUPABASE_PROJECT_ID=<staging_project_id>
VITE_SUPABASE_PUBLISHABLE_KEY=<staging_anon_key>
VITE_SUPABASE_URL=https://<staging_project_id>.supabase.co

ANTHROPIC_API_KEY=sk-ant-<test_key>
STRIPE_SECRET_KEY=sk_test_<test_key>
SUPABASE_SERVICE_KEY=<staging_service_role_key>
```

**Verification**: Deploy and check that API calls work correctly.

---

## 🗄️ 3. Run Database Migrations

**Platform**: Supabase SQL Editor

**Actions**:
1. Go to Supabase Dashboard → SQL Editor
2. Run migrations in this order:
   
   a. **First migration** (if not already run):
   ```sql
   -- Copy content from: supabase/migrations/20260426101102_fff329a0-cc43-49a3-a340-3f53d11ac95f.sql
   ```
   
   b. **Fix subscriptions schema**:
   ```sql
   -- Copy content from: supabase/migrations/20260428_fix_subscriptions_schema.sql
   ```
   
   c. **Add missing tables**:
   ```sql
   -- Copy content from: supabase/migrations/20260428_add_missing_tables.sql
   ```

3. Verify each migration runs successfully
4. Check that all tables exist: profiles, search_history, saved_results, feedback, subscription_audit_log

**Verification**:
```sql
-- Run in SQL Editor to verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 🔍 4. Submit Updated Sitemap to Google Search Console

**Why**: We removed unindexable CSR search pages from the sitemap.

**Actions**:
1. Go to Google Search Console: https://search.google.com/search-console
2. Select your property (www.rankfinal.com)
3. Navigate to Sitemaps
4. Remove old sitemap if present
5. Submit new sitemap URL: `https://www.rankfinal.com/sitemap.xml`
6. Request indexing for key pages

**Verification**: Check that sitemap shows 300-310 URLs (not 370+).

---

## 💳 5. Configure Stripe Webhook (If Using Subscriptions)

**Platform**: Stripe Dashboard

**Actions**:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Create new webhook endpoint:
   - **URL**: `https://www.rankfinal.com/api/stripe-webhook`
   - **Events to listen for**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copy the signing secret
4. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

**Note**: You'll need to implement the webhook handler at `/api/stripe-webhook`

**Verification**: Test with Stripe CLI:
```bash
stripe trigger customer.subscription.created
```

---

## 📧 6. Configure Formspree for Feedback Form

**Platform**: Formspree

**Actions**:
1. Go to https://formspree.io
2. Create a new form
3. Copy the form ID (e.g., `mrbzpqxy`)
4. Add to environment variables:
   ```
   VITE_FORMSPREE_FORM_ID=mrbzpqxy
   ```
5. Update email notification settings in Formspree dashboard

**Verification**: Submit test feedback through the app.

---

## 🚨 7. Set Up Error Tracking (Optional but Recommended)

**Platform**: Sentry

**Actions**:
1. Go to https://sentry.io and create account
2. Create new project for "React"
3. Copy the DSN
4. Add to environment variables:
   ```
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```
5. Deploy and trigger a test error to verify

**Implementation needed**: Add Sentry initialization code (see audit recommendation).

---

## 🔒 8. Review and Update robots.txt

**Current Status**: Good, but could be improved

**Optional Improvements**:
1. Add these lines to `public/robots.txt`:
   ```
   Disallow: /signin
   Disallow: /*?*country=
   Disallow: /*?*utm_
   ```

**Verification**: Test at https://www.google.com/webmasters/tools/robots-testing-tool

---

## 📊 9. Set Up Google Analytics or Privacy-Friendly Alternative

**Recommended**: Plausible Analytics (GDPR-compliant, no cookies)

**Actions**:
1. Sign up at https://plausible.io
2. Add your domain
3. Copy the script tag
4. Add to `index.html` or create a component wrapper

**Note**: Current implementation has NO analytics, which is good for privacy but limits insights.

---

## 🔄 10. Configure GitHub Branch Protection

**Platform**: GitHub Repository Settings

**Actions**:
1. Go to Repository → Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (optional)
3. Select required status checks:
   - CI / test

**Verification**: Try to push directly to main (should be blocked).

---

## 📝 11. Update DNS Records (If Deploying to Custom Domain)

**Platform**: Your DNS provider (Cloudflare, Namecheap, etc.)

**Actions**:
1. Add A record or CNAME pointing to your hosting provider
2. Add www subdomain if needed
3. Configure SSL certificate (usually automatic with Vercel/Netlify)

**Verification**: Visit https://www.rankfinal.com and verify SSL certificate is valid.

---

## ⏱️ 12. Schedule Database Cleanup Job (Optional)

**Platform**: Supabase → Database → Functions

**Purpose**: Clean up old search history (older than 30 days)

**Actions**:
1. Create a new SQL function:
   ```sql
   CREATE OR REPLACE FUNCTION cleanup_old_search_history()
   RETURNS void AS $$
   BEGIN
     DELETE FROM public.search_history
     WHERE searched_at < NOW() - INTERVAL '30 days';
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

2. Schedule with pg_cron (if available) or use an external cron service

**Verification**: Check that old records are deleted after 30 days.

---

## ✅ Completion Checklist

- [ ] Supabase credentials rotated
- [ ] Environment variables configured in deployment platform
- [ ] Database migrations run successfully
- [ ] Updated sitemap submitted to Google Search Console
- [ ] Stripe webhook configured (if applicable)
- [ ] Formspree form configured
- [ ] Error tracking set up (Sentry or alternative)
- [ ] robots.txt reviewed and optimized
- [ ] Analytics configured (optional)
- [ ] GitHub branch protection enabled
- [ ] DNS records configured (if custom domain)
- [ ] Database cleanup job scheduled (optional)

---

## 🆘 Troubleshooting

### Build Fails After Deployment
- Check that all environment variables are set correctly
- Verify variable names (VITE_ prefix for client-side only)
- Check build logs for specific errors

### Database Queries Fail
- Verify RLS policies are enabled
- Check that service role key is used for admin operations
- Ensure migrations ran successfully

### Authentication Doesn't Work
- Verify Supabase URL and keys are correct
- Check that redirect URLs are configured in Supabase dashboard
- Ensure cookies are enabled in browser

### API Routes Return 404
- Verify serverless functions are deployed
- Check platform-specific configuration (vercel.json, netlify.toml)
- Ensure environment variables are accessible to functions
