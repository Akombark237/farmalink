// Firebase Cloud Messaging Push Notification Service
// Handles push notifications for mobile and web clients

import * as admin from 'firebase-admin';
import NotificationService, { NotificationData, NotificationType } from './NotificationService';

export interface PushSubscription {
  id?: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  deviceType: 'web' | 'android' | 'ios';
  createdAt: Date;
  lastUsed?: Date;
}

export interface FCMMessage {
  token?: string;
  topic?: string;
  condition?: string;
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: { [key: string]: string };
  android?: admin.messaging.AndroidConfig;
  apns?: admin.messaging.ApnsConfig;
  webpush?: admin.messaging.WebpushConfig;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private notificationService: NotificationService;
  private isInitialized = false;
  private subscriptions: Map<string, PushSubscription[]> = new Map(); // userId -> subscriptions

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.setupNotificationListeners();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
          : null;

        if (serviceAccount) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        } else {
          // For development, use default credentials or mock
          console.warn('⚠️ Firebase service account not configured. Push notifications will be mocked.');
        }
      }

      // Load existing subscriptions from database
      await this.loadSubscriptions();

      this.isInitialized = true;
      console.log('🔔 Push Notification Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Push Notification Service:', error);
      throw error;
    }
  }

  private setupNotificationListeners(): void {
    this.notificationService.on('push:send', (notification: NotificationData) => {
      this.sendPushNotification(notification);
    });
  }

  private async loadSubscriptions(): Promise<void> {
    // In a real implementation, load from database
    // For now, we'll use in-memory storage
    console.log('📱 Loading push subscriptions from database...');
  }

  public async subscribeToPush(subscription: Omit<PushSubscription, 'id' | 'createdAt'>): Promise<string> {
    try {
      const newSubscription: PushSubscription = {
        ...subscription,
        id: this.generateSubscriptionId(),
        createdAt: new Date()
      };

      // Store in memory (in production, save to database)
      if (!this.subscriptions.has(subscription.userId)) {
        this.subscriptions.set(subscription.userId, []);
      }
      this.subscriptions.get(subscription.userId)!.push(newSubscription);

      // Subscribe to FCM topic for user
      if (admin.apps.length > 0) {
        await this.subscribeToTopic(subscription.endpoint, `user_${subscription.userId}`);
      }

      console.log(`📱 User ${subscription.userId} subscribed to push notifications`);
      return newSubscription.id!;
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  public async unsubscribeFromPush(userId: string, subscriptionId: string): Promise<void> {
    try {
      const userSubscriptions = this.subscriptions.get(userId);
      if (userSubscriptions) {
        const index = userSubscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index !== -1) {
          const subscription = userSubscriptions[index];
          
          // Unsubscribe from FCM topic
          if (admin.apps.length > 0) {
            await this.unsubscribeFromTopic(subscription.endpoint, `user_${userId}`);
          }
          
          userSubscriptions.splice(index, 1);
          if (userSubscriptions.length === 0) {
            this.subscriptions.delete(userId);
          }
        }
      }

      console.log(`📱 User ${userId} unsubscribed from push notifications`);
    } catch (error) {
      console.error('❌ Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  public async sendPushNotification(notification: NotificationData): Promise<void> {
    try {
      const userSubscriptions = this.subscriptions.get(notification.userId);
      if (!userSubscriptions || userSubscriptions.length === 0) {
        console.log(`📱 No push subscriptions found for user ${notification.userId}`);
        return;
      }

      const template = this.notificationService.getTemplate(notification.type);
      const message = this.createFCMMessage(notification, template?.pushTemplate);

      // Send to all user's devices
      const promises = userSubscriptions.map(subscription => 
        this.sendToDevice(subscription, message)
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      console.log(`📤 Push notification sent: ${successful} successful, ${failed} failed`);
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
      throw error;
    }
  }

  private createFCMMessage(notification: NotificationData, template?: string): FCMMessage {
    const title = notification.title;
    const body = template 
      ? this.notificationService.interpolateTemplate(template, notification.data)
      : notification.message;

    const message: FCMMessage = {
      notification: {
        title,
        body,
        imageUrl: this.getNotificationIcon(notification.type)
      },
      data: {
        type: notification.type,
        userId: notification.userId,
        timestamp: new Date().toISOString(),
        ...this.stringifyData(notification.data)
      },
      android: {
        priority: 'high',
        notification: {
          icon: 'ic_notification',
          color: '#2563eb',
          sound: 'default',
          channelId: this.getAndroidChannelId(notification.type),
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true
        }
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body
            },
            badge: 1,
            sound: 'default',
            category: notification.type
          }
        }
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          image: this.getNotificationIcon(notification.type),
          vibrate: [200, 100, 200],
          requireInteraction: notification.priority === 'urgent',
          actions: this.getNotificationActions(notification.type)
        },
        fcmOptions: {
          link: this.getNotificationLink(notification.type, notification.data)
        }
      }
    };

    return message;
  }

  private async sendToDevice(subscription: PushSubscription, message: FCMMessage): Promise<void> {
    try {
      if (admin.apps.length === 0) {
        // Mock sending for development
        console.log(`📱 [MOCK] Push notification sent to ${subscription.deviceType} device`);
        return;
      }

      // Use the subscription endpoint as token for FCM
      const result = await admin.messaging().send({
        ...message,
        token: subscription.endpoint
      });

      // Update last used timestamp
      subscription.lastUsed = new Date();
      
      console.log(`📱 Push notification sent successfully: ${result}`);
    } catch (error) {
      console.error('❌ Failed to send push to device:', error);
      
      // Handle invalid tokens
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        await this.removeInvalidSubscription(subscription);
      }
      
      throw error;
    }
  }

  private async subscribeToTopic(token: string, topic: string): Promise<void> {
    if (admin.apps.length === 0) return;
    
    try {
      await admin.messaging().subscribeToTopic([token], topic);
      console.log(`📱 Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to subscribe to topic ${topic}:`, error);
    }
  }

  private async unsubscribeFromTopic(token: string, topic: string): Promise<void> {
    if (admin.apps.length === 0) return;
    
    try {
      await admin.messaging().unsubscribeFromTopic([token], topic);
      console.log(`📱 Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to unsubscribe from topic ${topic}:`, error);
    }
  }

  private async removeInvalidSubscription(subscription: PushSubscription): Promise<void> {
    const userSubscriptions = this.subscriptions.get(subscription.userId);
    if (userSubscriptions) {
      const index = userSubscriptions.findIndex(sub => sub.id === subscription.id);
      if (index !== -1) {
        userSubscriptions.splice(index, 1);
        console.log(`📱 Removed invalid subscription for user ${subscription.userId}`);
      }
    }
  }

  private getNotificationIcon(type: NotificationType): string {
    const icons: { [key in NotificationType]: string } = {
      [NotificationType.ORDER_CONFIRMED]: '/icons/order-confirmed.png',
      [NotificationType.ORDER_READY]: '/icons/order-ready.png',
      [NotificationType.PRESCRIPTION_READY]: '/icons/prescription-ready.png',
      [NotificationType.MEDICATION_REMINDER]: '/icons/medication-reminder.png',
      [NotificationType.PHARMACY_PROMOTION]: '/icons/promotion.png',
      // Add more icons as needed
    } as any;

    return icons[type] || '/icons/icon-192x192.png';
  }

  private getAndroidChannelId(type: NotificationType): string {
    const channels: { [key in NotificationType]: string } = {
      [NotificationType.ORDER_CONFIRMED]: 'orders',
      [NotificationType.ORDER_READY]: 'orders',
      [NotificationType.PRESCRIPTION_READY]: 'prescriptions',
      [NotificationType.MEDICATION_REMINDER]: 'reminders',
      [NotificationType.PHARMACY_PROMOTION]: 'promotions',
      // Add more channels as needed
    } as any;

    return channels[type] || 'default';
  }

  private getNotificationActions(type: NotificationType): any[] {
    const actions: { [key in NotificationType]: any[] } = {
      [NotificationType.ORDER_READY]: [
        { action: 'view', title: 'View Order' },
        { action: 'directions', title: 'Get Directions' }
      ],
      [NotificationType.PRESCRIPTION_READY]: [
        { action: 'view', title: 'View Details' },
        { action: 'call', title: 'Call Pharmacy' }
      ],
      [NotificationType.MEDICATION_REMINDER]: [
        { action: 'taken', title: 'Mark as Taken' },
        { action: 'snooze', title: 'Remind Later' }
      ]
    } as any;

    return actions[type] || [];
  }

  private getNotificationLink(type: NotificationType, data: any): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    switch (type) {
      case NotificationType.ORDER_CONFIRMED:
      case NotificationType.ORDER_READY:
        return `${baseUrl}/orders/${data.orderId}`;
      case NotificationType.PRESCRIPTION_READY:
        return `${baseUrl}/prescriptions/${data.prescriptionId}`;
      default:
        return baseUrl;
    }
  }

  private stringifyData(data: any): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(data || {})) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods
  public getUserSubscriptions(userId: string): PushSubscription[] {
    return this.subscriptions.get(userId) || [];
  }

  public getSubscriptionCount(): number {
    let count = 0;
    this.subscriptions.forEach(subs => count += subs.length);
    return count;
  }

  public async sendToTopic(topic: string, notification: NotificationData): Promise<void> {
    if (admin.apps.length === 0) {
      console.log(`📱 [MOCK] Topic notification sent to ${topic}`);
      return;
    }

    const template = this.notificationService.getTemplate(notification.type);
    const message = this.createFCMMessage(notification, template?.pushTemplate);

    try {
      const result = await admin.messaging().send({
        ...message,
        topic
      });
      console.log(`📱 Topic notification sent successfully: ${result}`);
    } catch (error) {
      console.error('❌ Failed to send topic notification:', error);
      throw error;
    }
  }
}

export default PushNotificationService;
