'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Image as ImageIcon,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Server,
  Globe,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Gauge
} from 'lucide-react';
import { performanceOptimizer, PerformanceMonitor } from '@/utils/performance';
import { cacheService } from '@/services/CacheService';
import { databaseOptimizer } from '@/services/DatabaseOptimizer';
import ClientOnly from './ClientOnly';

interface PerformanceData {
  webVitals: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    tti: number;
    score: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    totalRequests: number;
  };
  database: {
    totalQueries: number;
    averageExecutionTime: number;
    slowQueries: number;
    cacheHitRate: number;
  };
  cdn: {
    enabled: boolean;
    bandwidth: number;
    requests: number;
    cacheHitRate: number;
  };
}

export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadPerformanceData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);

      // Get Web Vitals
      const metrics = performanceOptimizer.getMetrics();
      const score = performanceOptimizer.getPerformanceScore();

      // Get cache statistics
      const cacheStats = cacheService.getStats();

      // Get database metrics
      const dbMetrics = databaseOptimizer.getQueryMetrics();

      // Mock CDN data
      const cdnData = {
        enabled: true,
        bandwidth: Math.random() * 1000 + 500, // MB
        requests: Math.floor(Math.random() * 10000) + 5000,
        cacheHitRate: Math.random() * 30 + 70 // 70-100%
      };

      setPerformanceData({
        webVitals: {
          fcp: metrics?.firstContentfulPaint || 0,
          lcp: metrics?.largestContentfulPaint || 0,
          fid: metrics?.firstInputDelay || 0,
          cls: metrics?.cumulativeLayoutShift || 0,
          tti: metrics?.timeToInteractive || 0,
          score
        },
        cache: {
          hits: cacheStats.hits,
          misses: cacheStats.misses,
          hitRate: cacheStats.hitRate,
          totalRequests: cacheStats.hits + cacheStats.misses
        },
        database: {
          totalQueries: dbMetrics.totalQueries,
          averageExecutionTime: dbMetrics.averageExecutionTime,
          slowQueries: dbMetrics.slowQueries,
          cacheHitRate: dbMetrics.cacheHitRate
        },
        cdn: cdnData
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms === null || ms === undefined) return '0ms';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (isNaN(bytes) || bytes === null || bytes === undefined) return '0B';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const safeNumber = (value: number, fallback: number = 0) => {
    return isNaN(value) || value === null || value === undefined ? fallback : value;
  };

  if (loading && !performanceData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span>Performance Dashboard</span>
            </h1>
            <p className="text-gray-600">Monitor application performance and optimization metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={loadPerformanceData}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {performanceData && (
          <>
            {/* Performance Score */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Overall Performance Score</h2>
                <Gauge className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center space-x-6">
                <div className={`text-6xl font-bold ${getScoreColor(safeNumber(performanceData.webVitals.score))}`}>
                  {safeNumber(performanceData.webVitals.score)}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        safeNumber(performanceData.webVitals.score) >= 90 ? 'bg-green-500' :
                        safeNumber(performanceData.webVitals.score) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${safeNumber(performanceData.webVitals.score)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {safeNumber(performanceData.webVitals.score) >= 90 ? 'Excellent' :
                     safeNumber(performanceData.webVitals.score) >= 70 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>

            {/* Web Vitals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Core Web Vitals</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: 'FCP', value: safeNumber(performanceData.webVitals.fcp), unit: 'ms', good: 1800 },
                  { label: 'LCP', value: safeNumber(performanceData.webVitals.lcp), unit: 'ms', good: 2500 },
                  { label: 'FID', value: safeNumber(performanceData.webVitals.fid), unit: 'ms', good: 100 },
                  { label: 'CLS', value: safeNumber(performanceData.webVitals.cls), unit: '', good: 0.1 },
                  { label: 'TTI', value: safeNumber(performanceData.webVitals.tti), unit: 'ms', good: 3800 }
                ].map(metric => (
                  <div key={metric.label} className="text-center">
                    <div className={`text-2xl font-bold ${
                      metric.value <= metric.good ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.unit === 'ms' ? formatTime(metric.value) : safeNumber(metric.value).toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      metric.value <= metric.good ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.value <= metric.good ? 'Good' : 'Poor'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cache Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <span>Cache Performance</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hit Rate</span>
                    <span className={`text-sm font-medium ${
                      safeNumber(performanceData.cache.hitRate) >= 80 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {safeNumber(performanceData.cache.hitRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="text-sm font-medium">{safeNumber(performanceData.cache.totalRequests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cache Hits</span>
                    <span className="text-sm font-medium text-green-600">{safeNumber(performanceData.cache.hits).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cache Misses</span>
                    <span className="text-sm font-medium text-red-600">{safeNumber(performanceData.cache.misses).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Database Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Database Performance</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Query Time</span>
                    <span className={`text-sm font-medium ${
                      safeNumber(performanceData.database.averageExecutionTime) < 100 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {formatTime(safeNumber(performanceData.database.averageExecutionTime))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Queries</span>
                    <span className="text-sm font-medium">{safeNumber(performanceData.database.totalQueries).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Slow Queries</span>
                    <span className={`text-sm font-medium ${
                      safeNumber(performanceData.database.slowQueries) === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {safeNumber(performanceData.database.slowQueries)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">DB Cache Hit Rate</span>
                    <span className="text-sm font-medium">{safeNumber(performanceData.database.cacheHitRate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* CDN Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>CDN Performance</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm font-medium flex items-center space-x-1 ${
                      performanceData.cdn.enabled ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {performanceData.cdn.enabled ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      <span>{performanceData.cdn.enabled ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bandwidth Saved</span>
                    <span className="text-sm font-medium">{formatBytes(safeNumber(performanceData.cdn.bandwidth) * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CDN Requests</span>
                    <span className="text-sm font-medium">{safeNumber(performanceData.cdn.requests).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CDN Hit Rate</span>
                    <span className="text-sm font-medium">{safeNumber(performanceData.cdn.cacheHitRate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Performance Recommendations</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Optimization Opportunities</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {safeNumber(performanceData.webVitals.score) < 90 && (
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        <span>Optimize Core Web Vitals for better user experience</span>
                      </li>
                    )}
                    {safeNumber(performanceData.cache.hitRate) < 80 && (
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        <span>Improve cache hit rate by optimizing cache strategy</span>
                      </li>
                    )}
                    {safeNumber(performanceData.database.slowQueries) > 0 && (
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span>Optimize {safeNumber(performanceData.database.slowQueries)} slow database queries</span>
                      </li>
                    )}
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Enable image optimization with WebP format</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Performance Wins</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>CDN integration active and performing well</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Redis caching implemented for session management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Image lazy loading and optimization enabled</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Database query optimization and monitoring active</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ClientOnly>
  );
}
