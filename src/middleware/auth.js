// Authentication middleware for protected routes
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Middleware function to authenticate requests
export function authenticateRequest(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Middleware function to check user roles
export function authorizeRole(decoded, allowedRoles) {
  if (!allowedRoles.includes(decoded.userType)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  return true;
}

// Higher-order function to protect API routes
export function withAuth(handler, options = {}) {
  return async (request, context) => {
    try {
      // Authenticate the request
      const decoded = authenticateRequest(request);
      
      // Check role authorization if specified
      if (options.roles && options.roles.length > 0) {
        authorizeRole(decoded, options.roles);
      }
      
      // Add user info to request context
      request.user = decoded;
      
      // Call the original handler
      return await handler(request, context);
      
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication failed',
          details: error.message 
        },
        { status: 401 }
      );
    }
  };
}

// Middleware for admin-only routes
export function withAdminAuth(handler) {
  return withAuth(handler, { roles: ['admin'] });
}

// Middleware for pharmacy vendor routes
export function withPharmacyAuth(handler) {
  return withAuth(handler, { roles: ['pharmacy', 'admin'] });
}

// Middleware for patient routes
export function withPatientAuth(handler) {
  return withAuth(handler, { roles: ['patient', 'admin'] });
}

// Session management utilities
export class SessionManager {
  static generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      patientId: user.patient_id,
      pharmacyId: user.pharmacy_id
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }
  
  static verifyToken(token) {
    return verifyToken(token);
  }
  
  static refreshToken(token) {
    try {
      const decoded = verifyToken(token);
      
      // Generate new token with same payload but fresh expiration
      const newPayload = {
        userId: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
        patientId: decoded.patientId,
        pharmacyId: decoded.pharmacyId
      };
      
      return jwt.sign(newPayload, JWT_SECRET, { expiresIn: '7d' });
    } catch (error) {
      throw new Error('Cannot refresh invalid token');
    }
  }
  
  static extractUserFromRequest(request) {
    try {
      return authenticateRequest(request);
    } catch (error) {
      return null;
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  constructor() {
    this.requests = new Map();
  }
  
  isAllowed(identifier, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > windowStart);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
    
    // Check current requests
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(ts => ts > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter();

// Rate limiting middleware
export function withRateLimit(handler, options = {}) {
  const { maxRequests = 100, windowMs = 60000 } = options;
  
  return async (request, context) => {
    try {
      // Get identifier (IP address or user ID)
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      
      let identifier = ip;
      
      // Use user ID if authenticated
      try {
        const decoded = authenticateRequest(request);
        identifier = decoded.userId;
      } catch (error) {
        // Use IP if not authenticated
      }
      
      // Check rate limit
      if (!globalRateLimiter.isAllowed(identifier, maxRequests, windowMs)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Rate limit exceeded',
            details: `Maximum ${maxRequests} requests per ${windowMs / 1000} seconds`
          },
          { status: 429 }
        );
      }
      
      // Call the original handler
      return await handler(request, context);
      
    } catch (error) {
      console.error('Rate limiting error:', error);
      return await handler(request, context); // Continue on rate limiter error
    }
  };
}

// Input validation utilities
export function validateRequired(data, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

export function validatePassword(password) {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
}

// Export all utilities
export default {
  verifyToken,
  authenticateRequest,
  authorizeRole,
  withAuth,
  withAdminAuth,
  withPharmacyAuth,
  withPatientAuth,
  SessionManager,
  RateLimiter,
  withRateLimit,
  validateRequired,
  validateEmail,
  validatePassword
};
