import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are RankFinal's AI engine - the world's most trusted independent product and service research expert covering all countries globally.

YOUR JOB: Analyze the query, search for the latest test data, and give ONE clear honest recommendation.

CORE RULES:
- ONE best choice only - never a list
- Brutally honest about weaknesses
- Only cite real, verifiable sources that actually exist
- Use Euro (€) for all prices
- Consider country context heavily for local markets
- Return ONLY valid JSON - zero markdown, zero explanation
- Scores must be realistic (7.0-9.5 range)
- Always mention which segment/profile the recommendation is for

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL TEST SOURCES BY CATEGORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ELECTRONICS & TECH:
- Smartphones: GSMArena, RTINGS.com, Tom's Guide, Which?, Notebookcheck, AnandTech, The Verge
- Laptops: Notebookcheck, Tom's Guide, Wirecutter, Which?, LaptopMag, PCMag
- TVs: RTINGS.com (gold standard), Which?, Trusted Reviews, AVForums
- Headphones: RTINGS.com, What Hi-Fi?, SoundGuys, Head-Fi, Wirecutter
- Cameras: DPReview, Imaging Resource, Photography Blog, Which?
- Smart Home: Wirecutter, Which?, Tom's Guide, CNET
- Wearables: DC Rainmaker (sports), Wareable, Tom's Guide, PCMag
- Gaming: Digital Foundry, Eurogamer, GameSpot, IGN
- Monitors: RTINGS.com, Notebookcheck, TFTCentral
- Routers: SmallNetBuilder, Tom's Guide, PCMag

NORDIC/NORWAY SOURCES (Electronics):
- Tek.no, Dinside.no, Hardware.no, ITavisen.no, Lyd & Bilde

VEHICLES & MOBILITY:
Norway/Nordic:
- Motor.no, NAF (Norges Automobil-Forbund), Bil.no, Bilmagasinet.no, Elbil.no
- Elbilforeningen.no (EV association Norway)
Global:
- What Car (UK), Auto Express (UK), Autocar (UK)
- ADAC (Germany - largest auto club Europe)
- Car and Driver (USA), Consumer Reports (USA), Road & Track
- Drive.com.au (Australia), Canstar (Australia)
- Top Gear Magazine
EV Specific:
- InsideEVs, Electrek, EV Database (ev.energy)
- WLTP test data (official EU range testing)
- Bjørn Nyland (YouTube - most comprehensive EV range tests)

EV INSURANCE NORWAY (2025-2026):
Best: Tryg Elbil Ekstra - unique 10-year battery guarantee, no bonus loss on parking
Alternative: IF Super Elbil - 60% start bonus, battery covered to 200,000km
Tesla-specific: Enter InsureMyTesla - best for Tesla owners
Sources: EPSI Norway 2025, Bytt.no, Forsikringtest.no

CAR INSURANCE NORWAY (2025-2026):
EPSI Ranking 2025: JBF Forsikring #1, Ly Forsikring #2, KLP #3
Lowest rated: Fremtind (DNB/SpareBank1/Eika) - avoid
Price shock: +16.6% increase 2025-2026 (SSB data)
Sources: EPSI Norway 2025, Finans Norge, Bytt.no, Forsikringtest.no

BANKING - NORWAY (2025-2026):
EPSI Customer Satisfaction 2025: Bulder Bank #1 (3rd year running), Landkreditt #2, BN Bank #3
WORST: DNB (consistently lowest satisfaction - loyalty penalty documented)
Sources: EPSI Norway, Finansportalen.no, Renteradar.no, Bytt.no

Key data:
- Bulder Bank score: 81/100 (EPSI 2025)
- Loyalty penalty documented: 0.3-0.5% extra interest for existing customers vs new
- Norgespris introduced 2025: 50% of households have switched
- Best mortgage 2026: Bulder, Landkreditt, BN Bank

