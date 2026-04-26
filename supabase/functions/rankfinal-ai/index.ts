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

    const searchResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: `You are a research assistant finding the latest independent test results and reviews.
Search for recent (2024-2026) test data from trusted sources only:
- Electronics: RTINGS.com, GSMArena, Notebookcheck, Tom's Guide, Which?, Stiftung Warentest
- Insurance Norway: EPSI Norway, Bytt.no, Forsikringtest.no, Finans Norge
- Banking Norway: EPSI Norway, Renteradar.no, Finansportalen.no, Bytt.no
- Banking Global: J.D. Power, Canstar, Which?
- Energy Norway: EPSI Norway, Bytt.no, NVE
- Cars/EV: Motor.no, What Car, Autocar, ADAC
- Home appliances: Which?, Stiftung Warentest, RTINGS.com, Wirecutter
- Travel insurance: Which?, Forbes, NerdWallet
- Sports/Outdoor: OutdoorGearLab, REI, MEC

Search for: "[query] test review 2025 2026 independent"

Return ONLY valid JSON, no markdown:
{
  "sources_found": [
    {
      "name": "source name",
      "url": "url",
      "country": "country code",
      "date": "date found",
      "key_finding": "what they found"
    }
  ],
  "top_products": ["product 1", "product 2"],
  "consensus": "what most sources agree on"
}`,
        messages: [
          {
            role: "user",
            content: `Find latest test results for: "${query.trim()}" in ${country}`,
          },
        ],
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      return new Response(JSON.stringify({ error: "Anthropic web search failed", details: errorText }), {
        status: searchResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchData = await searchResponse.json();
    const searchText = searchData.content?.filter((item: { type?: string }) => item.type === "text")?.map((item: { text?: string }) => item.text ?? "")?.join("\n") ?? "";
    const cleanedSearchText = searchText.replace(/```json/g, "").replace(/```/g, "").trim();
    let searchResults: unknown;

    try {
      searchResults = JSON.parse(cleanedSearchText);
    } catch {
      searchResults = { sources_found: [], top_products: [], consensus: cleanedSearchText };
    }
    
    const recommendationResponse = await fetch("https://api.anthropic.com/v1/messages", {
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

GLOBAL BANKING KNOWLEDGE BY COUNTRY AND SEGMENT:

UNITED KINGDOM:
Standard/Average:
- Best: Monzo (app-based, zero fees, instant notifications)
- Alternative: Starling Bank (best customer service UK)
- Avoid: HSBC retail, Barclays (high fees, poor service)
- Source: Which? Magazine 2025, Trustpilot UK
Professional (£50k-150k):
- Best: First Direct (consistently #1 UK satisfaction)
- Alternative: Starling Business
- Consider: Marcus by Goldman Sachs (savings rates)
Wealthy (£150k+):
- Best: Coutts (oldest private bank, Royal family bank)
- Alternative: HSBC Premier, Barclays Premier
- Global: Julius Baer, Pictet

GERMANY:
Standard:
- Best: ING Deutschland (highest satisfaction, zero fees, good app)
- Alternative: DKB (Deutsche Kreditbank - excellent free account)
- Avoid: Deutsche Bank retail (high fees)
- Source: Stiftung Warentest 2025
Professional:
- Best: Commerzbank (good digital + branches)
- Alternative: Comdirect
Wealthy:
- Best: Deutsche Bank Private Wealth Management
- Alternative: Berenberg Bank (oldest private bank)
- Global option: UBS Germany

SWEDEN:
Standard:
- Best: Swedbank (highest satisfaction Sweden)
- Alternative: Länsförsäkringar Bank
- Avoid: Nordea Sweden (low satisfaction scores)
- Source: EPSI Sweden 2025
Professional:
- Best: SEB (strong digital, good advisor network)
- Alternative: Handelsbanken
Wealthy:
- Best: Handelsbanken Private Banking
- Alternative: SEB Private Banking
- Global: Carnegie, Öhman

DENMARK:
Standard:
- Best: Lunar Bank (best digital, zero fees)
- Alternative: Arbejdernes Landsbank
- Avoid: Danske Bank retail (scandal history, low satisfaction)
- Source: EPSI Denmark 2025
Professional:
- Best: Jyske Bank
- Alternative: Sydbank
Wealthy:
- Best: Saxo Bank (investments + banking)
- Alternative: Danske Bank Private Banking (better than their retail division)

FINLAND:
Standard:
- Best: OP Financial Group (cooperative, highest satisfaction Finland)
- Alternative: Nordea Finland (better here than other Nordics)
- Source: EPSI Finland 2025
Wealthy:
- Best: Evli Bank
- Alternative: Alexandria

UNITED STATES:
Standard:
- Best: Ally Bank (online, zero fees, high savings rates, J.D. Power top rated)
- Alternative: Charles Schwab Bank (best for travelers - zero ATM fees worldwide)
- Avoid: Wells Fargo (scandal history, low J.D. Power scores)
- Source: J.D. Power 2025, Bankrate
Professional:
- Best: Chase Sapphire Banking
- Alternative: Citibank Priority
Wealthy ($1M+):
- Best: JP Morgan Private Client
- Alternative: Goldman Sachs Private Wealth
- Ultra-wealthy: Northern Trust, Bessemer Trust

CANADA:
Standard:
- Best: Tangerine (zero fees, good rates)
- Alternative: EQ Bank (best savings rates)
- Avoid: Big 5 retail (RBC, TD, BMO, Scotia, CIBC) - high fees
- Source: J.D. Power Canada 2025
Wealthy:
- Best: RBC Wealth Management
- Alternative: TD Wealth

AUSTRALIA:
Standard:
- Best: ING Australia (Canstar 5-star, zero fees, cashback)
- Alternative: Up Bank (best app Australia)
- Avoid: Commonwealth Bank retail (highest fees, Royal Commission findings)
- Source: Canstar 2025, Roy Morgan
Professional:
- Best: Macquarie Bank
Wealthy:
- Best: Commonwealth Private (irony - better private than retail)
- Alternative: ANZ Private

NETHERLANDS:
Standard:
- Best: Bunq (best app, sustainable, zero fees for basic)
- Alternative: ING Netherlands
- Source: Consumentenbond 2025

FRANCE:
Standard:
- Best: Boursorama (zero fees, best digital bank France)
- Alternative: Hello bank! (BNP subsidiary)
- Avoid: Crédit Agricole retail (high fees)
- Source: UFC-Que Choisir 2025
Wealthy:
- Best: BNP Paribas Wealth Management
- Alternative: Société Générale Private

SPAIN:
Standard:
- Best: BBVA (best app in Europe 2024, Forrester ranking)
- Alternative: ING Spain (zero fees)
- Source: Forrester 2024, OCU Spain

JAPAN:
Standard:
- Best: SBI Sumishin Net Bank (highest satisfaction Japan)
- Alternative: Rakuten Bank
- Source: Oricon satisfaction survey 2025

GLOBAL / EXPATS / DIGITAL NOMADS:
- Best: Wise (formerly TransferWise) - best for international transfers, multi-currency, low fees
- Alternative: Revolut (great app, but customer service issues reported)
- Also: N26 (EU-based, good for Europe travel)
- Avoid: Traditional banks for FX - always overcharge on exchange rates

GLOBAL PRIVATE BANKING (ultra-wealthy):
Tier 1 (best globally):
- Julius Baer (Switzerland) - pure private banking, no retail distractions
- Pictet (Switzerland) - oldest independent private bank
- Lombard Odier (Switzerland)
Tier 2:
- UBS Wealth Management
- Credit Suisse Private (now merged with UBS)
- HSBC Private Banking
Tier 3 (large but good private divisions):
- JP Morgan Private Bank (USA)
- Goldman Sachs PWM (USA)
- Deutsche Bank Wealth Management

SEGMENT DETECTION FROM ANY LANGUAGE:
- Norwegian: vanlig/student/god jobb/rik/formue
- English: standard/professional/wealthy/rich/HNW
- German: normal/reich/vermögend
- Swedish: vanlig/förmögen
- Danish: almindelig/velhavende
- French: normal/riche/fortuné
- Spanish: normal/rico/acaudalado

IMPORTANT BANKING SEGMENT RULE:
If user does not specify segment, always recommend for STANDARD segment and add this note: "💡 This recommendation is for everyday banking. If you have high income or significant wealth, ask RankFinal for private banking recommendations."

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
