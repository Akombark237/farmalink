'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Activity,
  Users,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import ClientOnly from './ClientOnly';

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  successfulLogins: number;
  failedLogins: number;
  lockedAccounts: number;
  activeRateLimits: number;
  suspiciousActivity: number;
  lastUpdated: Date;
}

interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failure' | 'rate_limit' | 'suspicious_activity' | 'account_locked';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  clientIP: string;
  userAgent: string;
  timestamp: Date;
  userId?: string;
  email?: string;
}

interface RateLimitStatus {
  endpoint: string;
  activeClients: number;
  blockedClients: number;
  requestsPerMinute: number;
  status: 'normal' | 'warning' | 'critical';
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimitStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [eventFilter, setEventFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSecurityData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Mock security data - in production, fetch from API
      const mockMetrics: SecurityMetrics = {
        totalRequests: 15420,
        blockedRequests: 234,
        successfulLogins: 1250,
        failedLogins: 89,
        lockedAccounts: 3,
        activeRateLimits: 12,
        suspiciousActivity: 7,
        lastUpdated: new Date()
      };

      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login_success',
          severity: 'low',
          message: 'Successful login',
          clientIP: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          userId: 'user_001',
          email: 'user@example.com'
        },
        {
          id: '2',
          type: 'rate_limit',
          severity: 'medium',
          message: 'Rate limit exceeded for authentication endpoint',
          clientIP: '203.0.113.45',
          userAgent: 'curl/7.68.0',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          id: '3',
          type: 'suspicious_activity',
          severity: 'high',
          message: 'Multiple failed login attempts from same IP',
          clientIP: '198.51.100.23',
          userAgent: 'python-requests/2.25.1',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '4',
          type: 'account_locked',
          severity: 'critical',
          message: 'Account locked due to suspicious activity',
          clientIP: '198.51.100.23',
          userAgent: 'python-requests/2.25.1',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          email: 'target@example.com'
        }
      ];

      const mockRateLimits: RateLimitStatus[] = [
        {
          endpoint: '/api/auth/login',
          activeClients: 45,
          blockedClients: 3,
          requestsPerMinute: 120,
          status: 'warning'
        },
        {
          endpoint: '/api/delivery',
          activeClients: 23,
          blockedClients: 0,
          requestsPerMinute: 85,
          status: 'normal'
        },
        {
          endpoint: '/api/payments',
          activeClients: 12,
          blockedClients: 1,
          requestsPerMinute: 45,
          status: 'normal'
        }
      ];

      setMetrics(mockMetrics);
      setEvents(mockEvents);
      setRateLimits(mockRateLimits);
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'login_failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rate_limit':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'account_locked':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
    const matchesSearch = searchTerm === '' || 
      event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clientIP.includes(searchTerm) ||
      event.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
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
              <Shield className="h-8 w-8 text-blue-600" />
              <span>Security Dashboard</span>
            </h1>
            <p className="text-gray-600">Monitor security metrics and events in real-time</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={fetchSecurityData}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Security Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalRequests.toLocaleString()}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from yesterday</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blocked Requests</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.blockedRequests}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">-5% from yesterday</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-600">Success rate: {((metrics.successfulLogins / (metrics.successfulLogins + metrics.failedLogins)) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Locked Accounts</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.lockedAccounts}</p>
                </div>
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-600">Active rate limits: {metrics.activeRateLimits}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rate Limit Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Rate Limit Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rateLimits.map((limit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{limit.endpoint}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      limit.status === 'critical' ? 'bg-red-100 text-red-800' :
                      limit.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {limit.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Active clients: {limit.activeClients}</div>
                    <div>Blocked clients: {limit.blockedClients}</div>
                    <div>Requests/min: {limit.requestsPerMinute}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Security Events</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Events</option>
                  <option value="login_success">Login Success</option>
                  <option value="login_failure">Login Failure</option>
                  <option value="rate_limit">Rate Limit</option>
                  <option value="suspicious_activity">Suspicious Activity</option>
                  <option value="account_locked">Account Locked</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{event.message}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>IP: {event.clientIP}</span>
                      {event.email && <span className="ml-4">Email: {event.email}</span>}
                      <span className="ml-4">Time: {formatTime(event.timestamp)}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      User Agent: {event.userAgent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
