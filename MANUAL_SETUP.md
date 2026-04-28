# Manual Configuration Steps for RankFinal Production

## Google OAuth Setup

After deploying the code changes, complete these manual configuration steps to enable Google OAuth sign-in.

### Step 1: Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application** as the application type
6. Add these **Authorized redirect URIs**:
   - `https://ezazffnssczwxqzejmfn.supabase.co/auth/v1/callback`
   - `https://www.rankfinal.com/auth/callback`
7. Click **Create**
8. **Copy the Client ID and Client Secret** (you'll need these in Step 2)

### Step 2: Supabase Dashboard Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ezazffnssczwxqzejmfn)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to expand
4. Toggle **Enable** to ON
5. Paste the **Client ID** from Step 1
6. Paste the **Client Secret** from Step 1
7. Click **Save**

### Step 3: Vercel Environment Variables (Optional)

If you need to use Google OAuth credentials in server-side code:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add these variables:
   - `GOOGLE_CLIENT_ID` = (Client ID from Step 1)
   - `GOOGLE_CLIENT_SECRET` = (Client Secret from Step 1)
5. Redeploy if you made changes

## Testing the OAuth Flow

After completing the configuration:

1. Go to https://www.rankfinal.com/signin
2. Click **Continue with Google**
3. Select your Google account
4. You should be redirected back to the site and signed in
5. Check that the auth state is properly set (e.g., user sees their email/profile)

## Troubleshooting

**Error: "Unsupported provider"**
- Verify Step 2 was completed and Google is enabled in Supabase
- Check that the Client ID and Secret are correct

**Error: "redirect_uri_mismatch"**
- Verify the exact redirect URIs are added in Google Cloud Console
- Make sure there are no trailing slashes or typos

**User is redirected but not signed in**
- Check browser console for errors
- Verify the `/auth/callback` route exists and is deployed
- Check Supabase logs for authentication errors

## Stripe Webhook Configuration

The Stripe checkout flow will work for creating subscriptions, but to handle webhook events (subscription updates, cancellations, etc.), you need to configure webhooks:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://www.rankfinal.com/api/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret**
6. Add to Vercel environment variables:
   - `STRIPE_WEBHOOK_SECRET` = (Signing secret from above)
7. Redeploy

## Verification Checklist

- [ ] Google OAuth configured in Google Cloud Console
- [ ] Google provider enabled in Supabase Dashboard
- [ ] OAuth redirect URIs match exactly
- [ ] Auth callback route deployed (`/auth/callback`)
- [ ] Test sign-in with Google works
- [ ] Test sign-in with email/password works
- [ ] Get Pro button redirects unauthenticated users to signin
- [ ] Get Pro button initiates Stripe checkout for authenticated users
- [ ] Search functionality works (already deployed)
- [ ] Favicon loads without 404
- [ ] Stripe webhook configured (optional but recommended)
