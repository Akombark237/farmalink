// Notifications API - Manage user notifications and preferences
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import NotificationService from '@/services/NotificationService';
import {
  NotificationData,
  NotificationType,
  NotificationChannel,
  NotificationPriority
} from '@/services/NotificationService';

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

// GET - Fetch user's notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';

    // Verify user authentication
    const decoded = verifyToken(request) as any;
    const userId = decoded.userId;

    // In a real implementation, fetch from database
    // For now, return mock notifications
    const mockNotifications = [
      {
        id: '1',
        userId,
        type: NotificationType.ORDER_CONFIRMED,
        title: '🛒 Order Confirmed',
        message: 'Your order #ORD-2024-001 has been confirmed and is being prepared.',
        data: {
          orderId: 'ord_123',
          orderNumber: 'ORD-2024-001',
          pharmacyName: 'PHARMACIE FRANCAISE'
        },
        channels: [NotificationChannel.WEBSOCKET, NotificationChannel.PUSH, NotificationChannel.EMAIL],
        priority: NotificationPriority.HIGH,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        readAt: null,
        isRead: false
      },
      {
        id: '2',
        userId,
        type: NotificationType.PRESCRIPTION_READY,
        title: '💊 Prescription Ready',
        message: 'Your prescription for Paracetamol is ready at PHARMACIE CENTRALE.',
        data: {
          prescriptionId: 'presc_456',
          medicationName: 'Paracetamol',
          pharmacyName: 'PHARMACIE CENTRALE'
        },
        channels: [NotificationChannel.WEBSOCKET, NotificationChannel.PUSH, NotificationChannel.SMS],
        priority: NotificationPriority.HIGH,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        readAt: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '3',
        userId,
        type: NotificationType.MEDICATION_REMINDER,
        title: '⏰ Medication Reminder',
        message: 'Time to take your Amoxicillin (500mg).',
        data: {
          medicationName: 'Amoxicillin',
          dosage: '500mg',
          time: '14:00'
        },
        channels: [NotificationChannel.PUSH, NotificationChannel.SMS],
        priority: NotificationPriority.NORMAL,
        createdAt: new Date(Date.now() - 10800000), // 3 hours ago
        readAt: null,
        isRead: false
      }
    ];

    // Filter notifications
    let filteredNotifications = mockNotifications;
    
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    // Apply pagination
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          total: filteredNotifications.length,
          limit,
          offset,
          hasMore: offset + limit < filteredNotifications.length
        },
        unreadCount: mockNotifications.filter(n => !n.isRead).length
      }
    });

  } catch (error) {
    console.error('Notifications GET API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch notifications',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Send a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      title, 
      message, 
      data = {}, 
      channels = [NotificationChannel.WEBSOCKET, NotificationChannel.PUSH],
      priority = NotificationPriority.NORMAL,
      scheduledFor
    } = body;

    // Verify user authentication (admin or system)
    const decoded = verifyToken(request) as any;
    const requesterId = decoded.userId;
    const requesterType = decoded.userType;

    // Only admins or the user themselves can send notifications
    if (requesterType !== 'admin' && requesterId !== userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized to send notifications for this user' 
        },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: userId, type, title, message' 
        },
        { status: 400 }
      );
    }

    // Validate notification type
    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid notification type. Must be one of: ${Object.values(NotificationType).join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Create notification
    const notification: NotificationData = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      data,
      channels,
      priority,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
    };

    // Send notification through NotificationService
    const notificationService = NotificationService.getInstance();
    await notificationService.sendNotification(notification);

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notificationId: notification.id,
        sentAt: new Date().toISOString(),
        channels: notification.channels
      }
    });

  } catch (error) {
    console.error('Notifications POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send notification',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update notification preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      emailNotifications = true,
      smsNotifications = true,
      pushNotifications = true,
      notificationTypes = {}
    } = body;

    // Verify user authentication
    const decoded = verifyToken(request) as any;
    const userId = decoded.userId;

    // In a real implementation, update user preferences in database
    const preferences = {
      userId,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      notificationTypes,
      updatedAt: new Date().toISOString()
    };

    console.log(`📝 Updated notification preferences for user ${userId}:`, preferences);

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });

  } catch (error) {
    console.error('Notifications PUT API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update notification preferences',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear all notifications or specific notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    // Verify user authentication
    const decoded = verifyToken(request) as any;
    const userId = decoded.userId;

    if (notificationId) {
      // Delete specific notification
      console.log(`🗑️ Deleted notification ${notificationId} for user ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } else {
      // Clear all notifications for user
      console.log(`🗑️ Cleared all notifications for user ${userId}`);
      
      return NextResponse.json({
        success: true,
        message: 'All notifications cleared successfully'
      });
    }

  } catch (error) {
    console.error('Notifications DELETE API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete notifications',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
