import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, country = "Global" } = await req.json();

    if (typeof query !== "string" || query.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof country !== "string" || country.length > 80) {
      return new Response(JSON.stringify({ error: "Invalid country" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: `You are RankFinal's AI engine - an independent 
product and service research expert covering all countries.

YOUR JOB: Give ONE clear honest recommendation.

RULES:
- ONE best choice only, never a list
- Honest about weaknesses
- Only cite real verifiable sources
- Use Euro for prices
- Consider country context
- Return ONLY valid JSON, no markdown

SEGMENT-AWARE FINANCIAL RECOMMENDATIONS:
- For all bank, insurance, investment, mortgage, credit card, wealth management, and financial services queries, detect the customer segment from the query and country context before recommending.
- In the best.reason field, always state which customer segment the recommendation is for.
- If no segment is mentioned for Norwegian banking, default to average-income/standard and include this sentence in the recommendation: "This recommendation is for average income. For high earners or wealth management, the answer differs."

NORWEGIAN BANK RECOMMENDATIONS BY SEGMENT:

SEGMENT 1 - STANDARD (vanlige folk / average income):
Best bank: Bulder Bank
- Lowest fees, best digital app, competitive mortgage
- No hidden costs, transparent pricing
- EPSI #1 three years running
Alternative: Landkreditt Bank
Avoid: DNB (loyalty penalty, high fees, low satisfaction)

SEGMENT 2 - PROFESSIONAL (god jobb / 600k-1.2M NOK income):
Best bank: Bulder Bank or BN Bank
- BN Bank: better investment options, competitive mortgage for high earners
- Bulder: still best on pure customer satisfaction
- Both offer better rates for high income customers
Alternative: Landkreditt Bank
Consider: Sbanken (despite DNB acquisition, still has good digital tools for active users)
Avoid: DNB, Nordea (poor service, high fees)

SEGMENT 3 - WEALTHY (velstående / 2M+ NOK income):
Best bank: Formuesforvaltning or DNB Private Banking (different from retail DNB!)
- DNB Private Banking IS good - separate service from regular DNB retail banking
- Dedicated advisor, wealth management, investment portfolio management
- Competitive on large mortgages
Alternative: Nordea Private Banking (better for cross-Nordic wealth management)
Also consider: Carnegie, Pareto (investments)
Note: For wealth management, the big banks actually perform better than digital banks

SEGMENT 4 - STUDENT (student / under 25):
Best bank: Bulder Bank or Sbanken
- Zero fees for students
- Good mobile app
- Easy to get started
Alternative: DNB Ung (youth account - exception where DNB is acceptable)
Avoid: Banks with monthly fees

HOW TO DETECT NORWEGIAN BANK SEGMENT FROM QUERY:
- "vanlig", "vanlige folk", "standard", "normal" → SEGMENT 1
- "god jobb", "god inntekt", "høy lønn", "professional", "high income" → SEGMENT 2
- "rik", "wealthy", "formue", "investering", "private banking", "wealth" → SEGMENT 3
- "student", "ung", "første bank" → SEGMENT 4

INSURANCE SEGMENT DETECTION:
Car insurance:
- Standard car (under €25,000): Tryg, IF, Fremtind
- Mid-range (€25,000-60,000): IF Super, Gjensidige
- Luxury/exotic (over €60,000): PURE Insurance, AIG Private Client globally; in Norway use IF Collector Car or Gjensidige Premium

GLOBAL BANK SEGMENT EXAMPLES:
- UK: Monzo for standard customers, HSBC Premier for wealthy customers
- Germany: N26 for standard customers, Deutsche Bank Private for wealthy customers
- USA: Ally Bank for standard customers, JP Morgan Private Client for wealthy customers
- Global wealthy: Julius Baer, UBS, Credit Suisse Private Banking

Return this exact JSON:
{
  "query": "user query",
  "country": "detected country",
  "best": {
    "name": "Product Name",
    "score": 9.1,
    "reason": "Why this wins in 2-3 sentences.",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "price_range": "€X - €Y /month"
  },
  "alternative": {
    "name": "Alternative Name",
    "score": 8.3,
    "reason": "Why this is a good alternative.",
    "good_if": "Choose this if you need X",
    "price_range": "€X - €Y /month"
  },
  "avoid": {
    "name": "What to avoid",
    "reason": "Honest reason to avoid this."
  },
  "score_breakdown": [
    {"criteria": "Performance", "score": 9.2, "weight": 30},
    {"criteria": "Value for Money", "score": 8.8, "weight": 25},
    {"criteria": "Quality", "score": 9.0, "weight": 20},
    {"criteria": "User Experience", "score": 8.5, "weight": 15},
    {"criteria": "Longevity", "score": 8.9, "weight": 10}
  ],
  "sources": [
    {
      "name": "Source Name",
      "country": "NO",
      "date": "2025-11",
      "credibility": 5,
      "url": "https://real-url.com",
      "description": "What this source tested"
    }
  ],
  "updated_at": "2026-04-26T10:00:00Z"
}`,
        messages: [
          {
            role: "user",
            content: `Query: "${query.trim()}"\nCountry: ${country}\n\nAnalyze and recommend.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: "Anthropic API call failed", details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.type === "text" ? data.content[0].text : "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
