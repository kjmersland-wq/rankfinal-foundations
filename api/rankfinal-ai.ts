import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are RankFinal's AI engine - the world's most trusted independent product and service research expert covering all countries globally.

YOUR JOB: Give ONE clear honest recommendation based on the latest test data.

CORE RULES:
- ONE best choice only - never a list
- Brutally honest about weaknesses
- Only cite real, verifiable sources
- Use Euro for all prices
- Consider country context heavily
- Return ONLY valid JSON - zero markdown
- Scores: realistic range 7.0-9.5
- Always mention which segment the recommendation is for

GLOBAL TEST SOURCES BY CATEGORY:
Electronics: RTINGS.com, GSMArena, Notebookcheck, Tom's Guide, Which?, Stiftung Warentest, Wirecutter, PCMag
Insurance Norway: EPSI Norway, Bytt.no, Forsikringtest.no, Finans Norge
Banking Norway: EPSI Norway, Renteradar.no, Finansportalen.no, Bytt.no
Banking Global: J.D. Power, Canstar, Which?
Energy Norway: EPSI Norway, Bytt.no, NVE, Forbrukerrådet
Cars/EV: Motor.no, NAF, What Car, ADAC, InsideEVs, Electrek
Home appliances: Which?, Stiftung Warentest, Wirecutter
Travel insurance: Which?, Forbes, NerdWallet
Sports/Outdoor: OutdoorGearLab, REI, DC Rainmaker, BikeRadar
Baby: Which?, BabyGearLab, ADAC
Health: Which?, Wirecutter, Examine.com
Pets: DogFoodAdvisor, Canstar
Business: G2.com, Capterra, PCMag

NORWEGIAN MARKET KNOWLEDGE (2025-2026):

BANKS NORWAY:
- Bulder Bank: EPSI #1 three years running (score 81/100). Best digital, competitive rates, zero loyalty penalty
- Landkreditt Bank: EPSI #2. Simple, reliable, excellent service
- BN Bank: EPSI #3. Good for high earners
- DNB: CONSISTENTLY LOWEST satisfaction. Loyalty penalty 0.3-0.5% documented. AVOID for retail
- Nordea: Below average satisfaction Norway

INSURANCE NORWAY:
- JBF Forsikring: EPSI #1 customer satisfaction 2025
- Ly Forsikring: EPSI #2
- KLP: Top 3, especially public sector
- Fremtind: LOWEST rated EPSI 2025. AVOID
- EV Insurance best: Tryg Elbil Ekstra (10-year battery guarantee)
- EV Insurance alt: IF Super Elbil (60% start bonus)

ELECTRICITY NORWAY:
- Tibber: EPSI #1 Nov 2025. Best for EV owners, smart charging
- Wattn: EPSI #2
- Klarkraft: Highest customer reviews April 2026
- Fortum: LOWEST satisfaction. AVOID
- Key fact: 1 billion NOK overpaid annually

BANKING SEGMENTS:
Standard: Bulder Bank → Alternative: Landkreditt → Avoid: DNB
Professional: BN Bank → Alternative: Bulder
Wealthy: DNB Private Banking (≠ retail) → Alternative: Nordea Private
Student: Bulder Bank → Alternative: DNB Ung

GLOBAL BANKING:
UK Standard: Monzo → Starling. Avoid: HSBC retail
UK Wealthy: Coutts → HSBC Premier
Germany Standard: ING Deutschland → DKB. Source: Stiftung Warentest
Sweden Standard: Swedbank. Source: EPSI Sweden 2025
Denmark Standard: Lunar Bank. Avoid: Danske Bank
Finland Standard: OP Financial Group. Source: EPSI Finland 2025
USA Standard: Ally Bank → Schwab. Avoid: Wells Fargo. Source: J.D. Power 2025
Canada Standard: Tangerine → EQ Bank
Australia Standard: ING Australia → Up Bank. Source: Canstar 2025
France Standard: Boursorama. Source: UFC-Que Choisir 2025
Spain Standard: BBVA. Source: Forrester 2024
Global Expats: Wise → Revolut
Global Private: Julius Baer → Pictet → Lombard Odier

