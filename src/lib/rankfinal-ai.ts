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
  apiKey: import.meta.env.ANTHROPIC_API_KEY 
       || import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getRankFinalRecommendation(
  query: string,
  country: string = "Global"
): Promise<RankFinalResult> {
  const systemPrompt = `You are RankFinal's AI decision engine. 
You are an independent product and service research expert.
Your job is to analyze queries and give ONE clear, 
honest recommendation based on real test data.

RULES:
- Always recommend ONE best choice, never a list
- Be honest about weaknesses - do not hide flaws
- Cite real, verifiable sources that actually exist
- Use Euro (€) for all prices
- Consider the user's country context for local options
- Return ONLY valid JSON - no markdown, no explanation

Return this exact JSON structure:
{
  "query": "the user's query",
  "country": "detected country",
  "best": {
    "name": "Product/Service Name",
    "score": 8.9,
    "reason": "2-3 sentence explanation of why this is best",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "price_range": "€X - €Y per month/year"
  },
  "alternative": {
    "name": "Alternative Name",
    "score": 8.2,
    "reason": "Why this is a good alternative",
    "good_if": "Choose this if you need...",
    "price_range": "€X - €Y"
  },
  "avoid": {
    "name": "Product to avoid",
    "reason": "Specific honest reason to avoid this"
  },
  "score_breakdown": [
    {"criteria": "Performance", "score": 9.0, "weight": 30},
    {"criteria": "Value for Money", "score": 8.5, "weight": 25},
    {"criteria": "Quality", "score": 9.0, "weight": 20},
    {"criteria": "User Experience", "score": 8.8, "weight": 15},
    {"criteria": "Longevity", "score": 8.5, "weight": 10}
  ],
  "sources": [
    {
      "name": "Source Name",
      "country": "NO",
      "date": "2025-11",
      "credibility": 5,
      "url": "https://real-source-url.com",
      "description": "What this source tested"
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
        content: `Query: "${query}"\nCountry context: ${country}\n\nGive me the best recommendation.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as RankFinalResult;
}
