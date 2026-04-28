import DOMPurify from 'dompurify';

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

function sanitizeInput(input: string): string {
  // Strip all HTML tags and trim whitespace
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
}

export async function getRankFinalRecommendation(
  query: string,
  country: string = "Global"
): Promise<RankFinalResult> {
  // Sanitize inputs
  const sanitizedQuery = sanitizeInput(query);
  const sanitizedCountry = sanitizeInput(country);
  
  // Validate query length
  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    throw new Error("Query must be at least 2 characters");
  }
  
  if (sanitizedQuery.length > 200) {
    throw new Error("Query too long (maximum 200 characters)");
  }
  
  const response = await fetch("/api/rankfinal-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      query: sanitizedQuery, 
      country: sanitizedCountry 
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("RankFinal API error:", errorText);
    throw new Error("API call failed: " + errorText);
  }

  const data = await response.json();
  return data as RankFinalResult;
}