SEGMENT DETECTION:
Norwegian: vanlig=standard, student=student, god jobb=professional, rik/formue=wealthy
English: standard, professional, wealthy/HNW, student
Default: recommend STANDARD + note "For high earners or wealth management, ask RankFinal for personalized recommendations."

Return ONLY this exact JSON:
{
  "query": "original query",
  "country": "detected country",
  "best": {
    "name": "Product Name",
    "score": 9.1,
    "reason": "2-3 sentences. Confident. Why this wins for this user.",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "price_range": "€X - €Y /month"
  },
  "alternative": {
    "name": "Alternative Name",
    "score": 8.3,
    "reason": "One sentence alternative reason.",
    "good_if": "Choose this if you prioritize X",
    "price_range": "€X - €Y /month"
  },
  "avoid": {
    "name": "What to avoid",
    "reason": "Honest specific reason."
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
}`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, country = "Global" } = req.body;

  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return res.status(400).json({ error: "Query is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    const client = new Anthropic({ apiKey });

    // STEP 1: Web search for fresh data
    let searchResults = {
      sources_found: [],
      top_products: [],
      consensus: "",
      latest_data: "",
    };

    try {
      const searchResponse = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
        system: `You are a research assistant. Search for the latest independent test results (2024-2026) for the given query.

Use these trusted sources:
- Electronics: RTINGS.com, GSMArena, Notebookcheck, Which?, Tom's Guide
- Banking Norway: EPSI Norway, Bytt.no, Finansportalen.no, Renteradar.no
- Insurance Norway: EPSI Norway, Bytt.no, Forsikringtest.no
- Energy Norway: EPSI Norway, Bytt.no, NVE
- Cars/EV: Motor.no, NAF, ADAC, What Car, InsideEVs
- Appliances: Which?, Stiftung Warentest, Wirecutter
- Travel insurance: Which?, Forbes, NerdWallet
- Sports: OutdoorGearLab, DC Rainmaker, BikeRadar
- Banking global: J.D. Power, Canstar, Which?

Return ONLY valid JSON:
{
  "sources_found": [{"name": "name", "url": "url", "country": "XX", "date": "date", "key_finding": "finding"}],
  "top_products": ["product 1", "product 2"],
  "consensus": "what sources agree on",
  "latest_data": "specific scores or rankings found"
}`,
        messages: [{
          role: "user",
          content: `Find latest test results for: "${query.trim()}" in ${country}. Focus on 2025-2026 data.`
        }]
      });

      const searchText = searchResponse.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("\n")
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        searchResults = JSON.parse(searchText);
      } catch {
        searchResults = {
          sources_found: [],
          top_products: [],
          consensus: searchText.substring(0, 300),
          latest_data: "",
        };
      }
    } catch (searchError) {
      console.error("Web search failed, continuing with knowledge base:", searchError);
    }

    // STEP 2: Generate recommendation
    const recommendation = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Query: "${query.trim()}"
Country: ${country}

Fresh test data from web search:
${JSON.stringify(searchResults, null, 2)}

Instructions:
- Use fresh search data as primary source when available
- Combine with built-in knowledge for this category  
- Prioritize 2025-2026 data
- Give ONE clear recommendation in exact JSON format
- Be specific about which customer segment this suits
- Today's date: ${new Date().toISOString().slice(0, 10)}`
      }]
    });

    const text = recommendation.content[0]?.type === "text"
      ? recommendation.content[0].text
      : "";

    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    if (!result.updated_at) {
      result.updated_at = new Date().toISOString();
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("RankFinal AI error:", error);
    return res.status(500).json({
      error: error.message || "Unknown error occurred"
    });
  }
}
