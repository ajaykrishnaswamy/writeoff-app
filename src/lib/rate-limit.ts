import { NextRequest } from 'next/server';

// Configuration types
export interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
  keyGenerator?: (req: NextRequest) => string;
  onRateLimit?: (req: NextRequest, rateLimitInfo: RateLimitInfo) => void;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Token bucket implementation
class TokenBucket {
  private capacity: number;
  private tokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  consume(tokens: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  getTokens(): number {
    this.refill();
    return this.tokens;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed * this.refillRate);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  getTimeToNextToken(): number {
    if (this.tokens > 0) return 0;
    return Math.ceil(1000 / this.refillRate);
  }
}

// Memory storage for rate limit data
class MemoryStore {
  private store: Map<string, TokenBucket> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async get(key: string): Promise<TokenBucket> {
    let bucket = this.store.get(key);
    
    if (!bucket) {
      const refillRate = this.config.requests / this.config.window;
      bucket = new TokenBucket(this.config.requests, refillRate);
      this.store.set(key, bucket);
    }
    
    return bucket;
  }

  async cleanup(): Promise<void> {
    // Simple cleanup - remove buckets that are full (likely unused)
    for (const [key, bucket] of this.store.entries()) {
      if (bucket.getTokens() >= this.config.requests) {
        this.store.delete(key);
      }
    }
  }
}

// Default key generator
function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             req.headers.get('x-real-ip') || 
             req.ip || 
             'unknown';
  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // Create a simple hash of IP + User Agent for uniqueness
  const key = `${ip}:${userAgent}`;
  return Buffer.from(key).toString('base64').slice(0, 32);
}

// Rate limiter class
export class RateLimiter {
  private store: MemoryStore;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: defaultKeyGenerator,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };
    
    this.store = new MemoryStore(this.config);
    
    // Set up periodic cleanup
    setInterval(() => {
      this.store.cleanup();
    }, this.config.window);
  }

  async limit(req: NextRequest): Promise<RateLimitResult> {
    try {
      const key = this.config.keyGenerator!(req);
      const bucket = await this.store.get(key);
      
      const canConsume = bucket.consume(1);
      const remaining = bucket.getTokens();
      const reset = Date.now() + this.config.window;
      
      const result: RateLimitResult = {
        success: canConsume,
        limit: this.config.requests,
        remaining: Math.max(0, remaining),
        reset
      };
      
      if (!canConsume) {
        const retryAfter = bucket.getTimeToNextToken();
        result.retryAfter = retryAfter;
        
        if (this.config.onRateLimit) {
          const rateLimitInfo: RateLimitInfo = {
            limit: this.config.requests,
            remaining: result.remaining,
            reset,
            retryAfter
          };
          this.config.onRateLimit(req, rateLimitInfo);
        }
      }
      
      return result;
    } catch (error) {
      // On error, allow the request to proceed
      console.error('Rate limiting error:', error);
      return {
        success: true,
        limit: this.config.requests,
        remaining: this.config.requests,
        reset: Date.now() + this.config.window
      };
    }
  }

  async check(req: NextRequest): Promise<RateLimitInfo> {
    const key = this.config.keyGenerator!(req);
    const bucket = await this.store.get(key);
    
    return {
      limit: this.config.requests,
      remaining: bucket.getTokens(),
      reset: Date.now() + this.config.window,
      retryAfter: bucket.getTimeToNextToken()
    };
  }
}

// Utility function to create rate limiter middleware
export function createRateLimiter(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);
  
  return async function rateLimitMiddleware(req: NextRequest) {
    const result = await limiter.limit(req);
    
    const headers = new Headers({
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString()
    });
    
    if (!result.success && result.retryAfter) {
      headers.set('Retry-After', Math.ceil(result.retryAfter / 1000).toString());
    }
    
    return {
      success: result.success,
      headers,
      retryAfter: result.retryAfter
    };
  };
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Strict rate limiting for auth endpoints
  auth: createRateLimiter({
    requests: 5,
    window: 15 * 60 * 1000, // 15 minutes
  }),
  
  // API rate limiting
  api: createRateLimiter({
    requests: 100,
    window: 60 * 1000, // 1 minute
  }),
  
  // General rate limiting
  general: createRateLimiter({
    requests: 1000,
    window: 60 * 1000, // 1 minute
  }),
  
  // Strict rate limiting for sensitive operations
  sensitive: createRateLimiter({
    requests: 3,
    window: 60 * 1000, // 1 minute
  }),
};

// Helper function to handle rate limit responses
export function handleRateLimit(result: { success: boolean; headers: Headers; retryAfter?: number }) {
  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: result.retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(result.headers.entries())
        }
      }
    );
  }
  
  return null;
}

// Example usage in API routes:
/*
import { rateLimiters, handleRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimiters.api(req);
  const rateLimitResponse = handleRateLimit(rateLimitResult);
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Continue with normal request handling
  return new Response(JSON.stringify({ success: true }), {
    headers: rateLimitResult.headers
  });
}
*/