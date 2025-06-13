import { NextResponse } from 'next/server';
import Database from '../../../../lib/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to verify JWT token and check admin access
function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid authorization token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmalink-jwt-secret-2024');

  // Check if user has admin privileges (you can adjust this based on your user roles)
  if (decoded.userType !== 'admin' && decoded.userType !== 'pharmacy') {
    throw new Error('Insufficient privileges');
  }

  return decoded;
}

// GET - List users with optional filtering and pagination
export async function GET(request) {
  try {
    // Verify admin access
    const decoded = verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const userType = searchParams.get('userType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    if (userType) {
      whereConditions.push(`u.user_type = $${paramIndex}`);
      queryParams.push(userType);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`u.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(u.email ILIKE $${paramIndex} OR pp.first_name ILIKE $${paramIndex} OR pp.last_name ILIKE $${paramIndex} OR ph.name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Main query
    const usersQuery = `
      SELECT
        u.id,
        u.email,
        u.user_type,
        u.status,
        u.email_verified,
        u.phone,
        u.created_at,
        u.last_login,
        pp.first_name,
        pp.last_name,
        pp.phone as patient_phone,
        ph.name as pharmacy_name,
        ph.address as pharmacy_address,
        ph.phone as pharmacy_phone
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      LEFT JOIN pharmacy_profiles ph ON u.id = ph.user_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN patient_profiles pp ON u.id = pp.user_id
      LEFT JOIN pharmacy_profiles ph ON u.id = ph.user_id
      WHERE ${whereConditions.join(' AND ')}
    `;

    const countParams = queryParams.slice(0, -2); // Remove limit and offset

    // Execute queries
    const [usersResult, countResult] = await Promise.all([
      Database.query(usersQuery, queryParams),
      Database.query(countQuery, countParams)
    ]);

    const users = usersResult.rows.map(user => ({
      id: user.id,
      email: user.email,
      userType: user.user_type,
      status: user.status,
      emailVerified: user.email_verified,
      phone: user.phone || user.patient_phone || user.pharmacy_phone,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        pharmacyName: user.pharmacy_name,
        pharmacyAddress: user.pharmacy_address
      }
    }));

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Users GET API error:', error);

    if (error.message.includes('token') || error.message.includes('privileges')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request) {
  try {
    // Verify admin access
    const decoded = verifyAdminToken(request);

    const body = await request.json();
    const {
      email,
      password,
      userType,
      firstName,
      lastName,
      phone,
      pharmacyName,
      pharmacyAddress
    } = body;

    // Validate required fields
    if (!email || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email, password, and user type are required'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Database.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists'
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in transaction
    const result = await Database.transaction(async (client) => {
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, user_type, phone, status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING id, email, user_type, status, created_at`,
        [email.toLowerCase(), passwordHash, userType, phone]
      );

      const newUser = userResult.rows[0];

      // Create profile based on user type
      if (userType === 'patient' && (firstName || lastName)) {
        await client.query(
          `INSERT INTO patient_profiles (user_id, first_name, last_name)
           VALUES ($1, $2, $3)`,
          [newUser.id, firstName, lastName]
        );
      } else if (userType === 'pharmacy' && pharmacyName) {
        await client.query(
          `INSERT INTO pharmacy_profiles (user_id, name, address)
           VALUES ($1, $2, $3)`,
          [newUser.id, pharmacyName, pharmacyAddress]
        );
      }

      return newUser;
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        email: result.email,
        userType: result.user_type,
        status: result.status,
        createdAt: result.created_at
      },
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Users POST API error:', error);

    if (error.message.includes('token') || error.message.includes('privileges')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized access'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        details: error.message
      },
      { status: 500 }
    );
  }
}