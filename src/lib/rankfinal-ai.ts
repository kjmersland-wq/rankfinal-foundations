import Anthropic from "@anthropic-ai/sdk";

export interface RankFinalResult {
  query: string;
  country: string;
  best: {
    name: string;
    score: number;
    reason: string;
    strengths: string[];
    weaknesses: string[];
    price_range: string;
  };
  alternative: {
    name: string;
    score: number;
    reason: string;
    good_if: string;
    price_range: string;
  };
  avoid: {
    name: string;
    reason: string;
  };
  score_breakdown: {
    criteria: string;
    score: number;
    weight: number;
  }[];
  sources: {
    name: string;
    country: string;
    date: string;
    credibility: number;
    url: string;
    description: string;
  }[];
  updated_at: string;
}

const client = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getRankFinalRecommendation(
  query: string,
  country: string = "Global"
): Promise<RankFinalResult> {
  
  const systemPrompt = `You are RankFinal's AI engine.
You are a world-class independent product and service 
research expert covering all countries globally.

YOUR JOB: Analyze the query and give ONE clear, 
honest recommendation.

STRICT RULES:
- Give exactly ONE best choice - never a list
- Be brutally honest about weaknesses
- Only cite sources that actually exist and are verifiable
- Use Euro (€) for all prices
- Consider country context for local recommendations
- Return ONLY valid JSON - zero markdown, zero explanation
- Scores must be realistic (7.0-9.5 range typically)
- Price ranges must be realistic for the category

CATEGORIES YOU COVER:
Electronics, Vehicles, EV Insurance, Car Insurance, 
Home Insurance, Travel Insurance, Life Insurance,
Banking, Savings, Mortgages, Credit Cards,
Electricity Providers, Energy, Solar,
Sports & Outdoor, Hunting, Skiing,
Home Appliances, Baby products, Health,
Pets, Business Software, Travel - and more.

For financial/insurance products: consider the 
user's country heavily as these are local markets.

Return this exact JSON:
{
  "query": "user query here",
  "country": "Norway",
  "best": {
    "name": "Exact Product/Service Name",
    "score": 9.1,
    "reason": "2-3 sentences. Confident, direct. Why this wins.",
    "strengths": [
      "Specific strength 1",
      "Specific strength 2", 
      "Specific strength 3"
    ],
    "weaknesses": [
      "Honest weakness 1",
      "Honest weakness 2"
    ],
    "price_range": "€X - €Y /month"
  },
  "alternative": {
    "name": "Alternative Name",
    "score": 8.4,
    "reason": "Why this is a solid alternative in one sentence.",
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
      "name": "EPSI Norway 2025",
      "country": "NO",
      "date": "2025-11",
      "credibility": 5,
      "url": "https://www.epsi-norway.org",
      "description": "Annual customer satisfaction study covering Norwegian market"
    },
    {
      "name": "Source 2 name",
      "country": "XX",
      "date": "2025-10",
      "credibility": 4,
      "url": "https://real-url.com",
      "description": "What they tested"
    },
    {
      "name": "Source 3 name", 
      "country": "XX",
      "date": "2025-09",
      "credibility": 4,
      "url": "https://real-url.com",
      "description": "What they tested"
    }
  ],
  "updated_at": "2026-04-26T10:00:00Z"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Query: "${query}"\nCountry: ${country}\n\nAnalyze and recommend.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" 
      ? response.content[0].text 
      : "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    
  return JSON.parse(cleaned) as RankFinalResult;
}
