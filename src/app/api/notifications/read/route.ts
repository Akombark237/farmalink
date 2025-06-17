// Mark Notifications as Read API
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token (with demo fallback)
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo purposes, return a mock user
    return { userId: 'demo-user', userType: 'patient' };
  }

  const token = authHeader.substring(7);

  // Handle demo tokens
  if (token === 'demo-token') {
    return { userId: 'demo-user', userType: 'patient' };
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    // For demo purposes, return a mock user instead of throwing
    console.warn('JWT verification failed, using demo user:', error.message);
    return { userId: 'demo-user', userType: 'patient' };
  }
}

// POST - Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, markAll = false } = body;

    // Verify user authentication
    const decoded = verifyToken(request) as any;
    const userId = decoded.userId;

    if (markAll) {
      // Mark all notifications as read for the user
      console.log(`📖 Marked all notifications as read for user ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
        data: {
          markedCount: 10, // Mock count
          markedAt: new Date().toISOString()
        }
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      console.log(`📖 Marked ${notificationIds.length} notifications as read for user ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: `${notificationIds.length} notifications marked as read`,
        data: {
          markedIds: notificationIds,
          markedCount: notificationIds.length,
          markedAt: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either provide notificationIds array or set markAll to true' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Mark notifications read API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to mark notifications as read',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
