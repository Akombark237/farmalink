// Comprehensive Notification Service for PharmaLink
// Handles WebSocket, Push, Email, and SMS notifications

import { EventEmitter } from 'events';

export interface NotificationData {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PREPARING = 'order_preparing',
  ORDER_READY = 'order_ready',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PRESCRIPTION_READY = 'prescription_ready',
  PRESCRIPTION_EXPIRING = 'prescription_expiring',
  MEDICATION_REMINDER = 'medication_reminder',
  LOW_STOCK = 'low_stock',
  PHARMACY_PROMOTION = 'pharmacy_promotion',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_ALERT = 'security_alert',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed'
}

export enum NotificationChannel {
  WEBSOCKET = 'websocket',
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  emailTemplate?: string;
  smsTemplate?: string;
  pushTemplate?: string;
}

class NotificationService extends EventEmitter {
  private static instance: NotificationService;
  private templates: Map<NotificationType, NotificationTemplate> = new Map();
  private subscribers: Map<string, Set<string>> = new Map(); // userId -> Set of connection IDs
  private isInitialized = false;

  private constructor() {
    super();
    this.initializeTemplates();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeTemplates(): void {
    // Order notifications
    this.templates.set(NotificationType.ORDER_CONFIRMED, {
      type: NotificationType.ORDER_CONFIRMED,
      title: '🛒 Order Confirmed',
      message: 'Your order #{orderNumber} has been confirmed and is being prepared.',
      emailTemplate: 'order-confirmed',
      smsTemplate: 'Order #{orderNumber} confirmed. We\'ll notify you when it\'s ready for pickup.',
      pushTemplate: 'Your order #{orderNumber} has been confirmed!'
    });

    this.templates.set(NotificationType.ORDER_READY, {
      type: NotificationType.ORDER_READY,
      title: '✅ Order Ready',
      message: 'Your order #{orderNumber} is ready for pickup at {pharmacyName}.',
      emailTemplate: 'order-ready',
      smsTemplate: 'Your order #{orderNumber} is ready for pickup at {pharmacyName}. Address: {pharmacyAddress}',
      pushTemplate: 'Your order is ready for pickup!'
    });

    this.templates.set(NotificationType.PRESCRIPTION_READY, {
      type: NotificationType.PRESCRIPTION_READY,
      title: '💊 Prescription Ready',
      message: 'Your prescription for {medicationName} is ready at {pharmacyName}.',
      emailTemplate: 'prescription-ready',
      smsTemplate: 'Prescription for {medicationName} ready at {pharmacyName}. Call {pharmacyPhone} for details.',
      pushTemplate: 'Your prescription is ready for pickup!'
    });

    this.templates.set(NotificationType.MEDICATION_REMINDER, {
      type: NotificationType.MEDICATION_REMINDER,
      title: '⏰ Medication Reminder',
      message: 'Time to take your {medicationName}. Don\'t forget your health routine!',
      emailTemplate: 'medication-reminder',
      smsTemplate: 'Reminder: Take your {medicationName} as prescribed.',
      pushTemplate: 'Time to take your medication!'
    });

    this.templates.set(NotificationType.PHARMACY_PROMOTION, {
      type: NotificationType.PHARMACY_PROMOTION,
      title: '🎉 Special Offer',
      message: '{pharmacyName} has a special offer: {offerDescription}',
      emailTemplate: 'pharmacy-promotion',
      smsTemplate: 'Special offer at {pharmacyName}: {offerDescription}. Valid until {expiryDate}.',
      pushTemplate: 'Special offer available!'
    });

    // Add more templates as needed
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize notification channels
      await this.initializeWebSocket();
      await this.initializePushService();
      await this.initializeEmailService();
      await this.initializeSMSService();

      this.isInitialized = true;
      console.log('✅ NotificationService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize NotificationService:', error);
      throw error;
    }
  }

  private async initializeWebSocket(): Promise<void> {
    // WebSocket initialization will be handled by the WebSocket server
    console.log('📡 WebSocket notification channel ready');
  }

  private async initializePushService(): Promise<void> {
    // Firebase Cloud Messaging initialization
    console.log('🔔 Push notification service ready');
  }

  private async initializeEmailService(): Promise<void> {
    // Email service initialization
    console.log('📧 Email notification service ready');
  }

  private async initializeSMSService(): Promise<void> {
    // SMS service initialization
    console.log('📱 SMS notification service ready');
  }

