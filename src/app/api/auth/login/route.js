// src/app/api/auth/login/route.js
// Enhanced Secure Login API endpoint with comprehensive security features

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from '../../../../../lib/database';
import { SecurityValidator } from '../../../../../utils/securityValidator';
import { encryptionService } from '../../../../../utils/encryption';
import { globalRateLimiters } from '../../../../../utils/rateLimiter';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return request.ip || 'unknown';
}

export async function POST(request) {
  const clientIP = getClientIP(request);
  const startTime = Date.now();

  try {
    // 1. Rate limiting check
    if (!globalRateLimiters.auth.isAllowed(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          retryAfter: globalRateLimiters.auth.getRetryAfter(clientIP)
        },
        {
          status: 429,
          headers: {
            'Retry-After': globalRateLimiters.auth.getRetryAfter(clientIP).toString()
          }
        }
      );
    }

    const { email, password } = await request.json();

    // 2. Input validation and sanitization
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Validate email format and sanitize
    const emailValidation = SecurityValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          details: emailValidation.errors
        },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = SecurityValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid password format',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // 3. Find user by email with security fields
    const userQuery = `
      SELECT u.*,
             pp.first_name, pp.last_name, pp.id as patient_id,
             ph.name as pharmacy_name, ph.id as pharmacy_id,
             u.failed_login_attempts, u.locked_until
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      LEFT JOIN pharmacy_profiles ph ON u.id = ph.user_id
      WHERE u.email = $1 AND u.status = 'active'
    `;

    const result = await Database.query(userQuery, [emailValidation.sanitized]);

    if (result.rows.length === 0) {
      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // 4. Check if account is locked
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account temporarily locked due to multiple failed login attempts',
          lockedUntil: user.locked_until
        },
        { status: 423 }
      );
    }

    // 5. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;

      // Lock account if too many failed attempts
      if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
      }

      await Database.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [newFailedAttempts, lockedUntil, user.id]
      );

      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          attemptsRemaining: Math.max(0, MAX_LOGIN_ATTEMPTS - newFailedAttempts)
        },
        { status: 401 }
      );
    }

    // 6. Reset failed login attempts and update last login
    await Database.query(
      `UPDATE users SET
         failed_login_attempts = 0,
         locked_until = NULL,
         last_login = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );

    // 7. Generate secure JWT token with additional claims
    const sessionId = encryptionService.generateSecureUUID();
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      patientId: user.patient_id,
      pharmacyId: user.pharmacy_id,
      sessionId: sessionId,
      loginTime: Date.now(),
      clientIP: clientIP
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'pharmalink-jwt-secret-change-in-production',
      {
        expiresIn: '24h',
        issuer: 'pharmalink',
        audience: 'pharmalink-users'
      }
    );

    // 8. Prepare secure user data for response
    const userData = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      emailVerified: user.email_verified,
      lastLogin: new Date(),
      profile: {}
    };

    if (user.user_type === 'patient') {
      userData.profile = {
        id: user.patient_id,
        firstName: user.first_name,
        lastName: user.last_name
      };
    } else if (user.user_type === 'pharmacy') {
      userData.profile = {
        id: user.pharmacy_id,
        name: user.pharmacy_name
      };
    }

    // 9. Log successful login
    console.log(`✅ Successful login: ${user.email} from ${clientIP} in ${Date.now() - startTime}ms`);

    // 10. Create secure response with security headers
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token: token,
      sessionId: sessionId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Set secure HTTP-only cookie
    response.cookies.set('pharmalink_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;

  } catch (error) {
    console.error('❌ Login API error:', error);

    // Log security incident
    console.log(`🚨 Security incident: Login error from ${clientIP} - ${error.message}`);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
