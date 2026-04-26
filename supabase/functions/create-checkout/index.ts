import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isStripeEnv(value: unknown): value is StripeEnv {
  return value === "sandbox" || value === "live";
}

async function createCheckoutSession(options: {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
  environment: StripeEnv;
}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(options.priceId)) throw new Error("Invalid priceId");

  const stripe = createStripeClient(options.environment);
  const prices = await stripe.prices.list({ lookup_keys: [options.priceId] });
  if (!prices.data.length) throw new Error("Price not found");

  const stripePrice = prices.data[0];
  const isRecurring = stripePrice.type === "recurring";
  const metadata = {
    ...(options.userId ? { userId: options.userId } : {}),
    managed_payments: "true",
  };

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: stripePrice.id, quantity: options.quantity || 1 }],
    mode: isRecurring ? "subscription" : "payment",
    ui_mode: "embedded",
    return_url: options.returnUrl,
    managed_payments: { enabled: true },
    metadata,
    ...(options.customerEmail && { customer_email: options.customerEmail }),
    ...(options.userId && isRecurring && { subscription_data: { metadata: { userId: options.userId } } }),
  });

  return session.client_secret;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    if (!isStripeEnv(body.environment)) throw new Error("Invalid environment");

    const clientSecret = await createCheckoutSession({
      priceId: body.priceId,
      quantity: body.quantity,
      customerEmail: body.customerEmail,
      userId: body.userId,
      returnUrl: body.returnUrl,
      environment: body.environment,
    });

    return new Response(JSON.stringify({ clientSecret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create checkout" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
