# Manual Configuration Steps for RankFinal Production

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

- [ ] Auth callback route deployed (`/auth/callback`)
- [ ] Test sign-in with email/password works
- [ ] Get Pro button redirects unauthenticated users to signin
- [ ] Get Pro button initiates Stripe checkout for authenticated users
- [ ] Search functionality works (already deployed)
- [ ] Favicon loads without 404
- [ ] Stripe webhook configured (optional but recommended)