  public async sendNotification(notification: NotificationData): Promise<void> {
    try {
      const template = this.templates.get(notification.type);
      if (!template) {
        throw new Error(`No template found for notification type: ${notification.type}`);
      }

      // Process notification through each requested channel
      const promises = notification.channels.map(channel => {
        switch (channel) {
          case NotificationChannel.WEBSOCKET:
            return this.sendWebSocketNotification(notification);
          case NotificationChannel.PUSH:
            return this.sendPushNotification(notification);
          case NotificationChannel.EMAIL:
            return this.sendEmailNotification(notification);
          case NotificationChannel.SMS:
            return this.sendSMSNotification(notification);
          case NotificationChannel.IN_APP:
            return this.saveInAppNotification(notification);
          default:
            return Promise.resolve();
        }
      });

      await Promise.allSettled(promises);
      
      // Emit event for real-time updates
      this.emit('notification:sent', notification);
      
      console.log(`📤 Notification sent to user ${notification.userId} via ${notification.channels.join(', ')}`);
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      this.emit('notification:error', { notification, error });
      throw error;
    }
  }

  private async sendWebSocketNotification(notification: NotificationData): Promise<void> {
    // WebSocket implementation - emit event for external handling
    console.log('📡 WebSocket notification queued:', {
      userId: notification.userId,
      type: notification.type,
      title: notification.title
    });
    this.emit('websocket:send', notification);
  }

  private async sendPushNotification(notification: NotificationData): Promise<void> {
    // Push notification implementation will be handled by PushNotificationService
    this.emit('push:send', notification);
  }

  private async sendEmailNotification(notification: NotificationData): Promise<void> {
    // Email implementation will be handled by EmailService
    this.emit('email:send', notification);
  }

  private async sendSMSNotification(notification: NotificationData): Promise<void> {
    // SMS implementation will be handled by SMSService
    this.emit('sms:send', notification);
  }

  private async saveInAppNotification(notification: NotificationData): Promise<void> {
    // Save to database for in-app notifications
    this.emit('database:save', notification);
  }

  public subscribeUser(userId: string, connectionId: string): void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    this.subscribers.get(userId)!.add(connectionId);
    console.log(`👤 User ${userId} subscribed with connection ${connectionId}`);
  }

  public unsubscribeUser(userId: string, connectionId: string): void {
    const userConnections = this.subscribers.get(userId);
    if (userConnections) {
      userConnections.delete(connectionId);
      if (userConnections.size === 0) {
        this.subscribers.delete(userId);
      }
    }
    console.log(`👤 User ${userId} unsubscribed connection ${connectionId}`);
  }

  public getUserConnections(userId: string): string[] {
    return Array.from(this.subscribers.get(userId) || []);
  }

  public getTemplate(type: NotificationType): NotificationTemplate | undefined {
    return this.templates.get(type);
  }

  public interpolateTemplate(template: string, data: any): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Convenience methods for common notifications
  public async notifyOrderStatusChange(
    userId: string, 
    orderId: string, 
    orderNumber: string, 
    status: string, 
    pharmacyData: any
  ): Promise<void> {
    let type: NotificationType;
    let channels: NotificationChannel[] = [
      NotificationChannel.WEBSOCKET, 
      NotificationChannel.PUSH, 
      NotificationChannel.IN_APP
    ];

    switch (status) {
      case 'confirmed':
        type = NotificationType.ORDER_CONFIRMED;
        channels.push(NotificationChannel.EMAIL);
        break;
      case 'ready':
        type = NotificationType.ORDER_READY;
        channels.push(NotificationChannel.EMAIL, NotificationChannel.SMS);
        break;
      case 'delivered':
        type = NotificationType.ORDER_DELIVERED;
        channels.push(NotificationChannel.EMAIL);
        break;
      default:
        return;
    }

    await this.sendNotification({
      userId,
      type,
      title: this.templates.get(type)?.title || 'Order Update',
      message: this.templates.get(type)?.message || 'Your order has been updated',
      data: { orderId, orderNumber, status, ...pharmacyData },
      channels,
      priority: NotificationPriority.HIGH
    });
  }

  public async notifyPrescriptionReady(
    userId: string, 
    prescriptionId: string, 
    medicationName: string, 
    pharmacyData: any
  ): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.PRESCRIPTION_READY,
      title: '💊 Prescription Ready',
      message: `Your prescription for ${medicationName} is ready at ${pharmacyData.name}.`,
      data: { prescriptionId, medicationName, ...pharmacyData },
      channels: [
        NotificationChannel.WEBSOCKET,
        NotificationChannel.PUSH,
        NotificationChannel.EMAIL,
        NotificationChannel.SMS,
        NotificationChannel.IN_APP
      ],
      priority: NotificationPriority.HIGH
    });
  }

  public async notifyMedicationReminder(
    userId: string, 
    medicationName: string, 
    dosage: string, 
    time: string
  ): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.MEDICATION_REMINDER,
      title: '⏰ Medication Reminder',
      message: `Time to take your ${medicationName} (${dosage}).`,
      data: { medicationName, dosage, time },
      channels: [
        NotificationChannel.PUSH,
        NotificationChannel.SMS,
        NotificationChannel.IN_APP
      ],
      priority: NotificationPriority.NORMAL
    });
  }
}

export default NotificationService;
