// SMS Notification Service for PharmaLink
// Handles SMS notifications using Twilio for prescription alerts and urgent notifications

import { Twilio } from 'twilio';
import NotificationService, { NotificationData, NotificationType } from './NotificationService';

export interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
  mediaUrl?: string[];
}

export interface SMSTemplate {
  type: NotificationType;
  template: string;
  maxLength: number;
}

class SMSService {
  private static instance: SMSService;
  private client: Twilio | null = null;
  private notificationService: NotificationService;
  private templates: Map<NotificationType, SMSTemplate> = new Map();
  private isInitialized = false;
  private fromNumber: string = '';

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.setupNotificationListeners();
    this.initializeTemplates();
  }

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const config: SMSConfig = {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: process.env.TWILIO_PHONE_NUMBER || ''
      };

      if (!config.accountSid || !config.authToken || !config.fromNumber) {
        console.warn('⚠️ Twilio credentials not configured. SMS notifications will be mocked.');
        this.isInitialized = true;
        return;
      }

      this.client = new Twilio(config.accountSid, config.authToken);
      this.fromNumber = config.fromNumber;
      
      // Test the connection
      await this.testConnection();
      
      this.isInitialized = true;
      console.log('📱 SMS Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SMS Service:', error);
      // Continue without SMS service for development
      this.isInitialized = true;
    }
  }

  private setupNotificationListeners(): void {
    this.notificationService.on('sms:send', (notification: NotificationData) => {
      this.sendSMSNotification(notification);
    });
  }

  private initializeTemplates(): void {
    this.templates.set(NotificationType.ORDER_CONFIRMED, {
      type: NotificationType.ORDER_CONFIRMED,
      template: 'PharmaLink: Order #{orderNumber} confirmed at {pharmacyName}. We\'ll notify you when ready for pickup.',
      maxLength: 160
    });

    this.templates.set(NotificationType.ORDER_READY, {
      type: NotificationType.ORDER_READY,
      template: 'PharmaLink: Order #{orderNumber} ready for pickup at {pharmacyName}, {pharmacyAddress}. Call {pharmacyPhone} for details.',
      maxLength: 160
    });

    this.templates.set(NotificationType.PRESCRIPTION_READY, {
      type: NotificationType.PRESCRIPTION_READY,
      template: 'PharmaLink: Prescription for {medicationName} ready at {pharmacyName}. Address: {pharmacyAddress}. Call {pharmacyPhone}.',
      maxLength: 160
    });

    this.templates.set(NotificationType.MEDICATION_REMINDER, {
      type: NotificationType.MEDICATION_REMINDER,
      template: 'PharmaLink Reminder: Time to take your {medicationName} ({dosage}). Stay consistent with your treatment.',
      maxLength: 160
    });

    this.templates.set(NotificationType.PRESCRIPTION_EXPIRING, {
      type: NotificationType.PRESCRIPTION_EXPIRING,
      template: 'PharmaLink: Your prescription for {medicationName} expires on {expiryDate}. Contact your doctor for renewal.',
      maxLength: 160
    });

    this.templates.set(NotificationType.PHARMACY_PROMOTION, {
      type: NotificationType.PHARMACY_PROMOTION,
      template: 'PharmaLink: {pharmacyName} special offer - {offerDescription}. Valid until {expiryDate}.',
      maxLength: 160
    });

    this.templates.set(NotificationType.SECURITY_ALERT, {
      type: NotificationType.SECURITY_ALERT,
      template: 'PharmaLink Security Alert: {alertMessage}. If this wasn\'t you, contact support immediately.',
      maxLength: 160
    });
  }

  public async sendSMSNotification(notification: NotificationData): Promise<void> {
    try {
      // Get user phone number from database (mock for now)
      const userPhone = await this.getUserPhoneNumber(notification.userId);
      if (!userPhone) {
        console.log(`📱 No phone number found for user ${notification.userId}`);
        return;
      }

      const template = this.templates.get(notification.type);
      if (!template) {
        console.log(`📱 No SMS template found for ${notification.type}`);
        return;
      }

      const message = this.interpolateTemplate(template.template, notification.data);
      const truncatedMessage = this.truncateMessage(message, template.maxLength);

      await this.sendSMS({
        to: userPhone,
        body: truncatedMessage
      });

      console.log(`📱 SMS sent to ${userPhone} for ${notification.type}`);
    } catch (error) {
      console.error('❌ Failed to send SMS notification:', error);
      throw error;
    }
  }

  public async sendSMS(message: SMSMessage): Promise<string | null> {
    try {
      if (this.client) {
        const result = await this.client.messages.create({
          body: message.body,
          from: message.from || this.fromNumber,
          to: this.formatPhoneNumber(message.to),
          mediaUrl: message.mediaUrl
        });

        console.log(`📱 SMS sent successfully: ${result.sid}`);
        return result.sid;
      } else {
        // Mock SMS sending for development
        console.log(`📱 [MOCK] SMS sent to ${message.to}:`);
        console.log(`Message: ${message.body}`);
        return `mock_${Date.now()}`;
      }
    } catch (error) {
      console.error('❌ Failed to send SMS:', error);
      throw error;
    }
  }

  public async sendBulkSMS(messages: SMSMessage[]): Promise<(string | null)[]> {
    try {
      const promises = messages.map(message => this.sendSMS(message));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`📱 Bulk SMS sent: ${successful} successful, ${failed} failed`);
      
      return results.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );
    } catch (error) {
      console.error('❌ Failed to send bulk SMS:', error);
      throw error;
    }
  }

  public async sendOTP(phoneNumber: string, code: string): Promise<string | null> {
    const message = `PharmaLink: Your verification code is ${code}. This code expires in 10 minutes. Do not share this code with anyone.`;
    
    return await this.sendSMS({
      to: phoneNumber,
      body: message
    });
  }

  public async sendPasswordReset(phoneNumber: string, resetCode: string): Promise<string | null> {
    const message = `PharmaLink: Your password reset code is ${resetCode}. This code expires in 15 minutes. If you didn't request this, ignore this message.`;
    
    return await this.sendSMS({
      to: phoneNumber,
      body: message
    });
  }

  public async sendEmergencyAlert(phoneNumber: string, alertMessage: string): Promise<string | null> {
    const message = `PharmaLink URGENT: ${alertMessage}. Contact emergency services if needed.`;
    
    return await this.sendSMS({
      to: phoneNumber,
      body: message
    });
  }

  private async getUserPhoneNumber(userId: string): Promise<string | null> {
    // In a real implementation, fetch from database
    // For now, return a mock phone number (Cameroon format)
    return `+237${Math.floor(Math.random() * 900000000) + 600000000}`;
  }

  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private truncateMessage(message: string, maxLength: number): string {
    if (message.length <= maxLength) {
      return message;
    }
    
    // Truncate and add ellipsis
    return message.substring(0, maxLength - 3) + '...';
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it's a Cameroon number without country code, add +237
    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      return `+237${cleaned}`;
    }
    
    // If it already has country code
    if (cleaned.length === 12 && cleaned.startsWith('237')) {
      return `+${cleaned}`;
    }
    
    // If it starts with +, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // Default: assume it's already formatted
    return phoneNumber;
  }

  private async testConnection(): Promise<void> {
    if (!this.client) return;
    
    try {
      // Test by fetching account info
      await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('📱 Twilio connection test successful');
    } catch (error) {
      console.error('❌ Twilio connection test failed:', error);
      throw error;
    }
  }

  // Utility methods
  public getTemplate(type: NotificationType): SMSTemplate | undefined {
    return this.templates.get(type);
  }

  public addTemplate(template: SMSTemplate): void {
    this.templates.set(template.type, template);
  }

  public validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for Cameroon phone numbers
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Cameroon mobile numbers start with 6 and are 9 digits
    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      return true;
    }
    
    // With country code +237
    if (cleaned.length === 12 && cleaned.startsWith('237') && cleaned.charAt(3) === '6') {
      return true;
    }
    
    return false;
  }

  public async getMessageStatus(messageSid: string): Promise<any> {
    if (!this.client) {
      return { status: 'mock', error: 'SMS service not initialized' };
    }
    
    try {
      const message = await this.client.messages(messageSid).fetch();
      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        dateUpdated: message.dateUpdated
      };
    } catch (error) {
      console.error('❌ Failed to get message status:', error);
      throw error;
    }
  }

  public async getAccountBalance(): Promise<number> {
    if (!this.client) return 0;
    
    try {
      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      return parseFloat(account.balance || '0');
    } catch (error) {
      console.error('❌ Failed to get account balance:', error);
      return 0;
    }
  }

  // Emergency notification for critical health alerts
  public async sendCriticalHealthAlert(
    phoneNumber: string, 
    patientName: string, 
    alertType: string, 
    details: string
  ): Promise<string | null> {
    const message = `CRITICAL HEALTH ALERT - PharmaLink: ${patientName} - ${alertType}. ${details}. Contact emergency services: 117`;
    
    return await this.sendSMS({
      to: phoneNumber,
      body: message
    });
  }
}

export default SMSService;
