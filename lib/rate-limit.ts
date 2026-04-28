// Simple in-memory rate limiting
// In production, use Redis or a distributed cache

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${identifier}`;
  
  let entry = rateLimitStore.get(key);
  
  // Create new entry or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  // Increment count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  return { allowed: true, remaining: maxRequests - entry.count };
}
