export interface ScoreCriterion {
  criteria: string;
  score: number;
  weight: string;
}

export interface VerifiedSource {
  name: string;
  flag: string;
  country: string;
  date: string;
  stars: number;
  description: string;
  url: string;
}

export interface SearchResultSet {
  query: string;
  country: string;
  category: string;
  year: string;
  sourceCount: number;
  bestChoice: {
    name: string;
    score: number;
    recommendation: string;
    strengths: string[];
    weaknesses: string[];
    price: string;
    ctaUrl: string;
  };
  alternative: {
    name: string;
    score: number;
    reason: string;
    scenario: string;
    price: string;
    ctaUrl: string;
  };
  avoid: {
    name: string;
    reason: string;
  };
  scores: ScoreCriterion[];
  sources: VerifiedSource[];
  related: string[];
}

const scoreTable = (performance: number, value: number, quality: number, ux: number, longevity: number): ScoreCriterion[] => [
  { criteria: "Performance", score: performance, weight: "30%" },
  { criteria: "Value for Money", score: value, weight: "25%" },
  { criteria: "Quality", score: quality, weight: "20%" },
  { criteria: "User Experience", score: ux, weight: "15%" },
  { criteria: "Longevity", score: longevity, weight: "10%" },
];

export const mockSearchResults: SearchResultSet[] = [
  {
    query: "Best EV insurance Norway 2026",
    country: "NO",
    category: "Insurance",
    year: "2026",
    sourceCount: 47,
    bestChoice: {
      name: "Tryg EV Super",
      score: 9.1,
      recommendation: "Tryg is the strongest EV insurance choice in Norway for 2026 because it combines excellent battery coverage, predictable claim handling, and broad roadside assistance. It ranks highest where EV owners actually feel risk: battery damage, charging incidents, rental replacement, and winter-related incidents.",
      strengths: ["Best EV-specific battery and charging coverage", "Fast claim handling across Norway", "Strong winter roadside assistance"],
      weaknesses: ["Premiums rise for luxury EVs", "Not always cheapest for low-mileage drivers"],
      price: "€58–€114 / month",
      ctaUrl: "#",
    },
    alternative: {
      name: "IF Super EV",
      score: 8.3,
      reason: "IF is a strong alternative with excellent claims support and competitive multi-policy discounts.",
      scenario: "Choose this if you already bundle home, contents, or travel insurance with IF.",
      price: "€61–€119 / month",
      ctaUrl: "#",
    },
    avoid: {
      name: "Generic low-cost EV policies",
      reason: "Avoid policies that treat EVs like standard petrol cars and exclude battery, charger, or software-related damage.",
    },
    scores: scoreTable(9.2, 8.8, 9.0, 8.5, 8.9),
    sources: [
      { name: "Finansportalen Insurance Index", flag: "🇳🇴", country: "Norway", date: "Jan 2026", stars: 5, description: "Compared national EV insurance premiums, deductible levels, and coverage exclusions.", url: "#" },
      { name: "Norsk Elbilforening Coverage Review", flag: "🇳🇴", country: "Norway", date: "Dec 2025", stars: 5, description: "Tested EV-specific battery, charging, and winter breakdown coverage quality.", url: "#" },
      { name: "Consumer Claims Survey Nordic", flag: "🇳🇴", country: "Norway", date: "Nov 2025", stars: 4, description: "Surveyed claim speed, repair satisfaction, and replacement car availability.", url: "#" },
    ],
    related: ["Best car insurance Norway", "Best EV charging Norway", "Best home insurance Norway"],
  },
  {
    query: "Best smartphone under €800",
    country: "DE",
    category: "Electronics & Tech",
    year: "2026",
    sourceCount: 63,
    bestChoice: {
      name: "Samsung Galaxy S25",
      score: 9.1,
      recommendation: "The Galaxy S25 is the best smartphone under €800 because it delivers flagship performance, a brighter display, longer software support, and stronger camera consistency than rivals in this price band. It is the safest all-round recommendation for most buyers.",
      strengths: ["Excellent display and daily performance", "Long Android update window", "Reliable camera in mixed lighting"],
      weaknesses: ["Charging speed is not class-leading", "Base storage can feel tight for video-heavy users"],
      price: "€699–€799",
      ctaUrl: "#",
    },
    alternative: {
      name: "Google Pixel 9",
      score: 8.3,
      reason: "Pixel 9 is the better pick for clean Android, computational photography, and call-screening features.",
      scenario: "Choose this if camera intelligence and Google-first software matter more than raw performance.",
      price: "€649–€749",
      ctaUrl: "#",
    },
    avoid: { name: "Unverified marketplace imports", reason: "Avoid grey-market imports without regional warranty, correct 5G bands, or guaranteed security updates." },
    scores: scoreTable(9.2, 8.8, 9.0, 8.5, 8.9),
    sources: [
      { name: "Stiftung Warentest Smartphone Lab", flag: "🇩🇪", country: "Germany", date: "Feb 2026", stars: 5, description: "Measured display quality, battery life, durability, software support, and cameras.", url: "#" },
      { name: "DXOMARK Camera Bench", flag: "🇫🇷", country: "France", date: "Jan 2026", stars: 4, description: "Benchmarked photo and video performance across light and motion scenarios.", url: "#" },
      { name: "Notebookcheck Mobile Review", flag: "🇩🇪", country: "Germany", date: "Jan 2026", stars: 5, description: "Tested chipset throttling, display brightness, PWM, thermals, and battery runtime.", url: "#" },
    ],
    related: ["Best smartphone camera", "Best Android phone", "Best laptop under €1000"],
  },
  {
    query: "Best personal bank Norway",
    country: "NO",
    category: "Banking & Finance",
    year: "2026",
    sourceCount: 38,
    bestChoice: {
      name: "Bulder Bank",
      score: 9.1,
      recommendation: "Bulder Bank is the best personal bank in Norway for digital-first customers because it combines competitive mortgage pricing, a clean app experience, and transparent day-to-day banking. It is especially strong for customers who want fewer fees and less branch friction.",
      strengths: ["Excellent mobile banking experience", "Transparent mortgage and savings pricing", "Low-friction onboarding"],
      weaknesses: ["Limited physical branch support", "Specialist products are narrower than legacy banks"],
      price: "€0–€7 / month",
      ctaUrl: "#",
    },
    alternative: {
      name: "Landkreditt Bank",
      score: 8.3,
      reason: "Landkreditt is a strong alternative for customers who value personal service and stable savings terms.",
      scenario: "Choose this if you prefer conservative banking with competitive deposit products.",
      price: "€0–€9 / month",
      ctaUrl: "#",
    },
    avoid: { name: "Fee-heavy legacy packages", reason: "Avoid bundled accounts with monthly fees, card fees, and weak savings rates unless you use every included benefit." },
    scores: scoreTable(9.2, 8.8, 9.0, 8.5, 8.9),
    sources: [
      { name: "Finansportalen Banking Comparison", flag: "🇳🇴", country: "Norway", date: "Feb 2026", stars: 5, description: "Compared fees, mortgage rates, savings rates, and card conditions.", url: "#" },
      { name: "EPSI Norway Bank Satisfaction", flag: "🇳🇴", country: "Norway", date: "Oct 2025", stars: 4, description: "Surveyed customer satisfaction, digital experience, and trust indicators.", url: "#" },
      { name: "RankFinal App Usability Panel", flag: "🇳🇴", country: "Norway", date: "Jan 2026", stars: 4, description: "Tested onboarding, transfer flows, card controls, and savings account setup.", url: "#" },
    ],
    related: ["Best savings account Norway", "Best mortgage Norway", "Best credit card Norway"],
  },
  {
    query: "Best travel insurance Europe budget",
    country: "EU",
    category: "Travel",
    year: "2026",
    sourceCount: 41,
    bestChoice: {
      name: "IMG Patriot Lite Europe",
      score: 9.1,
      recommendation: "IMG Patriot Lite Europe is the best budget travel insurance choice for Europe because it offers strong medical coverage, clear plan limits, and competitive short-trip pricing. It is best for travelers who want essential protection without luxury add-ons.",
      strengths: ["Strong medical coverage for the price", "Clear deductible options", "Good fit for multi-country Europe trips"],
      weaknesses: ["Baggage coverage is modest", "Adventure sports require add-ons"],
      price: "€18–€46 / trip",
      ctaUrl: "#",
    },
    alternative: {
      name: "World Nomads Standard",
      score: 8.3,
      reason: "World Nomads is better for flexible travel plans and broader activity coverage.",
      scenario: "Choose this if your trip includes hiking, longer stays, or route changes.",
      price: "€34–€78 / trip",
      ctaUrl: "#",
    },
    avoid: { name: "Credit-card-only coverage", reason: "Avoid relying on card insurance without checking medical limits, trip duration caps, and pre-existing condition exclusions." },
    scores: scoreTable(9.2, 8.8, 9.0, 8.5, 8.9),
    sources: [
      { name: "Which? Travel Insurance Survey", flag: "🇬🇧", country: "UK", date: "Jan 2026", stars: 4, description: "Compared cancellation, medical, baggage, excess, and claims handling.", url: "#" },
      { name: "EU Consumer Travel Claims Review", flag: "🇪🇺", country: "EU", date: "Dec 2025", stars: 4, description: "Reviewed exclusions, claims friction, and emergency assistance performance.", url: "#" },
      { name: "RankFinal Budget Policy Audit", flag: "🇩🇰", country: "Denmark", date: "Feb 2026", stars: 5, description: "Audited policy documents for coverage gaps and hidden add-on dependencies.", url: "#" },
    ],
    related: ["Best travel insurance family", "Best luggage Europe", "Best VPN services"],
  },
  {
    query: "Best electricity provider UK",
    country: "GB",
    category: "Energy & Utilities",
    year: "2026",
    sourceCount: 52,
    bestChoice: {
      name: "Octopus Energy",
      score: 9.1,
      recommendation: "Octopus Energy is the best electricity provider in the UK because it combines competitive smart tariffs, outstanding customer service, and strong renewable-energy transparency. It is the clearest recommendation for households that want price control without poor support.",
      strengths: ["Excellent smart tariff options", "Top-rated customer support", "Transparent renewable sourcing"],
      weaknesses: ["Smart tariffs require active usage management", "Some rural meter setups can be slower to switch"],
      price: "€82–€164 / month equivalent",
      ctaUrl: "#",
    },
    alternative: {
      name: "Bulb Legacy Tariff",
      score: 8.3,
      reason: "Bulb remains a recognizable alternative where legacy tariff conditions are still favorable.",
      scenario: "Choose this if your current tariff beats newer smart offers after standing charges.",
      price: "€88–€170 / month equivalent",
      ctaUrl: "#",
    },
    avoid: { name: "Opaque fixed-rate offers", reason: "Avoid tariffs that advertise low unit rates while hiding high standing charges or restrictive exit terms." },
    scores: scoreTable(9.2, 8.8, 9.0, 8.5, 8.9),
    sources: [
      { name: "Ofgem Supplier Data", flag: "🇬🇧", country: "UK", date: "Feb 2026", stars: 5, description: "Reviewed supplier complaints, switching data, and tariff transparency indicators.", url: "#" },
      { name: "Which? Energy Satisfaction", flag: "🇬🇧", country: "UK", date: "Jan 2026", stars: 5, description: "Surveyed service quality, billing clarity, support, and value perception.", url: "#" },
      { name: "Citizens Advice Supplier Ratings", flag: "🇬🇧", country: "UK", date: "Jan 2026", stars: 4, description: "Benchmarked customer service, contact wait times, billing, and complaint outcomes.", url: "#" },
    ],
    related: ["Cheapest electricity UK", "Best heat pump UK", "Best solar panels UK"],
  },
];

export const suggestedQueries = mockSearchResults.map((item) => item.query);
