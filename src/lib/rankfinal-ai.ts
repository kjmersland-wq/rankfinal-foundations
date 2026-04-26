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

export async function getRankFinalRecommendation(
  query: string,
  country: string = "Global"
): Promise<RankFinalResult> {
  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rankfinal-ai`;
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, country }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Edge function error:", errorText);
    throw new Error("API call failed: " + errorText);
  }

  const data = await response.json();
  return data as RankFinalResult;
}
