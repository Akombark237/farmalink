// Advanced Rate Limiter with sliding window and memory-efficient storage
// Prevents API abuse and DDoS attacks

interface RateLimiterOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

interface RequestRecord {
  count: number;
  resetTime: number;
  requests: number[]; // Timestamps for sliding window
}

export class RateLimiter {
  private store: Map<string, RequestRecord> = new Map();
  private options: Required<RateLimiterOptions>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: RateLimiterOptions) {
    this.options = {
      windowMs: options.windowMs,
      maxRequests: options.maxRequests,
      message: options.message || 'Too many requests',
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false
    };

    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  public isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.getOrCreateRecord(identifier, now);

    // Remove old requests outside the window
    record.requests = record.requests.filter(
      timestamp => now - timestamp < this.options.windowMs
    );

    // Check if limit exceeded
    if (record.requests.length >= this.options.maxRequests) {
      return false;
    }

    // Add current request
    record.requests.push(now);
    record.count = record.requests.length;
    record.resetTime = now + this.options.windowMs;

    this.store.set(identifier, record);
    return true;
  }

  public getRemainingRequests(identifier: string): number {
    const record = this.store.get(identifier);
    if (!record) {
      return this.options.maxRequests;
    }

    const now = Date.now();
    const validRequests = record.requests.filter(
      timestamp => now - timestamp < this.options.windowMs
    );

    return Math.max(0, this.options.maxRequests - validRequests.length);
  }

  public getRetryAfter(identifier: string): number {
    const record = this.store.get(identifier);
    if (!record || record.requests.length === 0) {
      return 0;
    }

    const now = Date.now();
    const oldestRequest = Math.min(...record.requests);
    const retryAfter = Math.max(0, this.options.windowMs - (now - oldestRequest));
    
    return Math.ceil(retryAfter / 1000); // Return in seconds
  }

  public reset(identifier: string): void {
    this.store.delete(identifier);
  }

  public resetAll(): void {
    this.store.clear();
  }

  public getStats(): {
    totalClients: number;
    totalRequests: number;
    blockedClients: number;
  } {
    let totalRequests = 0;
    let blockedClients = 0;

    for (const record of this.store.values()) {
      totalRequests += record.count;
      if (record.requests.length >= this.options.maxRequests) {
        blockedClients++;
      }
    }

    return {
      totalClients: this.store.size,
      totalRequests,
      blockedClients
    };
  }

  private getOrCreateRecord(identifier: string, now: number): RequestRecord {
    let record = this.store.get(identifier);
    
    if (!record) {
      record = {
        count: 0,
        resetTime: now + this.options.windowMs,
        requests: []
      };
    }

    return record;
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, record] of this.store.entries()) {
      // Remove records that haven't been accessed recently
      if (record.resetTime < now - this.options.windowMs) {
        expiredKeys.push(key);
      } else {
        // Clean up old requests within active records
        record.requests = record.requests.filter(
          timestamp => now - timestamp < this.options.windowMs
        );
        record.count = record.requests.length;
      }
    }

    // Remove expired records
    expiredKeys.forEach(key => this.store.delete(key));

    console.log(`🧹 Rate limiter cleanup: removed ${expiredKeys.length} expired records`);
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Specialized rate limiters for different use cases
export class AuthRateLimiter extends RateLimiter {
  constructor() {
    super({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per window
      message: 'Too many authentication attempts. Please try again later.'
    });
  }

  public recordFailedAttempt(identifier: string): boolean {
    return !this.isAllowed(`failed_${identifier}`);
  }

  public recordSuccessfulLogin(identifier: string): void {
    // Reset failed attempts on successful login
    this.reset(`failed_${identifier}`);
  }
}

export class APIRateLimiter extends RateLimiter {
  constructor() {
    super({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
      message: 'API rate limit exceeded. Please slow down your requests.'
    });
  }
}

export class StrictRateLimiter extends RateLimiter {
  constructor() {
    super({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute
      message: 'Rate limit exceeded for sensitive operation.'
    });
  }
}

// Global rate limiter instances
export const globalRateLimiters = {
  auth: new AuthRateLimiter(),
  api: new APIRateLimiter(),
  strict: new StrictRateLimiter()
};

// Rate limiter middleware helper
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (identifier: string) => {
    const allowed = limiter.isAllowed(identifier);
    const remaining = limiter.getRemainingRequests(identifier);
    const retryAfter = limiter.getRetryAfter(identifier);

    return {
      allowed,
      remaining,
      retryAfter,
      headers: {
        'X-RateLimit-Limit': limiter['options'].maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': (Date.now() + limiter['options'].windowMs).toString(),
        ...(retryAfter > 0 && { 'Retry-After': retryAfter.toString() })
      }
    };
  };
}
