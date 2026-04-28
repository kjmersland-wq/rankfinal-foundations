# Supabase Google OAuth Setup Guide

**Status**: ⚠️ **MANUAL ACTION REQUIRED**

**Error**: "Unsupported provider: provider is not enabled"

This error occurs because Google OAuth is not yet enabled in your Supabase project. Follow the steps below to configure it correctly.

---

## Prerequisites

1. A Supabase project
2. A Google Cloud Console account
3. Access to both dashboards

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)
3. Navigate to: **APIs & Services** → **Credentials**

### 1.2 Create OAuth 2.0 Client ID
1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. If prompted, configure the OAuth consent screen first:
   - **User Type**: External
   - **App name**: RankFinal
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **Authorized domains**: `rankfinal.com`
   - **Scopes**: Add email and profile (basic scopes)
   - Save and continue

3. Back to **Create OAuth client ID**:
   - **Application type**: Web application
   - **Name**: RankFinal Production
   - **Authorized JavaScript origins**:
     ```
     https://www.rankfinal.com
     https://rankfinal.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     https://www.rankfinal.com
     https://rankfinal.com
     ```
     
     ⚠️ **Important**: Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference ID. You can find this in your Supabase project URL: `https://[YOUR-PROJECT-REF].supabase.co`

4. Click **CREATE**
5. **Save the credentials**:
   - Copy the **Client ID** (starts with `*.apps.googleusercontent.com`)
   - Copy the **Client Secret**
   - Store these securely - you'll need them in the next step

---

## Step 2: Configure Supabase

### 2.1 Enable Google Provider in Supabase
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]
2. Navigate to: **Authentication** → **Providers**
3. Find **Google** in the provider list
4. Click on **Google** to expand the configuration

### 2.2 Configure Google Provider
1. **Enable Google provider**: Toggle the switch to ON
2. **Enter credentials from Step 1.2**:
   - **Client ID (for OAuth)**: Paste your Google OAuth Client ID
   - **Client Secret (for OAuth)**: Paste your Google OAuth Client Secret
3. **Additional Settings**:
   - **Skip nonce check**: Leave unchecked (recommended)
   - **Authorized Client IDs**: Leave empty unless using mobile apps
4. Click **Save**

### 2.3 Get Supabase Callback URL
After saving, Supabase will show you the callback URL. It should be:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

Make sure this exact URL is added to Google Cloud Console's Authorized redirect URIs (you should have added it in Step 1.2).

---

## Step 3: Configure Redirect URLs

### 3.1 Add Production URL to Supabase
1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://www.rankfinal.com`
3. **Redirect URLs**: Add these URLs (comma-separated or one per line):
   ```
   https://www.rankfinal.com
   https://rankfinal.com
   https://www.rankfinal.com/**
   https://rankfinal.com/**
   ```
4. Click **Save**

### 3.2 Verify Google Cloud Console Redirect URIs
Go back to Google Cloud Console and verify these URIs are listed:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
https://www.rankfinal.com
https://rankfinal.com
```

---

## Step 4: Configure Environment Variables in Vercel

### 4.1 Get Supabase Credentials
From Supabase Dashboard → **Settings** → **API**:
- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **anon public key**: `eyJ...` (long base64 string)
- **service_role key**: `eyJ...` (long base64 string - keep this secret!)

### 4.2 Add Environment Variables to Vercel
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your `rankfinal-foundations` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

**Required for Next.js (must start with NEXT_PUBLIC_)**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-public-key]
```

**Server-side only (no NEXT_PUBLIC_ prefix)**:
```bash
SUPABASE_SERVICE_KEY=[your-service-role-key]
ANTHROPIC_API_KEY=[your-anthropic-api-key]
STRIPE_SECRET_KEY=[your-stripe-secret-key]
```

5. Set **Environment**: Production (and optionally Preview/Development)
6. Click **Save** for each variable
7. **Redeploy** your application for changes to take effect

---

## Step 5: Test the Integration

### 5.1 Test Login Flow
1. Visit https://www.rankfinal.com
2. Click on **Sign In** or **Get Started**
3. Click **Sign in with Google**
4. You should be redirected to Google's OAuth consent screen
5. Select your Google account and grant permissions
6. You should be redirected back to RankFinal and logged in

### 5.2 Troubleshooting
If login fails, check:

**Console Errors**:
- Open browser DevTools (F12) → Console tab
- Look for errors related to Supabase or OAuth

**Common Issues**:

1. **"Unsupported provider: provider is not enabled"**
   - Solution: Google provider is not enabled in Supabase. Go back to Step 2.1

2. **"redirect_uri_mismatch"**
   - Solution: The redirect URI in Google Cloud Console doesn't match Supabase callback URL
   - Verify Step 1.2 and Step 2.3

3. **"Invalid client_id"**
   - Solution: Client ID in Supabase doesn't match Google Cloud Console
   - Verify Step 2.2

4. **Blank page or white screen**
   - Solution: Environment variables not set in Vercel
   - Verify Step 4.2 and redeploy

5. **CORS errors**
   - Solution: Authorized origins not set correctly in Google Cloud Console
   - Verify Step 1.2

---

## Step 6: Verify in Supabase Dashboard

After successful login:
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your user account listed
3. Click on the user to see details:
   - Provider: google
   - Email: Your Google email
   - Created at: Timestamp of first login

---

## Security Best Practices

1. **Never commit secrets to Git**:
   - Client Secret (Google)
   - Service Role Key (Supabase)
   - API keys

2. **Use environment variables** for all sensitive data

3. **Restrict API access**:
   - In Google Cloud Console, restrict Client ID to specific domains
   - In Supabase, enable Row Level Security (RLS) on all tables

4. **Monitor OAuth usage**:
   - Check Google Cloud Console → APIs & Services → Dashboard
   - Review Supabase Auth logs regularly

5. **Rotate credentials** if compromised:
   - Generate new Client Secret in Google Cloud Console
   - Update Supabase configuration
   - Update Vercel environment variables
   - Redeploy application

---

## Quick Reference

### Google Cloud Console
- **URL**: https://console.cloud.google.com/apis/credentials
- **What to configure**: OAuth 2.0 Client ID, Authorized redirect URIs
- **Redirect URI format**: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### Supabase Dashboard
- **URL**: https://supabase.com/dashboard
- **What to configure**: Authentication → Providers → Google
- **Required fields**: Client ID, Client Secret from Google

### Vercel Dashboard
- **URL**: https://vercel.com/dashboard
- **What to configure**: Settings → Environment Variables
- **Required vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Support Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

**Status**: Once you complete all steps above, Google OAuth should work correctly on production.

**Last Updated**: April 28, 2026
