// Database Optimization Service
// Query optimization, indexing, connection pooling, and performance monitoring

import { cacheService } from './CacheService';

interface QueryOptions {
  cache?: boolean;
  cacheTTL?: number;
  timeout?: number;
  retries?: number;
}

interface QueryMetrics {
  query: string;
  executionTime: number;
  rowsAffected: number;
  cached: boolean;
  timestamp: Date;
}

interface IndexSuggestion {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  reason: string;
  estimatedImprovement: string;
}

export class DatabaseOptimizer {
  private static instance: DatabaseOptimizer;
  private queryMetrics: QueryMetrics[] = [];
  private slowQueryThreshold = 1000; // 1 second
  private connectionPool: any = null;

  private constructor() {
    this.initializeConnectionPool();
  }

  public static getInstance(): DatabaseOptimizer {
    if (!DatabaseOptimizer.instance) {
      DatabaseOptimizer.instance = new DatabaseOptimizer();
    }
    return DatabaseOptimizer.instance;
  }

  /**
   * Initialize database connection pool
   */
  private initializeConnectionPool(): void {
    // Mock connection pool configuration
    this.connectionPool = {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      idle: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE_TIMEOUT || '60000'),
      evict: parseInt(process.env.DB_POOL_EVICT_TIMEOUT || '1000')
    };

