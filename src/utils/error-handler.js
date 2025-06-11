// Comprehensive error handling utilities for production readiness
import { NextResponse } from 'next/server';

// Error types
export const ErrorTypes = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  DATABASE: 'DATABASE_ERROR',
  EXTERNAL_API: 'EXTERNAL_API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  SERVER: 'SERVER_ERROR'
};

// Custom error class
export class AppError extends Error {
  constructor(message, type = ErrorTypes.SERVER, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, AppError);
  }
}

// Validation error
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.VALIDATION, 400, details);
  }
}

// Authentication error
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, ErrorTypes.AUTHENTICATION, 401);
  }
}

// Authorization error
export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, ErrorTypes.AUTHORIZATION, 403);
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, ErrorTypes.NOT_FOUND, 404);
  }
}

// Database error
export class DatabaseError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.DATABASE, 500, details);
  }
}

// Rate limit error
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, ErrorTypes.RATE_LIMIT, 429);
  }
}

// Error logger
export class ErrorLogger {
  static log(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        type: error.type || 'UNKNOWN',
        statusCode: error.statusCode || 500,
        stack: error.stack
      },
      context,
      environment: process.env.NODE_ENV || 'development'
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error:', JSON.stringify(logEntry, null, 2));
    } else {
      // In production, you might want to send to external logging service
      console.error('Error:', JSON.stringify(logEntry));
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket, etc.)
    // this.sendToExternalLogger(logEntry);
  }

  static sendToExternalLogger(logEntry) {
    // Implementation for external logging service
    // Example: Sentry, LogRocket, DataDog, etc.
  }
}

// Global error handler for API routes
export function handleApiError(error, request = null) {
  // Log the error
  ErrorLogger.log(error, {
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers?.get('user-agent'),
    ip: request?.headers?.get('x-forwarded-for') || 'unknown'
  });

  // Determine response based on error type
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        type: error.type,
        details: error.details,
        timestamp: error.timestamp
      },
      { status: error.statusCode }
    );
  }

  // Handle specific database errors
  if (error.code === '23505') { // PostgreSQL unique violation
    return NextResponse.json(
      {
        success: false,
        error: 'Resource already exists',
        type: ErrorTypes.VALIDATION,
        timestamp: new Date().toISOString()
      },
      { status: 409 }
    );
  }

  if (error.code === '23503') { // PostgreSQL foreign key violation
    return NextResponse.json(
      {
        success: false,
        error: 'Referenced resource not found',
        type: ErrorTypes.VALIDATION,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid authentication token',
        type: ErrorTypes.AUTHENTICATION,
        timestamp: new Date().toISOString()
      },
      { status: 401 }
    );
  }

  if (error.name === 'TokenExpiredError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication token expired',
        type: ErrorTypes.AUTHENTICATION,
        timestamp: new Date().toISOString()
      },
      { status: 401 }
    );
  }

  // Generic server error
  return NextResponse.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Internal server error',
      type: ErrorTypes.SERVER,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

// Higher-order function to wrap API handlers with error handling
export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, request);
    }
  };
}

// Input validation utilities
export class Validator {
  static required(value, fieldName) {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
    return value;
  }

  static email(value, fieldName = 'Email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid email address`);
    }
    return value;
  }

  static minLength(value, minLength, fieldName) {
    if (value.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`);
    }
    return value;
  }

  static maxLength(value, maxLength, fieldName) {
    if (value.length > maxLength) {
      throw new ValidationError(`${fieldName} must be no more than ${maxLength} characters long`);
    }
    return value;
  }

  static numeric(value, fieldName) {
    const num = Number(value);
    if (isNaN(num)) {
      throw new ValidationError(`${fieldName} must be a valid number`);
    }
    return num;
  }

  static positive(value, fieldName) {
    const num = this.numeric(value, fieldName);
    if (num <= 0) {
      throw new ValidationError(`${fieldName} must be a positive number`);
    }
    return num;
  }

  static integer(value, fieldName) {
    const num = this.numeric(value, fieldName);
    if (!Number.isInteger(num)) {
      throw new ValidationError(`${fieldName} must be an integer`);
    }
    return num;
  }

  static oneOf(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
    return value;
  }

  static uuid(value, fieldName) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid UUID`);
    }
    return value;
  }

  static phone(value, fieldName = 'Phone number') {
    // Cameroon phone number format
    const phoneRegex = /^\+237\s?[2-9]\d{8}$/;
    if (!phoneRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid Cameroon phone number (+237XXXXXXXXX)`);
    }
    return value;
  }

  static validateObject(obj, schema) {
    const errors = [];
    const validated = {};

    for (const [field, rules] of Object.entries(schema)) {
      try {
        let value = obj[field];

        // Check if field is required
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        // Skip validation if field is optional and not provided
        if (!rules.required && (value === undefined || value === null || value === '')) {
          continue;
        }

        // Apply validation rules
        if (rules.type === 'email') {
          value = this.email(value, field);
        } else if (rules.type === 'phone') {
          value = this.phone(value, field);
        } else if (rules.type === 'uuid') {
          value = this.uuid(value, field);
        } else if (rules.type === 'number') {
          value = this.numeric(value, field);
          if (rules.positive) {
            value = this.positive(value, field);
          }
          if (rules.integer) {
            value = this.integer(value, field);
          }
        }

        if (rules.minLength) {
          value = this.minLength(value, rules.minLength, field);
        }

        if (rules.maxLength) {
          value = this.maxLength(value, rules.maxLength, field);
        }

        if (rules.oneOf) {
          value = this.oneOf(value, rules.oneOf, field);
        }

        validated[field] = value;

      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', { errors });
    }

    return validated;
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  static startTimer(label) {
    const start = process.hrtime.bigint();
    return {
      end: () => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      }
    };
  }

  static async measureAsync(label, asyncFunction) {
    const timer = this.startTimer(label);
    try {
      const result = await asyncFunction();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }
}

export default {
  ErrorTypes,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  RateLimitError,
  ErrorLogger,
  handleApiError,
  withErrorHandling,
  Validator,
  PerformanceMonitor
};
