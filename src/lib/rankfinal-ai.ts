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
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rankfinal-ai`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ query, country }),
    }
  );

  if (!response.ok) {
    throw new Error("API call failed");
  }

  return response.json() as Promise<RankFinalResult>;
}