    console.log('🔗 Database connection pool initialized:', this.connectionPool);
  }

  /**
   * Execute optimized query with caching
   */
  public async executeQuery(
    query: string, 
    params: any[] = [], 
    options: QueryOptions = {}
  ): Promise<any> {
    const startTime = performance.now();
    const { cache = false, cacheTTL = 300, timeout = 30000, retries = 3 } = options;

    // Generate cache key
    const cacheKey = cache ? this.generateCacheKey(query, params) : null;

    // Try cache first
    if (cacheKey) {
      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult) {
        this.recordMetrics(query, performance.now() - startTime, 0, true);
        return cachedResult;
      }
    }

    // Execute query with retries
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.executeWithTimeout(query, params, timeout);
        const executionTime = performance.now() - startTime;

        // Cache result if enabled
        if (cacheKey && result) {
          await cacheService.set(cacheKey, result, { ttl: cacheTTL });
        }

        // Record metrics
        this.recordMetrics(query, executionTime, result?.rowCount || 0, false);

        // Log slow queries
        if (executionTime > this.slowQueryThreshold) {
          console.warn(`🐌 Slow query detected (${executionTime.toFixed(2)}ms):`, {
            query: query.substring(0, 100) + '...',
            params: params.length,
            executionTime
          });
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Query attempt ${attempt} failed:`, error.message);
        
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 100); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  /**
   * Execute query with timeout
   */
  private async executeWithTimeout(query: string, params: any[], timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Query timeout after ${timeout}ms`));
      }, timeout);

      // Mock query execution - in production, use actual database client
      this.mockQueryExecution(query, params)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Mock query execution (replace with actual database client)
   */
  private async mockQueryExecution(query: string, params: any[]): Promise<any> {
    // Simulate query execution time
    const executionTime = Math.random() * 500 + 50; // 50-550ms
    await this.delay(executionTime);

    // Mock result based on query type
    if (query.toLowerCase().includes('select')) {
      return {
        rows: this.generateMockRows(query),
        rowCount: Math.floor(Math.random() * 100) + 1
      };
    } else if (query.toLowerCase().includes('insert')) {
      return {
        rowCount: 1,
        insertId: Math.floor(Math.random() * 10000) + 1
      };
    } else if (query.toLowerCase().includes('update') || query.toLowerCase().includes('delete')) {
      return {
        rowCount: Math.floor(Math.random() * 10) + 1
      };
    }

    return { rowCount: 0 };
  }

  /**
   * Generate mock rows for SELECT queries
   */
  private generateMockRows(query: string): any[] {
    const rowCount = Math.floor(Math.random() * 20) + 1;
    const rows = [];

    for (let i = 0; i < rowCount; i++) {
      if (query.includes('users')) {
        rows.push({
          id: i + 1,
          email: `user${i + 1}@example.com`,
          name: `User ${i + 1}`,
          created_at: new Date()
        });
      } else if (query.includes('orders')) {
        rows.push({
          id: i + 1,
          user_id: Math.floor(Math.random() * 100) + 1,
          total: Math.random() * 1000 + 10,
          status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
          created_at: new Date()
        });
      } else {
        rows.push({
          id: i + 1,
          data: `Sample data ${i + 1}`,
          created_at: new Date()
        });
      }
    }

    return rows;
  }

  /**
   * Generate cache key for query
   */
  private generateCacheKey(query: string, params: any[]): string {
    const normalizedQuery = query.replace(/\s+/g, ' ').trim().toLowerCase();
    const paramsHash = JSON.stringify(params);
    return `query:${Buffer.from(normalizedQuery + paramsHash).toString('base64')}`;
  }

  /**
   * Record query metrics
   */
  private recordMetrics(query: string, executionTime: number, rowsAffected: number, cached: boolean): void {
    const metric: QueryMetrics = {
      query: query.substring(0, 200), // Truncate long queries
      executionTime,
      rowsAffected,
      cached,
      timestamp: new Date()
    };

    this.queryMetrics.push(metric);

    // Keep only last 1000 metrics
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000);
    }
  }

  /**
   * Get query performance metrics
   */
  public getQueryMetrics(): {
    totalQueries: number;
    averageExecutionTime: number;
    slowQueries: number;
    cacheHitRate: number;
    recentQueries: QueryMetrics[];
  } {
    const total = this.queryMetrics.length;
    const cached = this.queryMetrics.filter(m => m.cached).length;
    const slow = this.queryMetrics.filter(m => m.executionTime > this.slowQueryThreshold).length;
    const avgTime = total > 0 
      ? this.queryMetrics.reduce((sum, m) => sum + m.executionTime, 0) / total 
      : 0;

    return {
      totalQueries: total,
      averageExecutionTime: avgTime,
      slowQueries: slow,
      cacheHitRate: total > 0 ? (cached / total) * 100 : 0,
      recentQueries: this.queryMetrics.slice(-10)
    };
  }

  /**
   * Analyze queries and suggest optimizations
   */
  public analyzeQueries(): {
    suggestions: string[];
    indexSuggestions: IndexSuggestion[];
    performanceIssues: string[];
  } {
    const metrics = this.getQueryMetrics();
    const suggestions: string[] = [];
    const indexSuggestions: IndexSuggestion[] = [];
    const performanceIssues: string[] = [];

    // Analyze cache hit rate
    if (metrics.cacheHitRate < 50) {
      suggestions.push('Consider enabling caching for frequently executed queries');
    }

    // Analyze slow queries
    if (metrics.slowQueries > metrics.totalQueries * 0.1) {
      performanceIssues.push(`${metrics.slowQueries} slow queries detected (>${this.slowQueryThreshold}ms)`);
      suggestions.push('Review and optimize slow queries');
    }

    // Analyze query patterns
    const queryPatterns = this.analyzeQueryPatterns();
    
    // Suggest indexes based on common WHERE clauses
    if (queryPatterns.commonWhereColumns.length > 0) {
      queryPatterns.commonWhereColumns.forEach(({ table, column, frequency }) => {
        if (frequency > 5) {
          indexSuggestions.push({
            table,
            columns: [column],
            type: 'btree',
            reason: `Column '${column}' used in WHERE clause ${frequency} times`,
            estimatedImprovement: '20-50% query speed improvement'
          });
        }
      });
    }

    // Suggest composite indexes for JOIN operations
    if (queryPatterns.commonJoins.length > 0) {
      queryPatterns.commonJoins.forEach(({ tables, columns, frequency }) => {
        if (frequency > 3) {
          indexSuggestions.push({
            table: tables[0],
            columns,
            type: 'btree',
            reason: `JOIN operation used ${frequency} times`,
            estimatedImprovement: '30-70% JOIN performance improvement'
          });
        }
      });
    }

    return { suggestions, indexSuggestions, performanceIssues };
  }

  /**
   * Analyze query patterns
   */
  private analyzeQueryPatterns(): {
    commonWhereColumns: Array<{ table: string; column: string; frequency: number }>;
    commonJoins: Array<{ tables: string[]; columns: string[]; frequency: number }>;
  } {
    const whereColumns: Map<string, number> = new Map();
    const joins: Map<string, number> = new Map();

    this.queryMetrics.forEach(metric => {
      const query = metric.query.toLowerCase();

      // Extract WHERE clauses
      const whereMatches = query.match(/where\s+(\w+)\.(\w+)/g);
      if (whereMatches) {
        whereMatches.forEach(match => {
          const key = match.replace('where ', '');
          whereColumns.set(key, (whereColumns.get(key) || 0) + 1);
        });
      }

      // Extract JOIN operations
      const joinMatches = query.match(/join\s+(\w+)\s+on\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/g);
      if (joinMatches) {
        joinMatches.forEach(match => {
          joins.set(match, (joins.get(match) || 0) + 1);
        });
      }
    });

    return {
      commonWhereColumns: Array.from(whereColumns.entries()).map(([key, frequency]) => {
        const [table, column] = key.split('.');
        return { table, column, frequency };
      }),
      commonJoins: Array.from(joins.entries()).map(([key, frequency]) => ({
        tables: ['table1', 'table2'], // Simplified for demo
        columns: ['id', 'foreign_id'],
        frequency
      }))
    };
  }

  /**
   * Get optimized query suggestions
   */
  public getOptimizedQuery(originalQuery: string): {
    optimizedQuery: string;
    improvements: string[];
  } {
    let optimizedQuery = originalQuery;
    const improvements: string[] = [];

    // Add LIMIT if missing for SELECT queries
    if (originalQuery.toLowerCase().includes('select') && 
        !originalQuery.toLowerCase().includes('limit')) {
      optimizedQuery += ' LIMIT 100';
      improvements.push('Added LIMIT clause to prevent large result sets');
    }

    // Suggest using indexes
    if (originalQuery.toLowerCase().includes('where')) {
      improvements.push('Ensure indexes exist on WHERE clause columns');
    }

    // Suggest avoiding SELECT *
    if (originalQuery.includes('SELECT *')) {
      improvements.push('Consider selecting only needed columns instead of SELECT *');
    }

    return { optimizedQuery, improvements };
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get connection pool status
   */
  public getConnectionPoolStatus(): any {
    return {
      ...this.connectionPool,
      activeConnections: Math.floor(Math.random() * this.connectionPool.max),
      idleConnections: Math.floor(Math.random() * this.connectionPool.max),
      waitingRequests: Math.floor(Math.random() * 5)
    };
  }
}

// Export singleton instance
export const databaseOptimizer = DatabaseOptimizer.getInstance();