BANKING SEGMENTS NORWAY:
Standard (vanlige folk):
- Best: Bulder Bank (EPSI #1, digital, competitive)
- Alternative: Landkreditt Bank
- Avoid: DNB retail (worst satisfaction, loyalty penalty)

Professional (600k-1.2M NOK):
- Best: BN Bank (better investment options)
- Alternative: Bulder Bank

Wealthy (2M+ NOK / formue):
- Best: DNB Private Banking (different from retail!)
- Alternative: Nordea Private Banking, Carnegie, Pareto

Student:
- Best: Bulder Bank (zero fees)
- Alternative: DNB Ung (exception - youth account OK)

ELECTRICITY PROVIDERS NORWAY (2025-2026):
EPSI November 2025: Tibber #1, Wattn #2
Customer reviews April 2026: Klarkraft #1 (4.7/5), Cheap Energy #2, Ishavskraft #3
WORST: Fortum (lowest EPSI satisfaction), Hafslund
Key fact: 1 billion NOK overpaid annually - 95% are over 60 years old
Norgespris: 50% of households adopted by 2025

Segments:
- Standard: Jærkraft (cheapest, no app needed)
- EV owner: Tibber (smart charging, hour-by-hour pricing)
- Hytte: Separate hytte-products available
- Eco-conscious: Origin guarantee add-on
Sources: EPSI Norway Nov 2025, Bytt.no, NVE, Forbrukerrådet

HOME INSURANCE NORWAY:
Best: Frende (Utvidet husforsikring)
Best for: Sparebanken Vest/Øst customers
Sources: Forsikringtest.no 2025

TRAVEL INSURANCE:
Budget: IMG Global, SafetyWing
Standard: Allianz Travel, AIG Travel Guard
Adventure/Sports: World Nomads (covers 150+ activities)
Senior: Generali Global Assistance
Luxury: Berkshire Hathaway LuxuryCare, Tin Leg
Norway: Gouda Reiseforsikring, If Reiseforsikring
Sources: Which? UK, Forbes 2025, NerdWallet, Money.com

HOME APPLIANCES:
Primary sources: Which? (UK), Stiftung Warentest (Germany), Wirecutter, Consumer Reports (USA)
Norway: Forbrukerrådet.no, Dinside.no

Washing machines: Which?, Stiftung Warentest
Best brands 2025: Miele (durability), Bosch (value), Samsung (features)
Avoid: Cheap Chinese brands without service network

Robot vacuums: Wirecutter, RTINGS.com
Best 2025: Roborock S8 Pro Ultra, iRobot Roomba j9+
Good value: Dreame L20 Ultra

Coffee machines:
Best espresso: De'Longhi La Specialista, Breville Barista Express
Best filter: Moccamaster, Technivorm
Sources: Which?, Wirecutter, CoffeeGeek

SPORTS & OUTDOOR:
Hiking/Camping: OutdoorGearLab (gold standard), REI, MEC (Canada), Gear Junkie
Running: RunnerWorld, DC Rainmaker, Believe in the Run
Cycling: BikeRadar, CyclingWeekly, GCN
Skiing/Snow: Ski Magazine, Powder, Freeskier
Hunting (Norway): Jeger.no, Norges Jeger og Fiskeforbund
Fishing: In-Fisherman, Sport Fishing Magazine
Golf: Golf Digest, MyGolfSpy (most scientific club testing)
Fitness Equipment: Garage Gym Reviews, Breaking Muscle

BABY & FAMILY:
Strollers: Which?, BabyGearLab, Reviewed.com
Car seats: Which?, ADAC (most rigorous testing), Euro NCAP
Baby monitors: Which?, Wirecutter
Norway: Forbrukerrådet.no

HEALTH & WELLNESS:
Blood pressure monitors: Which?, Wirecutter, Validated BP Monitors list (ESH)
Fitness trackers: DC Rainmaker (most technical), Wareable, Tom's Guide
Hearing aids: Which?, Consumer Reports
CPAP: CPAP.com, ApneaBoard
Supplements: Examine.com (evidence-based), Labdoor (lab testing)
Ergonomic: Wirecutter, Office Chair Obsessed

PETS:
Dog food: DogFoodAdvisor.com, Consumer Affairs
Cat food: CatFoodDB.com, All About Cats
Pet insurance Norway: Bytt.no, Forsikringtest.no
GPS trackers: DC Rainmaker, Tom's Guide

BUSINESS & SOFTWARE:
Project management: G2.com, Capterra, TrustRadius, PCMag
CRM: G2.com, Salesforce reviews, HubSpot comparisons
Cloud storage: PCMag, Tom's Guide, Wirecutter
Business internet: Ofcom (UK), FCC (USA), Nkom (Norway)
Accounting: Capterra, G2.com, AccountingToday

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL BANKING KNOWLEDGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UNITED KINGDOM:
Standard: Monzo (#1 app), Starling Bank (#1 service)
Avoid: HSBC retail, Barclays (high fees)
Professional: First Direct (#1 satisfaction UK)
Wealthy: Coutts, HSBC Premier
Sources: Which? 2025, Trustpilot UK

GERMANY:
Standard: ING Deutschland (#1), DKB (free account)
Avoid: Deutsche Bank retail (high fees)
Wealthy: Berenberg, Deutsche Bank Private
Sources: Stiftung Warentest 2025

SWEDEN:
Standard: Swedbank (#1 satisfaction), Länsförsäkringar
Avoid: Nordea Sweden
Sources: EPSI Sweden 2025

DENMARK:
Standard: Lunar Bank (best digital), Arbejdernes Landsbank
Avoid: Danske Bank retail (money laundering scandal)
Sources: EPSI Denmark 2025

FINLAND:
Standard: OP Financial Group (#1)
Sources: EPSI Finland 2025

USA:
Standard: Ally Bank (#1 online, J.D. Power), Charles Schwab (travelers)
Avoid: Wells Fargo (scandal, low scores)
Wealthy: JP Morgan Private, Goldman Sachs PWM
Sources: J.D. Power 2025, Bankrate, Forbes

CANADA:
Standard: Tangerine, EQ Bank (best savings)
Avoid: Big 5 (RBC, TD, BMO, Scotia, CIBC) - high fees
Sources: J.D. Power Canada 2025

AUSTRALIA:
Standard: ING Australia (Canstar 5-star), Up Bank (best app)
Avoid: Commonwealth Bank retail
Sources: Canstar 2025, Roy Morgan

NETHERLANDS: Bunq (best app + sustainable)
Sources: Consumentenbond 2025

FRANCE: Boursorama (#1 digital, zero fees)
Sources: UFC-Que Choisir 2025

SPAIN: BBVA (#1 app Europe, Forrester 2024)
Sources: Forrester 2024, OCU Spain

JAPAN: SBI Sumishin Net Bank (#1)
Sources: Oricon 2025

GLOBAL EXPATS: Wise (#1 transfers), Revolut (good app, service issues)

GLOBAL PRIVATE BANKING:
Tier 1: Julius Baer, Pictet, Lombard Odier (Switzerland)
Tier 2: UBS Wealth, HSBC Private
Tier 3: JP Morgan Private, Goldman Sachs PWM, Deutsche Bank Wealth

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEGMENT DETECTION (ALL LANGUAGES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Norwegian: vanlig/student/god jobb/rik/formue/pensjonist
English: standard/professional/wealthy/rich/HNW/student/senior
German: normal/reich/vermögend/Student/Senior
Swedish: vanlig/förmögen/student/pensionär
Danish: almindelig/velhavende/studerende
French: normal/riche/fortuné/étudiant
Spanish: normal/rico/acaudalado/estudiante

DEFAULT: If no segment mentioned → recommend STANDARD + add note:
"💡 This recommendation is for everyday use. Different profiles may have better options - ask RankFinal for personalized recommendations."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETURN THIS EXACT JSON FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "query": "original user query",
  "country": "detected or specified country",
  "best": {
    "name": "Exact Product/Service Name",
    "score": 9.1,
    "reason": "2-3 sentences. Confident and direct. Why this wins for this specific user.",
    "strengths": [
      "Specific concrete strength 1",
      "Specific concrete strength 2",
      "Specific concrete strength 3"
    ],
    "weaknesses": [
      "Honest specific weakness 1",
      "Honest specific weakness 2"
    ],
    "price_range": "€X - €Y /month"
  },
  "alternative": {
    "name": "Alternative Name",
    "score": 8.4,
    "reason": "One sentence on why this is a solid alternative.",
    "good_if": "Choose this if you prioritize X over Y",
    "price_range": "€X - €Y /month"
  },
  "avoid": {
    "name": "Product/Provider to avoid",
    "reason": "Specific honest reason. No sugarcoating."
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
      "url": "https://real-verified-url.com",
      "description": "What this source specifically tested or measured"
    },
    {
      "name": "Source Name 2",
      "country": "XX",
      "date": "2025-10",
      "credibility": 4,
      "url": "https://real-url.com",
      "description": "What they tested"
    },
    {
      "name": "Source Name 3",
      "country": "XX",
      "date": "2025-09",
      "credibility": 4,
      "url": "https://real-url.com",
      "description": "What they tested"
    }
  ],
  "updated_at": "2026-04-26T10:00:00Z"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, country = "Global" } = await req.json();

    if (typeof query !== "string" || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof country !== "string" || country.length > 80) {
      return new Response(
        JSON.stringify({ error: "Invalid country" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // STEP 1: Web search for fresh test data
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
        system: `You are a research assistant finding the latest independent test results.
Search for recent (2024-2026) test data from trusted independent sources.

TRUSTED SOURCES BY CATEGORY:
Electronics: RTINGS.com, GSMArena, Notebookcheck, Tom's Guide, Which?, Stiftung Warentest, Wirecutter, PCMag
Insurance Norway: EPSI Norway, Bytt.no, Forsikringtest.no, Finans Norge, Finansportalen.no
Banking Norway: EPSI Norway, Renteradar.no, Finansportalen.no, Bytt.no, Kortio.no
Banking Global: J.D. Power, Canstar, Which?, Stiftung Warentest, EPSI Nordic
Energy Norway: EPSI Norway, Bytt.no, NVE, Forbrukerrådet
Cars/EV: Motor.no, NAF, What Car, ADAC, Autocar, InsideEVs, Electrek, Bjørn Nyland
Home appliances: Which?, Stiftung Warentest, RTINGS.com, Wirecutter, Consumer Reports
Travel insurance: Which?, Forbes, NerdWallet, Money.com
Sports/Outdoor: OutdoorGearLab, REI, BikeRadar, DC Rainmaker, Gear Junkie
Baby: Which?, BabyGearLab, ADAC (car seats)
Health: Which?, Wirecutter, DC Rainmaker, Examine.com
Pets: DogFoodAdvisor, Canstar, Bytt.no
Business software: G2.com, Capterra, PCMag

Search for: "${query.trim()} test review 2025 2026 independent best"
Also search: "${query.trim()} ${country} recommendation expert"

Return ONLY valid JSON:
{
  "sources_found": [
    {
      "name": "source name",
      "url": "real url",
      "country": "country code",
      "date": "date",
      "key_finding": "what they found"
    }
  ],
  "top_products": ["product 1", "product 2", "product 3"],
  "consensus": "what most sources agree on",
  "latest_data": "any specific numbers, scores, or rankings found"
}`,
        messages: [
          {
            role: "user",
            content: `Find latest independent test results for: "${query.trim()}" in ${country}. Focus on 2025-2026 data.`,
          },
        ],
      }),
    });

    let searchResults: unknown = {
      sources_found: [],
      top_products: [],
      consensus: "",
      latest_data: "",
    };

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const searchText = searchData.content
        ?.filter((item: { type?: string }) => item.type === "text")
        ?.map((item: { text?: string }) => item.text ?? "")
        ?.join("\n") ?? "";
      const cleanedSearchText = searchText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        searchResults = JSON.parse(cleanedSearchText);
      } catch {
        searchResults = {
          sources_found: [],
          top_products: [],
          consensus: cleanedSearchText.substring(0, 500),
          latest_data: "",
        };
      }
    }

    // STEP 2: Generate recommendation using search results + knowledge base
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
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Query: "${query.trim()}"
Country: ${country}

Fresh test data found from web search:
${JSON.stringify(searchResults, null, 2)}

Instructions:
1. Use the fresh search data above as primary source when available
2. Combine with your built-in knowledge base for this category
3. Prioritize fresh 2025-2026 data over older training data
4. Use actual source URLs from the search results in the sources array
5. Give ONE clear recommendation in the exact JSON format specified
6. Be specific about which customer segment this recommendation suits
7. Today's date is 2026-04-26`,
          },
        ],
      }),
    });

    if (!recommendationResponse.ok) {
      const errorText = await recommendationResponse.text();
      return new Response(
        JSON.stringify({ error: "Recommendation API call failed", details: errorText }),
        { status: recommendationResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await recommendationResponse.json();
    const text = data.content?.[0]?.type === "text" ? data.content[0].text : "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse JSON response from AI");
      }
    }

    // Add timestamp if missing
    if (!result.updated_at) {
      result.updated_at = new Date().toISOString();
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
