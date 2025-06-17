// Enhanced Security Middleware for PharmaLink
// Implements rate limiting, HTTPS enforcement, security headers, and request validation

import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from './utils/rateLimiter';
import { SecurityValidator } from './utils/securityValidator';

// Rate limiter instances for different endpoints
const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  message: 'Too many API requests, please try again later'
});

const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per window
  message: 'Too many login attempts, please try again later'
});

const strictRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute for sensitive endpoints
  message: 'Rate limit exceeded for sensitive operation'
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. HTTPS Enforcement
  if (process.env.NODE_ENV === 'production' && !request.nextUrl.protocol.includes('https')) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl);
  }

  // 2. Security Headers
  addSecurityHeaders(response);

  // 3. Rate Limiting
  const rateLimitResult = applyRateLimit(request, pathname);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // 4. Input Validation for API routes
  if (pathname.startsWith('/api/')) {
    const validationResult = validateRequest(request);
    if (validationResult) {
      return validationResult;
    }
  }

  // 5. Content Security Policy
  if (pathname.startsWith('/api/')) {
    response.headers.set('Content-Type', 'application/json');
  }

  return response;
}

function addSecurityHeaders(response: NextResponse) {
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Next.js
    "style-src 'self' 'unsafe-inline'", // Allow inline styles
    "img-src 'self' data: https: blob:", // Allow images from various sources
    "font-src 'self' data:",
    "connect-src 'self' https: wss:", // Allow API calls and WebSocket
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

function applyRateLimit(request: NextRequest, pathname: string): NextResponse | null {
  const clientIP = getClientIP(request);
  
  // Authentication endpoints - strict rate limiting
  if (pathname.startsWith('/api/auth/')) {
    if (!authRateLimiter.isAllowed(clientIP)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many authentication attempts',
          retryAfter: authRateLimiter.getRetryAfter(clientIP)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': authRateLimiter.getRetryAfter(clientIP).toString()
          }
        }
      );
    }
  }
  
  // Sensitive endpoints - very strict rate limiting
  else if (pathname.includes('/admin/') || 
           pathname.includes('/payment/') || 
           pathname.includes('/prescription/')) {
    if (!strictRateLimiter.isAllowed(clientIP)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded for sensitive operation',
          retryAfter: strictRateLimiter.getRetryAfter(clientIP)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': strictRateLimiter.getRetryAfter(clientIP).toString()
          }
        }
      );
    }
  }
  
  // General API endpoints
  else if (pathname.startsWith('/api/')) {
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'API rate limit exceeded',
          retryAfter: apiRateLimiter.getRetryAfter(clientIP)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': apiRateLimiter.getRetryAfter(clientIP).toString()
          }
        }
      );
    }
  }
  
  return null;
}

function validateRequest(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Validate request size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Request payload too large'
      }),
      {
        status: 413,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Invalid Content-Type. Expected application/json'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Validate User-Agent (block suspicious requests)
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || SecurityValidator.isSuspiciousUserAgent(userAgent)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Invalid or suspicious request'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return null;
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection remote address
  return request.ip || 'unknown';
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
