// Performance Optimization Utilities
// CDN integration, image optimization, caching, and performance monitoring

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum cache size
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics | null = null;
  private observer: PerformanceObserver | null = null;

  private constructor() {
    this.initializePerformanceMonitoring();
  }

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Web Vitals monitoring
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processPerformanceEntry(entry);
      }
    });

    // Observe different performance entry types
    try {
      this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }
  }

  /**
   * Process performance entries
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.updateMetric('pageLoadTime', navEntry.loadEventEnd - navEntry.navigationStart);
        this.updateMetric('timeToInteractive', navEntry.domInteractive - navEntry.navigationStart);
        break;

      case 'paint':
        const paintEntry = entry as PerformancePaintTiming;
        if (paintEntry.name === 'first-contentful-paint') {
          this.updateMetric('firstContentfulPaint', paintEntry.startTime);
        }
        break;

      case 'largest-contentful-paint':
        const lcpEntry = entry as any;
        this.updateMetric('largestContentfulPaint', lcpEntry.startTime);
        break;

      case 'first-input':
        const fidEntry = entry as any;
        this.updateMetric('firstInputDelay', fidEntry.processingStart - fidEntry.startTime);
        break;

      case 'layout-shift':
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          this.updateMetric('cumulativeLayoutShift', (this.metrics?.cumulativeLayoutShift || 0) + clsEntry.value);
        }
        break;
    }
  }

  /**
   * Update performance metric
   */
  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    if (!this.metrics) {
      this.metrics = {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        timeToInteractive: 0
      };
    }
    this.metrics[metric] = value;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  /**
   * Get performance score (0-100)
   */
  public getPerformanceScore(): number {
    if (!this.metrics) return 0;

    const scores = {
      fcp: this.scoreMetric(this.metrics.firstContentfulPaint, [1800, 3000]), // Good: <1.8s, Poor: >3s
      lcp: this.scoreMetric(this.metrics.largestContentfulPaint, [2500, 4000]), // Good: <2.5s, Poor: >4s
      fid: this.scoreMetric(this.metrics.firstInputDelay, [100, 300]), // Good: <100ms, Poor: >300ms
      cls: this.scoreMetric(this.metrics.cumulativeLayoutShift, [0.1, 0.25], true), // Good: <0.1, Poor: >0.25
      tti: this.scoreMetric(this.metrics.timeToInteractive, [3800, 7300]) // Good: <3.8s, Poor: >7.3s
    };

    return Math.round((scores.fcp + scores.lcp + scores.fid + scores.cls + scores.tti) / 5);
  }

  /**
   * Score individual metric
   */
  private scoreMetric(value: number, thresholds: [number, number], inverse = false): number {
    const [good, poor] = thresholds;
    
    if (inverse) {
      if (value <= good) return 100;
      if (value >= poor) return 0;
      return Math.round(100 - ((value - good) / (poor - good)) * 100);
    } else {
      if (value <= good) return 100;
      if (value >= poor) return 0;
      return Math.round(100 - ((value - good) / (poor - good)) * 100);
    }
  }

  /**
   * Report performance metrics to analytics
   */
  public reportMetrics(): void {
    if (!this.metrics) return;

    // Send to analytics service
    console.log('📊 Performance Metrics:', {
      ...this.metrics,
      score: this.getPerformanceScore(),
      timestamp: new Date().toISOString()
    });

    // In production, send to analytics service
    // analytics.track('performance_metrics', this.metrics);
  }
}

/**
 * CDN URL generator
 */
export class CDNManager {
  private static cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_URL || '';
  private static fallbackUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  /**
   * Get optimized CDN URL for assets
   */
  public static getAssetUrl(path: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  }): string {
    if (!this.cdnBaseUrl) {
      return `${this.fallbackUrl}${path}`;
    }

    let url = `${this.cdnBaseUrl}${path}`;

    if (options) {
      const params = new URLSearchParams();
      
      if (options.width) params.append('w', options.width.toString());
      if (options.height) params.append('h', options.height.toString());
      if (options.quality) params.append('q', options.quality.toString());
      if (options.format) params.append('f', options.format);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return url;
  }

  /**
   * Get optimized image URL
   */
  public static getImageUrl(src: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
  }): string {
    // Use Next.js Image Optimization API
    if (src.startsWith('/')) {
      const params = new URLSearchParams();
      params.append('url', src);
      
      if (options?.width) params.append('w', options.width.toString());
      if (options?.height) params.append('h', options.height.toString());
      if (options?.quality) params.append('q', (options.quality || 75).toString());

      return `/_next/image?${params.toString()}`;
    }

    return src;
  }

  /**
   * Preload critical resources
   */
  public static preloadCriticalResources(): void {
    if (typeof window === 'undefined') return;

    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/images/logo.webp',
      '/images/hero-bg.webp'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.getAssetUrl(resource);
      
      if (resource.includes('.woff2')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.includes('.webp') || resource.includes('.jpg') || resource.includes('.png')) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  /**
   * Generate responsive image srcSet
   */
  public static generateSrcSet(src: string, sizes: number[] = [640, 768, 1024, 1280, 1536]): string {
    return sizes
      .map(size => `${CDNManager.getImageUrl(src, { width: size })} ${size}w`)
      .join(', ');
  }

  /**
   * Get optimal image format based on browser support
   */
  public static getOptimalFormat(): 'webp' | 'avif' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg';

    // Check for AVIF support
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }
    
    // Check for WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    
    return 'jpeg';
  }

  /**
   * Lazy load images with Intersection Observer
   */
  public static setupLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
          }

          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Compress image on client side
   */
  public static compressImage(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/webp', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * Performance monitoring and reporting
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  public static startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  /**
   * End timing an operation
   */
  public static endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    this.metrics.delete(`${label}_start`);

    return duration;
  }

  /**
   * Get timing for an operation
   */
  public static getTiming(label: string): number {
    return this.metrics.get(label) || 0;
  }

  /**
   * Log performance timing
   */
  public static logTiming(label: string, threshold: number = 100): void {
    const timing = this.getTiming(label);
    if (timing > threshold) {
      console.warn(`⚠️ Slow operation: ${label} took ${timing.toFixed(2)}ms`);
    } else {
      console.log(`✅ ${label}: ${timing.toFixed(2)}ms`);
    }
  }

  /**
   * Get all performance metrics
   */
  public static getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Initialize performance optimization
export const performanceOptimizer = PerformanceOptimizer.getInstance();
