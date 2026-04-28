import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerUser } from '../../../lib/supabase-server';
import { checkRateLimit } from '../../../lib/rate-limit';

// IMPORTANT: Server-side only - API keys never exposed to client
import 'server-only';

// Rate limiting
const RATE_LIMIT_MAX = 10; // 10 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    
    const rateCheck = checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Authentication check - user must be signed in
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { priceId } = body;
    
    // Validate input
    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing priceId' },
        { status: 400 }
      );
    }
    
    // Validate priceId format (Stripe price IDs start with price_)
    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Invalid priceId format' },
        { status: 400 }
      );
    }
    
    // Check for Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
    
    // Initialize Stripe (server-side only)
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rankfinal.com'}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rankfinal.com'}/pricing`,
      automatic_tax: { enabled: true },
      client_reference_id: user.id, // Link to user for webhook processing
      customer_email: user.email,
    });
    
    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }
    
    return NextResponse.json({ url: session.url }, { status: 200 });
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Don't leak internal error details to client
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Payment processing error. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
