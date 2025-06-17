// Search Service with Rate Limiting and Caching
// Prevents API rate limit errors and improves performance

import { cacheService } from './CacheService';

interface SearchOptions {
  type: 'drugs' | 'pharmacies';
  query: string;
  limit?: number;
  filters?: any;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfter: number;
}

interface SearchResult {
  id: string;
  name: string;
  [key: string]: any;
}

export class SearchService {
  private static instance: SearchService;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private rateLimitConfig: RateLimitConfig = {
    maxRequests: 10, // 10 requests per window
    windowMs: 60000, // 1 minute window
    retryAfter: 5000 // 5 seconds retry delay
  };

  private constructor() {}

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Check if request is within rate limit
   */
  private isWithinRateLimit(clientId: string): boolean {
    const now = Date.now();
    const clientData = this.requestCounts.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize counter
      this.requestCounts.set(clientId, {
        count: 1,
        resetTime: now + this.rateLimitConfig.windowMs
      });
      return true;
    }

    if (clientData.count >= this.rateLimitConfig.maxRequests) {
      return false;
    }

    // Increment counter
    clientData.count++;
    return true;
  }

  /**
   * Get cache key for search
   */
  private getCacheKey(options: SearchOptions): string {
    const { type, query, limit = 20, filters = {} } = options;
    const filterString = JSON.stringify(filters);
    return `search:${type}:${query}:${limit}:${filterString}`;
  }

  /**
   * Search with rate limiting and caching
   */
  public async search(options: SearchOptions, clientId: string = 'default'): Promise<{
    success: boolean;
    data: SearchResult[];
    error?: string;
    cached?: boolean;
    rateLimited?: boolean;
  }> {
    try {
      // Check rate limit
      if (!this.isWithinRateLimit(clientId)) {
        console.warn(`Rate limit exceeded for client: ${clientId}`);
        return {
          success: false,
          data: [],
          error: 'Rate limit exceeded. Please try again later.',
          rateLimited: true
        };
      }

      // Check cache first
      const cacheKey = this.getCacheKey(options);
      const cachedResult = await cacheService.get(cacheKey);
      
      if (cachedResult) {
        console.log('Returning cached search results');
        return {
          success: true,
          data: cachedResult,
          cached: true
        };
      }

      // Perform search
      const results = await this.performSearch(options);

      // Cache results for 5 minutes
      await cacheService.set(cacheKey, results, { ttl: 300 });

      return {
        success: true,
        data: results
      };

    } catch (error) {
      console.error('Search service error:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Search failed'
      };
    }
  }

  /**
   * Perform actual search (mock implementation)
   */
  private async performSearch(options: SearchOptions): Promise<SearchResult[]> {
    const { type, query, limit = 20 } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    if (type === 'drugs') {
      return this.searchDrugs(query, limit);
    } else {
      return this.searchPharmacies(query, limit);
    }
  }

  /**
   * Search drugs (mock implementation)
   */
  private searchDrugs(query: string, limit: number): SearchResult[] {
    const mockDrugs = [
      { id: 'paracetamol-500mg', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief', price: 6495, availability: 'High', pharmacies: 32 },
      { id: 'amoxicillin-250mg', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotics', price: 12750, availability: 'Medium', pharmacies: 18 },
      { id: 'lisinopril-10mg', name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Blood Pressure', price: 19375, availability: 'Low', pharmacies: 9 },
      { id: 'metformin-500mg', name: 'Metformin 500mg', genericName: 'Metformin HCl', category: 'Diabetes', price: 11150, availability: 'High', pharmacies: 26 },
      { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin Calcium', category: 'Cholesterol', price: 22600, availability: 'Medium', pharmacies: 14 },
      { id: 'ibuprofen-400mg', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Pain Relief', price: 8500, availability: 'High', pharmacies: 28 },
      { id: 'omeprazole-20mg', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Acid Reflux', price: 15300, availability: 'Medium', pharmacies: 22 },
      { id: 'amlodipine-5mg', name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', category: 'Blood Pressure', price: 17850, availability: 'High', pharmacies: 20 }
    ];

    let results = mockDrugs;

    // Filter by query if provided
    if (query.trim()) {
      results = mockDrugs.filter(drug =>
        drug.name.toLowerCase().includes(query.toLowerCase()) ||
        drug.category.toLowerCase().includes(query.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(query.toLowerCase())
      );
    }

    return results.slice(0, limit);
  }

  /**
   * Search pharmacies (mock implementation)
   */
  private searchPharmacies(query: string, limit: number): SearchResult[] {
    const mockPharmacies = [
      {
        id: '1',
        name: 'PHARMACIE FRANCAISE',
        address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
        phone: '+237 2 22 22 14 76',
        rating: 4.7,
        isOpenNow: true,
        hasDelivery: true,
        distance: '0.5 km',
        medicationCount: 50
      },
      {
        id: '2',
        name: 'PHARMACIE DU SOLEIL',
        address: '642 AV Ahmadou Ahidjo, BP 67, Yaoundé',
        phone: '+237 2 22 22 14 23',
        rating: 4.5,
        isOpenNow: true,
        hasDelivery: true,
        distance: '0.8 km',
        medicationCount: 45
      },
      {
        id: '3',
        name: 'PHARMACIE MINDILI',
        address: 'Carrefour Obili, BP 11168, Yaoundé',
        phone: '+237 22 31 51 83',
        rating: 4.3,
        isOpenNow: true,
        hasDelivery: true,
        distance: '1.2 km',
        medicationCount: 38
      },
      {
        id: '4',
        name: 'PHARMACIE ST MARTIN',
        address: 'Centre Ville, BP 12404, Yaoundé',
        phone: '+237 22 23 18 69',
        rating: 4.4,
        isOpenNow: true,
        hasDelivery: true,
        distance: '0.7 km',
        medicationCount: 42
      },
      {
        id: '5',
        name: 'PHARMACIE MOLIVA',
        address: 'Madagascar, BP 19, Yaoundé',
        phone: '+237 22 23 00 82',
        rating: 4.2,
        isOpenNow: false,
        hasDelivery: true,
        distance: '1.5 km',
        medicationCount: 35
      }
    ];

    let results = mockPharmacies;

    // Filter by query if provided
    if (query.trim()) {
      results = mockPharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(query.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    return results.slice(0, limit);
  }

  /**
   * Get search suggestions
   */
  public async getSuggestions(query: string, type: 'drugs' | 'pharmacies'): Promise<string[]> {
    if (query.length < 2) return [];

    const cacheKey = `suggestions:${type}:${query}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    let suggestions: string[] = [];

    if (type === 'drugs') {
      const drugSuggestions = [
        'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Lisinopril',
        'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Aspirin', 'Ciprofloxacin'
      ];
      suggestions = drugSuggestions.filter(drug =>
        drug.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      const pharmacySuggestions = [
        'PHARMACIE FRANCAISE', 'PHARMACIE DU SOLEIL', 'PHARMACIE MINDILI',
        'PHARMACIE ST MARTIN', 'PHARMACIE MOLIVA'
      ];
      suggestions = pharmacySuggestions.filter(pharmacy =>
        pharmacy.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Cache suggestions for 10 minutes
    await cacheService.set(cacheKey, suggestions, { ttl: 600 });

    return suggestions.slice(0, 5);
  }

  /**
   * Clear search cache
   */
  public async clearCache(): Promise<void> {
    // In a real implementation, you would clear search-related cache keys
    console.log('Search cache cleared');
  }

  /**
   * Get rate limit status for client
   */
  public getRateLimitStatus(clientId: string): {
    remaining: number;
    resetTime: number;
    isLimited: boolean;
  } {
    const clientData = this.requestCounts.get(clientId);
    const now = Date.now();

    if (!clientData || now > clientData.resetTime) {
      return {
        remaining: this.rateLimitConfig.maxRequests,
        resetTime: now + this.rateLimitConfig.windowMs,
        isLimited: false
      };
    }

    const remaining = Math.max(0, this.rateLimitConfig.maxRequests - clientData.count);
    return {
      remaining,
      resetTime: clientData.resetTime,
      isLimited: remaining === 0
    };
  }

  /**
   * Reset rate limit for client (admin function)
   */
  public resetRateLimit(clientId: string): void {
    this.requestCounts.delete(clientId);
    console.log(`Rate limit reset for client: ${clientId}`);
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();
