// Email Notification Service for PharmaLink
// Handles email notifications for order status, prescriptions, and other updates

import nodemailer from 'nodemailer';
import NotificationService, { NotificationData, NotificationType } from './NotificationService';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;
  private notificationService: NotificationService;
  private templates: Map<string, EmailTemplate> = new Map();
  private isInitialized = false;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.setupNotificationListeners();
    this.initializeTemplates();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      };

      if (!config.auth.user || !config.auth.pass) {
        console.warn('⚠️ SMTP credentials not configured. Email notifications will be mocked.');
        this.isInitialized = true;
        return;
      }

      this.transporter = nodemailer.createTransporter(config);
      
      // Verify connection
      await this.transporter.verify();
      
      this.isInitialized = true;
      console.log('📧 Email Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Email Service:', error);
      // Continue without email service for development
      this.isInitialized = true;
    }
  }

  private setupNotificationListeners(): void {
    this.notificationService.on('email:send', (notification: NotificationData) => {
      this.sendEmailNotification(notification);
    });
  }

  private initializeTemplates(): void {
    // Order confirmation template
    this.templates.set('order-confirmed', {
      subject: '🛒 Order Confirmed - PharmaLink',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>Order Confirmed</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear Customer,</p>
            <p>Your order <strong>#{orderNumber}</strong> has been confirmed and is being prepared.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Order Number:</strong> {orderNumber}</p>
              <p><strong>Pharmacy:</strong> {pharmacyName}</p>
              <p><strong>Total Amount:</strong> {totalAmount} XAF</p>
              <p><strong>Delivery Method:</strong> {deliveryMethod}</p>
            </div>
            
            <p>We'll notify you when your order is ready for pickup.</p>
            <p>Thank you for choosing PharmaLink!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{orderUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order</a>
            </div>
          </div>
          <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>PharmaLink - Your trusted pharmacy connection platform</p>
            <p>If you have any questions, contact us at support@pharmalink.cm</p>
          </div>
        </div>
      `,
      text: `
        Order Confirmed - PharmaLink
        
        Dear Customer,
        
        Your order #{orderNumber} has been confirmed and is being prepared.
        
        Order Details:
        - Order Number: {orderNumber}
        - Pharmacy: {pharmacyName}
        - Total Amount: {totalAmount} XAF
        - Delivery Method: {deliveryMethod}
        
        We'll notify you when your order is ready for pickup.
        
        Thank you for choosing PharmaLink!
        
        View your order: {orderUrl}
      `
    });

    // Order ready template
    this.templates.set('order-ready', {
      subject: '✅ Order Ready for Pickup - PharmaLink',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center;">
            <h1>Order Ready for Pickup</h1>
          </div>
          <div style="padding: 20px;">
            <p>Great news! Your order is ready for pickup.</p>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Pickup Information:</h3>
              <p><strong>Order Number:</strong> {orderNumber}</p>
              <p><strong>Pharmacy:</strong> {pharmacyName}</p>
              <p><strong>Address:</strong> {pharmacyAddress}</p>
              <p><strong>Phone:</strong> {pharmacyPhone}</p>
              <p><strong>Hours:</strong> Monday - Saturday: 8:00 AM - 8:00 PM</p>
            </div>
            
            <p>Please bring a valid ID when picking up your order.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{directionsUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">Get Directions</a>
              <a href="{orderUrl}" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order</a>
            </div>
          </div>
        </div>
      `,
      text: `
        Order Ready for Pickup - PharmaLink
        
        Great news! Your order #{orderNumber} is ready for pickup.
        
        Pickup Information:
        - Pharmacy: {pharmacyName}
        - Address: {pharmacyAddress}
        - Phone: {pharmacyPhone}
        - Hours: Monday - Saturday: 8:00 AM - 8:00 PM
        
        Please bring a valid ID when picking up your order.
      `
    });

    // Prescription ready template
    this.templates.set('prescription-ready', {
      subject: '💊 Prescription Ready - PharmaLink',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #7c3aed; color: white; padding: 20px; text-align: center;">
            <h1>Prescription Ready</h1>
          </div>
          <div style="padding: 20px;">
            <p>Your prescription is ready for pickup!</p>
            
            <div style="background: #faf5ff; border: 1px solid #7c3aed; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Prescription Details:</h3>
              <p><strong>Medication:</strong> {medicationName}</p>
              <p><strong>Pharmacy:</strong> {pharmacyName}</p>
              <p><strong>Address:</strong> {pharmacyAddress}</p>
              <p><strong>Phone:</strong> {pharmacyPhone}</p>
            </div>
            
            <p>Please bring your prescription and a valid ID when picking up your medication.</p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Important:</strong> Please take your medication as prescribed by your doctor. If you have any questions about your medication, consult with the pharmacist.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:{pharmacyPhone}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Call Pharmacy</a>
            </div>
          </div>
        </div>
      `,
      text: `
        Prescription Ready - PharmaLink
        
        Your prescription for {medicationName} is ready for pickup!
        
        Pickup Location:
        - Pharmacy: {pharmacyName}
        - Address: {pharmacyAddress}
        - Phone: {pharmacyPhone}
        
        Please bring your prescription and a valid ID when picking up your medication.
        
        Important: Please take your medication as prescribed by your doctor.
      `
    });

    // Medication reminder template
    this.templates.set('medication-reminder', {
      subject: '⏰ Medication Reminder - PharmaLink',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
            <h1>Medication Reminder</h1>
          </div>
          <div style="padding: 20px;">
            <p>This is a friendly reminder to take your medication.</p>
            
            <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Medication Details:</h3>
              <p><strong>Medication:</strong> {medicationName}</p>
              <p><strong>Dosage:</strong> {dosage}</p>
              <p><strong>Time:</strong> {time}</p>
            </div>
            
            <p>Consistency is key to effective treatment. Don't forget to take your medication as prescribed.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{appUrl}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Open PharmaLink</a>
            </div>
          </div>
        </div>
      `,
      text: `
        Medication Reminder - PharmaLink
        
        This is a friendly reminder to take your medication.
        
        Medication: {medicationName}
        Dosage: {dosage}
        Time: {time}
        
        Consistency is key to effective treatment. Don't forget to take your medication as prescribed.
      `
    });
  }

  public async sendEmailNotification(notification: NotificationData): Promise<void> {
    try {
      // Get user email from database (mock for now)
      const userEmail = await this.getUserEmail(notification.userId);
      if (!userEmail) {
        console.log(`📧 No email found for user ${notification.userId}`);
        return;
      }

      const template = this.notificationService.getTemplate(notification.type);
      const emailTemplate = template?.emailTemplate;
      
      if (!emailTemplate || !this.templates.has(emailTemplate)) {
        console.log(`📧 No email template found for ${notification.type}`);
        return;
      }

      const templateData = this.templates.get(emailTemplate)!;
      const interpolatedData = {
        subject: this.interpolateTemplate(templateData.subject, notification.data),
        html: this.interpolateTemplate(templateData.html, notification.data),
        text: this.interpolateTemplate(templateData.text, notification.data)
      };

      if (this.transporter) {
        await this.transporter.sendMail({
          from: `"PharmaLink" <${process.env.SMTP_FROM || 'noreply@pharmalink.cm'}>`,
          to: userEmail,
          subject: interpolatedData.subject,
          html: interpolatedData.html,
          text: interpolatedData.text
        });
        
        console.log(`📧 Email sent to ${userEmail} for ${notification.type}`);
      } else {
        // Mock email sending for development
        console.log(`📧 [MOCK] Email sent to ${userEmail}:`);
        console.log(`Subject: ${interpolatedData.subject}`);
        console.log(`Body: ${interpolatedData.text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('❌ Failed to send email notification:', error);
      throw error;
    }
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    // In a real implementation, fetch from database
    // For now, return a mock email
    return `user${userId}@example.com`;
  }

  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  public async sendCustomEmail(
    to: string, 
    subject: string, 
    html: string, 
    text?: string
  ): Promise<void> {
    try {
      if (this.transporter) {
        await this.transporter.sendMail({
          from: `"PharmaLink" <${process.env.SMTP_FROM || 'noreply@pharmalink.cm'}>`,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, '') // Strip HTML if no text provided
        });
        
        console.log(`📧 Custom email sent to ${to}`);
      } else {
        console.log(`📧 [MOCK] Custom email sent to ${to}: ${subject}`);
      }
    } catch (error) {
      console.error('❌ Failed to send custom email:', error);
      throw error;
    }
  }

  public async sendBulkEmail(
    recipients: string[], 
    subject: string, 
    html: string, 
    text?: string
  ): Promise<void> {
    try {
      const promises = recipients.map(email => 
        this.sendCustomEmail(email, subject, html, text)
      );
      
      await Promise.allSettled(promises);
      console.log(`📧 Bulk email sent to ${recipients.length} recipients`);
    } catch (error) {
      console.error('❌ Failed to send bulk email:', error);
      throw error;
    }
  }

  // Utility methods
  public getTemplate(templateName: string): EmailTemplate | undefined {
    return this.templates.get(templateName);
  }

  public addTemplate(name: string, template: EmailTemplate): void {
    this.templates.set(name, template);
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Email service connection test failed:', error);
      return false;
    }
  }
}

export default EmailService;
