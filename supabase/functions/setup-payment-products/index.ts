import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const productIds = [
  "rankfinal_pro_monthly",
  "rankfinal_pro_yearly",
  "rankfinal_business_monthly",
  "rankfinal_business_yearly",
];

function isStripeEnv(value: unknown): value is StripeEnv {
  return value === "sandbox" || value === "live";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const environment = isStripeEnv(body.environment) ? body.environment : "sandbox";
    const stripe = createStripeClient(environment);
    const updated: string[] = [];

    for (const externalId of productIds) {
      const products = await stripe.products.search({ query: `metadata['lovable_external_id']:'${externalId}'` });
      for (const product of products.data) {
        await stripe.products.update(product.id, { tax_code: "txcd_10103001" });
        updated.push(externalId);
      }
    }

    return new Response(JSON.stringify({ updated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Product setup error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Product setup failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
