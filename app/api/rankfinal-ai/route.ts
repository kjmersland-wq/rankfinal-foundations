import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '../../../lib/rate-limit';

// IMPORTANT: This file runs server-side only
// API keys are never exposed to the client
import 'server-only';

// Rate limiting configuration
const RATE_LIMIT_MAX = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

// Timeout for AI API calls (30 seconds)
const AI_TIMEOUT_MS = 30000;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// Input validation
function validateInput(query: unknown, country: unknown): { valid: boolean; error?: string } {
  if (typeof query !== 'string' || query.length < 2 || query.length > 200) {
    return { valid: false, error: 'Query must be between 2 and 200 characters' };
  }
  
  if (typeof country !== 'string' || country.length < 2 || country.length > 50) {
    return { valid: false, error: 'Country must be between 2 and 50 characters' };
  }
  
  return { valid: true };
}

// Exponential backoff retry logic
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  backoff = INITIAL_BACKOFF_MS
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Only retry on network errors or 5xx errors
    const isRetryable = 
      error instanceof Error && 
      (error.message.includes('network') || 
       error.message.includes('timeout') ||
       error.message.includes('ECONNRESET'));
    
    if (!isRetryable) throw error;
    
    await new Promise(resolve => setTimeout(resolve, backoff));
    return withRetry(fn, retries - 1, backoff * 2);
  }
}

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

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

Return ONLY valid JSON with this structure:
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
  "sources": [
    {"name": "Source Name", "url": "https://...", "year": 2025}
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    
    const rateCheck = checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const { query, country } = body;
    
    const validation = validateInput(query, country);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Check for API key (server-side only, never exposed to client)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
    
    // Initialize Anthropic client (server-side only)
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    
    // Make AI request with timeout and retry logic
    const aiRequest = async () => {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Find the best ${query.trim()} for ${country.trim()}. Return valid JSON only.`,
          },
        ],
      });
      
      return response;
    };
    
    const response = await withRetry(() => withTimeout(aiRequest(), AI_TIMEOUT_MS));
    
    // Extract text from response
    const textContent = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    // Parse JSON response
    let result;
    try {
      result = JSON.parse(textContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', textContent);
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }
    
    // Return successful response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error('RankFinal AI API error:', error);
    
    // Check for timeout
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request took too long. Please try again.' },
        { status: 504 }
      );
    }
    
    // Generic error response (don't leak implementation details)
    return NextResponse.json(
      { error: 'An error occurred processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
