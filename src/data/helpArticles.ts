export interface HelpCategory {
  icon: string;
  title: string;
  count: number;
}

export interface HelpArticle {
  slug: string;
  category: string;
  title: string;
  lastUpdated: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  related: Array<{ title: string; slug: string }>;
}

export const helpCategories: HelpCategory[] = [
  { icon: "🔍", title: "Getting Started", count: 5 },
  { icon: "🧠", title: "How RankFinal Works", count: 6 },
  { icon: "📊", title: "Understanding Scores & Sources", count: 4 },
  { icon: "💳", title: "Plans & Billing", count: 6 },
  { icon: "🔔", title: "Alerts & Saved Results", count: 3 },
  { icon: "🔧", title: "Technical Issues", count: 4 },
  { icon: "🤝", title: "Business & API", count: 4 },
  { icon: "📬", title: "Contact Support", count: 1 },
];

export const featuredArticles = [
  { title: "How does RankFinal score products and services?", slug: "how-scoring-works" },
  { title: "Why do we only give one recommendation?", slug: "why-one-recommendation" },
  { title: "How often are results updated?", slug: "sources-and-verification" },
  { title: "What sources do we use and how are they verified?", slug: "sources-and-verification" },
  { title: "How to use country filtering", slug: "how-scoring-works" },
  { title: "How to export or print a result", slug: "how-scoring-works" },
  { title: "Understanding the scoring breakdown table", slug: "how-scoring-works" },
];

export const helpArticles: HelpArticle[] = [
  {
    slug: "how-scoring-works",
    category: "Understanding Scores & Sources",
    title: "How does RankFinal score products and services?",
    lastUpdated: "April 2026",
    sections: [
      {
        heading: "The 1–10 scoring scale",
        paragraphs: [
          "RankFinal converts verified source evidence into a simple 1–10 score so different products and services can be compared quickly. A score above 9 means the option performs exceptionally well across the most important criteria for that category. Scores between 8 and 9 are strong alternatives with one or two meaningful trade-offs.",
          "We avoid inflated perfect scores. A 10/10 is reserved for cases where an option has outstanding evidence, no material weaknesses, and clear superiority across regions and buyer scenarios.",
        ],
      },
      {
        heading: "Weighted criteria",
        paragraphs: [
          "Each category uses weighted criteria. A smartphone result might prioritize performance, camera quality, software support, battery life, and value. Insurance results weigh coverage quality, exclusions, price stability, claim handling, and customer outcomes.",
          "The weights are shown in the scoring breakdown table. This makes it clear why one result wins: not because it is best at one thing, but because it performs best against the criteria that matter most for the decision.",
        ],
      },
      {
        heading: "How the final score is calculated",
        paragraphs: [
          "Every criterion receives its own 1–10 score based on verified sources. RankFinal then applies the published weighting and calculates the final score. If a product has missing evidence, hidden terms, weak source coverage, or major exclusions, its score is reduced even if the marketing claims look strong.",
          "The final recommendation combines the numeric result with practical context: price range, country availability, strengths, weaknesses, and situations where an alternative might be better.",
        ],
      },
    ],
    related: [
      { title: "Why do we only give one recommendation?", slug: "why-one-recommendation" },
      { title: "What sources do we use and how are they verified?", slug: "sources-and-verification" },
      { title: "Understanding the scoring breakdown table", slug: "how-scoring-works" },
    ],
  },
  {
    slug: "why-one-recommendation",
    category: "How RankFinal Works",
    title: "Why do we only give one recommendation?",
    lastUpdated: "April 2026",
    sections: [
      {
        heading: "RankFinal is built to reduce decision fatigue",
        paragraphs: [
          "Most comparison sites give you a long list, dozens of filters, and more tabs to open. RankFinal is designed for the opposite outcome: one clear answer when the evidence supports it. The goal is to help you decide, not to make you research forever.",
          "We still show alternatives and what to avoid, but the main result is intentionally decisive. If a user asks for the best option for a country, budget, and category, the answer should be direct.",
        ],
      },
      {
        heading: "Why not show ten winners?",
        paragraphs: [
          "A ranked list can be useful, but it often hides trade-offs. The number one option may be best overall, while number two may only be better for a narrow scenario. RankFinal separates these roles: Best Choice, Best Alternative, and What to Avoid.",
          "This format keeps the recommendation useful while preserving transparency. You can see why the winner was chosen, when the alternative makes sense, and which option should be treated with caution.",
        ],
      },
      {
        heading: "When RankFinal will not force an answer",
        paragraphs: [
          "If there is not enough verified source coverage, RankFinal will show an empty or request state instead of pretending to know. We would rather say that a category has not been analyzed yet than publish a weak recommendation.",
          "For categories with strong regional differences, the country filter becomes part of the recommendation. The best provider in Norway may not be the best provider in Germany or the UK.",
        ],
      },
    ],
    related: [
      { title: "How does RankFinal score products and services?", slug: "how-scoring-works" },
      { title: "What sources do we use and how are they verified?", slug: "sources-and-verification" },
      { title: "How often are results updated?", slug: "sources-and-verification" },
    ],
  },
  {
    slug: "sources-and-verification",
    category: "Understanding Scores & Sources",
    title: "What sources do we use and how are they verified?",
    lastUpdated: "April 2026",
    sections: [
      {
        heading: "Source selection criteria",
        paragraphs: [
          "RankFinal prioritizes independent testing labs, public regulators, consumer organizations, technical reviewers, policy documents, customer outcome surveys, and transparent price databases. Sources must provide enough detail to support scoring, not just broad opinions or promotional rankings.",
          "A source is stronger when it explains its methodology, publishes recent data, tests comparable products under similar conditions, and separates editorial judgement from advertising relationships.",
        ],
      },
      {
        heading: "Independence requirements",
        paragraphs: [
          "RankFinal receives no payment from reviewed brands. We do not sell ranking placement, sponsored winners, or recommendation boosts. If a source has commercial relationships, that context is considered before it influences a score.",
          "When available, official regulatory data and independent consumer bodies are weighted more heavily than affiliate review pages or sources with unclear incentives.",
        ],
      },
      {
        heading: "Update frequency",
        paragraphs: [
          "Fast-moving categories update more frequently. Financial, insurance, and energy results are reviewed daily because prices, policies, and tariffs can change quickly. Electronics and vehicles are typically reviewed weekly as new tests and firmware updates appear.",
          "Outdoor, sports, baby, and pet categories usually update monthly unless a major safety notice, recall, or new test batch changes the evidence. Every result includes a last analyzed timestamp so you know how fresh it is.",
        ],
      },
    ],
    related: [
      { title: "How does RankFinal score products and services?", slug: "how-scoring-works" },
      { title: "Why do we only give one recommendation?", slug: "why-one-recommendation" },
      { title: "How often are results updated?", slug: "sources-and-verification" },
    ],
  },
];
