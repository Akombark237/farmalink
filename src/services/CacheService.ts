// Redis Caching Service for Session Management and Performance Optimization
// Implements distributed caching with Redis for scalable session management

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean; // Compress large values
  serialize?: boolean; // Serialize objects
}

interface SessionData {
  userId: string;
  email: string;
  userType: string;
  loginTime: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
  preferences?: any;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

export class CacheService {
  private static instance: CacheService;
  private redis: any = null;
  private memoryCache: Map<string, { value: any; expires: number }> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, sets: 0, deletes: 0, hitRate: 0 };
  private isRedisAvailable = false;

  private constructor() {
    this.initializeRedis();
    this.startCleanupInterval();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis(): Promise<void> {
    try {
      // Temporarily disable Redis to avoid connection spam
      // Only import Redis in Node.js environment when Redis is available
      if (typeof window === 'undefined' && process.env.REDIS_ENABLED === 'true') {
        const Redis = await import('ioredis').then(m => m.default);

        this.redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          db: parseInt(process.env.REDIS_DB || '0'),
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          keepAlive: 30000,
          connectTimeout: 5000,
          commandTimeout: 3000
        });

        this.redis.on('connect', () => {
          console.log('✅ Redis connected successfully');
          this.isRedisAvailable = true;
        });

        this.redis.on('error', (error: Error) => {
          console.warn('⚠️ Redis connection error, falling back to memory cache');
          this.isRedisAvailable = false;
        });

        this.redis.on('close', () => {
          this.isRedisAvailable = false;
        });

        // Test connection with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        );

        await Promise.race([this.redis.ping(), timeoutPromise]);
      } else {
        // Use memory cache only
        this.isRedisAvailable = false;
      }
    } catch (error) {
      this.isRedisAvailable = false;
    }
  }

  /**
   * Set cache value
   */
  public async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      const { ttl = 3600, compress = false, serialize = true } = options;
      let processedValue = value;

      // Serialize if needed
      if (serialize && typeof value === 'object') {
        processedValue = JSON.stringify(value);
      }

      // Compress if needed (simple compression for demo)
      if (compress && typeof processedValue === 'string' && processedValue.length > 1000) {
        // In production, use actual compression library like zlib
        processedValue = `compressed:${processedValue}`;
      }

      if (this.isRedisAvailable && this.redis) {
        // Use Redis
        if (ttl > 0) {
          await this.redis.setex(key, ttl, processedValue);
        } else {
          await this.redis.set(key, processedValue);
        }
      } else {
        // Use memory cache
        const expires = ttl > 0 ? Date.now() + (ttl * 1000) : 0;
        this.memoryCache.set(key, { value: processedValue, expires });
      }

      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get cache value
   */
  public async get(key: string, options: CacheOptions = {}): Promise<any> {
    try {
      const { serialize = true } = options;
      let value: any = null;

      if (this.isRedisAvailable && this.redis) {
        // Use Redis
        value = await this.redis.get(key);
      } else {
        // Use memory cache
        const cached = this.memoryCache.get(key);
        if (cached) {
          if (cached.expires === 0 || cached.expires > Date.now()) {
            value = cached.value;
          } else {
            this.memoryCache.delete(key);
            value = null;
          }
        }
      }

      if (value === null) {
        this.stats.misses++;
        return null;
      }

      // Decompress if needed
      if (typeof value === 'string' && value.startsWith('compressed:')) {
        value = value.substring(11); // Remove 'compressed:' prefix
      }

      // Deserialize if needed
      if (serialize && typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // If parsing fails, return as string
        }
      }

      this.stats.hits++;
      this.updateHitRate();
      return value;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Delete cache value
   */
  public async delete(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(key);
      } else {
        this.memoryCache.delete(key);
      }

      this.stats.deletes++;
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  public async exists(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        return (await this.redis.exists(key)) === 1;
      } else {
        const cached = this.memoryCache.get(key);
        return cached !== undefined && (cached.expires === 0 || cached.expires > Date.now());
      }
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Set cache with expiration time
   */
  public async setex(key: string, seconds: number, value: any): Promise<boolean> {
    return this.set(key, value, { ttl: seconds });
  }

  /**
   * Increment numeric value
   */
  public async incr(key: string): Promise<number> {
    try {
      if (this.isRedisAvailable && this.redis) {
        return await this.redis.incr(key);
      } else {
        const current = await this.get(key) || 0;
        const newValue = parseInt(current) + 1;
        await this.set(key, newValue);
        return newValue;
      }
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  /**
   * Get multiple keys
   */
  public async mget(keys: string[]): Promise<any[]> {
    try {
      if (this.isRedisAvailable && this.redis) {
        return await this.redis.mget(keys);
      } else {
        return Promise.all(keys.map(key => this.get(key)));
      }
    } catch (error) {
      console.error('Cache mget error:', error);
      return [];
    }
  }

  /**
   * Set multiple key-value pairs
   */
  public async mset(keyValues: Record<string, any>): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const args: string[] = [];
        Object.entries(keyValues).forEach(([key, value]) => {
          args.push(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });
        await this.redis.mset(...args);
      } else {
        await Promise.all(
          Object.entries(keyValues).map(([key, value]) => this.set(key, value))
        );
      }
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  public async clear(): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.flushdb();
      } else {
        this.memoryCache.clear();
      }
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Start cleanup interval for memory cache
   */
  private startCleanupInterval(): void {
    if (typeof window !== 'undefined') return; // Only run on server

    setInterval(() => {
      if (!this.isRedisAvailable) {
        const now = Date.now();
        for (const [key, cached] of this.memoryCache.entries()) {
          if (cached.expires > 0 && cached.expires < now) {
            this.memoryCache.delete(key);
          }
        }
      }
    }, 60000); // Cleanup every minute
  }

  /**
   * Get Redis info (if available)
   */
  public async getRedisInfo(): Promise<any> {
    if (this.isRedisAvailable && this.redis) {
      try {
        return await this.redis.info();
      } catch (error) {
        console.error('Redis info error:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Close Redis connection
   */
  public async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

/**
 * Session Management with Redis
 */
export class SessionManager {
  private cache: CacheService;
  private sessionTTL = 24 * 60 * 60; // 24 hours

  constructor() {
    this.cache = CacheService.getInstance();
  }

  /**
   * Create new session
   */
  public async createSession(sessionId: string, sessionData: SessionData): Promise<boolean> {
    const key = `session:${sessionId}`;
    return this.cache.set(key, sessionData, { ttl: this.sessionTTL });
  }

  /**
   * Get session data
   */
  public async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    return this.cache.get(key);
  }

  /**
   * Update session activity
   */
  public async updateSessionActivity(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.lastActivity = Date.now();
      return this.createSession(sessionId, session);
    }
    return false;
  }

  /**
   * Delete session
   */
  public async deleteSession(sessionId: string): Promise<boolean> {
    const key = `session:${sessionId}`;
    return this.cache.delete(key);
  }

  /**
   * Get user sessions
   */
  public async getUserSessions(userId: string): Promise<SessionData[]> {
    // In production, use Redis SCAN to find all user sessions
    // For now, return empty array as this requires more complex Redis operations
    return [];
  }

  /**
   * Delete all user sessions
   */
  public async deleteUserSessions(userId: string): Promise<boolean> {
    // In production, find and delete all user sessions
    return true;
  }
}

// Export singleton instances
export const cacheService = CacheService.getInstance();
export const sessionManager = new SessionManager();
