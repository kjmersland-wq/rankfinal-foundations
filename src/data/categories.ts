export type UpdateFrequency = "daily" | "weekly" | "monthly";

export interface RankFinalCategory {
  id: string;
  icon: string;
  name: string;
  subcategories: string[];
  frequency: UpdateFrequency;
  description: string;
  sourceCount: number;
}

export const categories: RankFinalCategory[] = [
  {
    id: "electronics-tech",
    icon: "📱",
    name: "Electronics & Tech",
    frequency: "weekly",
    description: "Verified product rankings across consumer electronics, devices, audio, gaming, and connected-home technology.",
    sourceCount: 1842,
    subcategories: ["Smartphones", "Laptops", "Tablets", "TVs", "Headphones & Audio", "Cameras", "Smart Home", "Wearables", "Gaming Consoles", "PC Components", "Printers", "Smart Speakers", "Monitors", "Routers & Networking", "E-readers"],
  },
  {
    id: "vehicles-mobility",
    icon: "🚗",
    name: "Vehicles & Mobility",
    frequency: "weekly",
    description: "Independent comparisons for cars, mobility products, vehicle equipment, and EV ownership decisions.",
    sourceCount: 936,
    subcategories: ["Electric Cars", "Petrol & Diesel Cars", "Hybrid Cars", "Motorcycles", "E-bikes & Bicycles", "Car Tires", "Car Accessories", "Dashcams", "EV Charging", "Car Audio"],
  },
  {
    id: "energy-utilities",
    icon: "🔋",
    name: "Energy & Utilities",
    frequency: "daily",
    description: "Frequently refreshed provider and equipment rankings for volatile energy, heating, and utility markets.",
    sourceCount: 724,
    subcategories: ["Electricity Providers", "Solar Panel Systems", "Heat Pumps", "Home Battery Storage", "Smart Energy Meters", "Gas Providers"],
  },
  {
    id: "banking-finance",
    icon: "🏦",
    name: "Banking & Finance",
    frequency: "daily",
    description: "Daily-reviewed banking, lending, investment, pension, and crypto comparisons with transparent source trails.",
    sourceCount: 1288,
    subcategories: ["Personal Banking", "Premium Banking", "Student Banking", "Business Banking", "Savings Accounts", "Mortgage & Home Loans", "Credit Cards", "Investment Platforms", "Pension & Retirement", "Crypto Exchanges"],
  },
  {
    id: "insurance",
    icon: "🛡️",
    name: "Insurance",
    frequency: "daily",
    description: "Independent insurance rankings covering price, coverage quality, exclusions, claims experience, and regional availability.",
    sourceCount: 1544,
    subcategories: ["Car Insurance Standard", "Car Insurance Mid-range", "Car Insurance Luxury", "EV Insurance", "Home Insurance", "Contents Insurance", "Travel Insurance", "Life Insurance", "Health Insurance", "Pet Insurance", "Boat & Marine Insurance"],
  },
  {
    id: "home-garden",
    icon: "🏠",
    name: "Home & Garden",
    frequency: "weekly",
    description: "Practical rankings for appliances, cleaning, security, tools, garden equipment, and home upgrades.",
    sourceCount: 1119,
    subcategories: ["Washing Machines", "Tumble Dryers", "Refrigerators", "Dishwashers", "Ovens & Hobs", "Coffee Machines", "Robot Vacuums", "Vacuum Cleaners", "Air Purifiers", "Dehumidifiers", "Power Tools", "Lawn Mowers", "Smart Locks", "Home Security Systems"],
  },
  {
    id: "sports-outdoor",
    icon: "🎿",
    name: "Sports & Outdoor",
    frequency: "monthly",
    description: "Seasonal and expert-tested outdoor, hunting, cycling, skiing, camping, fishing, and golf rankings.",
    sourceCount: 683,
    subcategories: ["Hunting Rifles & Firearms", "Hunting Optics", "Hunting Clothing", "Skiing Equipment", "Snowboards", "Running Shoes", "Road Bikes", "Mountain Bikes", "Tents & Camping", "Hiking Boots", "Fishing Equipment", "Golf Equipment"],
  },
  {
    id: "baby-family",
    icon: "👶",
    name: "Baby & Family",
    frequency: "monthly",
    description: "Safety-first comparisons for family essentials, baby transport, monitoring, sleep, and nutrition products.",
    sourceCount: 416,
    subcategories: ["Strollers", "Car Seats", "Baby Monitors", "Baby Carriers", "Cots & Cribs", "Baby Nutrition"],
  },
  {
    id: "health-wellness",
    icon: "❤️",
    name: "Health & Wellness",
    frequency: "weekly",
    description: "Evidence-led wellness and health-device rankings built from verified tests, standards, and clinical-source checks.",
    sourceCount: 572,
    subcategories: ["Blood Pressure Monitors", "Fitness Trackers", "Protein Supplements", "Vitamins", "CPAP Machines", "Hearing Aids", "Massage Guns", "Ergonomic Chairs"],
  },
  {
    id: "travel",
    icon: "🌍",
    name: "Travel",
    frequency: "weekly",
    description: "Travel protection, luggage, accessories, and privacy-tool rankings for regional and international trips.",
    sourceCount: 398,
    subcategories: ["Travel Insurance Budget", "Travel Insurance Family", "Travel Insurance Luxury", "Luggage & Bags", "Travel Accessories", "VPN Services"],
  },
  {
    id: "pets",
    icon: "🐾",
    name: "Pets",
    frequency: "monthly",
    description: "Pet food, insurance, and tracking comparisons focused on safety, price, coverage, and owner outcomes.",
    sourceCount: 244,
    subcategories: ["Dog Food", "Cat Food", "Pet Insurance", "GPS Pet Trackers"],
  },
  {
    id: "business",
    icon: "💼",
    name: "Business",
    frequency: "daily",
    description: "Fast-moving business service rankings for software, connectivity, insurance, storage, CRM, and team operations.",
    sourceCount: 637,
    subcategories: ["Business Internet", "Cloud Storage", "Business Insurance", "Accounting Software", "Project Management Tools", "CRM Software"],
  },
];

export const countries = ["Norway", "UK", "Germany", "France", "Sweden", "Denmark", "Finland", "Netherlands", "Spain", "Italy", "USA", "Canada", "Australia", "Japan", "Ireland", "Belgium", "Austria", "Switzerland", "Portugal", "New Zealand"];

export function getFrequencyLabel(frequency: UpdateFrequency) {
  if (frequency === "daily") return "⚡ Daily";
  if (frequency === "weekly") return "🔄 Weekly";
  return "📅 Monthly";
}
