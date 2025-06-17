// Advanced Encryption Utilities for PharmaLink
// Handles data encryption, password hashing, and secure token generation

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16; // 128 bits

export class EncryptionService {
  private static instance: EncryptionService;
  private masterKey: Buffer;

  private constructor() {
    // In production, this should come from environment variables or secure key management
    const masterKeyString = process.env.MASTER_ENCRYPTION_KEY || 'pharmalink-default-key-change-in-production';
    this.masterKey = crypto.scryptSync(masterKeyString, 'pharmalink-salt', KEY_LENGTH);
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Encrypt sensitive data (PII, medical records, payment info)
   */
  public encryptData(plaintext: string): string {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, this.masterKey);
      cipher.setAAD(Buffer.from('pharmalink-aad')); // Additional authenticated data

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      // Combine IV + encrypted data + auth tag
      const result = {
        iv: iv.toString('hex'),
        data: encrypted,
        tag: tag.toString('hex')
      };

      return Buffer.from(JSON.stringify(result)).toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  public decryptData(encryptedData: string): string {
    try {
      const parsed = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
      const { iv, data, tag } = parsed;

      const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, this.masterKey);
      decipher.setAAD(Buffer.from('pharmalink-aad'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash passwords securely
   */
  public async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 12; // High security for medical data
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify password against hash
   */
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Generate secure random token for sessions, API keys, etc.
   */
  public generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate cryptographically secure UUID
   */
  public generateSecureUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Create HMAC signature for data integrity
   */
  public createHMAC(data: string, secret?: string): string {
    const hmacSecret = secret || process.env.HMAC_SECRET || 'pharmalink-hmac-secret';
    return crypto.createHmac('sha256', hmacSecret).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  public verifyHMAC(data: string, signature: string, secret?: string): boolean {
    const expectedSignature = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Encrypt medical records with additional metadata
   */
  public encryptMedicalRecord(record: any): string {
    const recordString = JSON.stringify({
      data: record,
      timestamp: new Date().toISOString(),
      version: '1.0'
    });
    return this.encryptData(recordString);
  }

  /**
   * Decrypt medical records
   */
  public decryptMedicalRecord(encryptedRecord: string): any {
    const decryptedString = this.decryptData(encryptedRecord);
    const parsed = JSON.parse(decryptedString);
    return parsed.data;
  }

  /**
   * Encrypt payment information
   */
  public encryptPaymentInfo(paymentData: any): string {
    // Add additional security for payment data
    const securePaymentData = {
      ...paymentData,
      encrypted_at: new Date().toISOString(),
      checksum: this.createHMAC(JSON.stringify(paymentData))
    };
    return this.encryptData(JSON.stringify(securePaymentData));
  }

  /**
   * Decrypt payment information
   */
  public decryptPaymentInfo(encryptedPaymentData: string): any {
    const decryptedString = this.decryptData(encryptedPaymentData);
    const parsed = JSON.parse(decryptedString);
    
    // Verify checksum
    const { checksum, ...paymentData } = parsed;
    const expectedChecksum = this.createHMAC(JSON.stringify(paymentData));
    
    if (!this.verifyHMAC(JSON.stringify(paymentData), checksum)) {
      throw new Error('Payment data integrity check failed');
    }
    
    return paymentData;
  }
}

/**
 * Utility functions for common encryption tasks
 */
export class CryptoUtils {
  /**
   * Generate secure API key
   */
  public static generateAPIKey(): string {
    const prefix = 'pk_';
    const randomPart = crypto.randomBytes(24).toString('hex');
    return prefix + randomPart;
  }

  /**
   * Generate secure session token
   */
  public static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash sensitive identifiers (email, phone) for indexing
   */
  public static hashIdentifier(identifier: string): string {
    return crypto.createHash('sha256').update(identifier.toLowerCase()).digest('hex');
  }

  /**
   * Generate secure OTP
   */
  public static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  /**
   * Create secure file name for uploads
   */
  public static generateSecureFileName(originalName: string): string {
    const extension = originalName.split('.').pop();
    const secureId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}_${secureId}.${extension}`;
  }

  /**
   * Mask sensitive data for logging
   */
  public static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars * 2) {
      return '*'.repeat(data.length);
    }
    
    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const middle = '*'.repeat(data.length - visibleChars * 2);
    
    return start + middle + end;
  }

  /**
   * Generate secure backup codes
   */
  public static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      const formatted = code.match(/.{1,4}/g)?.join('-') || code;
      codes.push(formatted);
    }
    
    return codes;
  }

  /**
   * Secure random number generation
   */
  public static secureRandomInt(min: number, max: number): number {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const threshold = maxValue - (maxValue % range);
    
    let randomValue;
    do {
      randomValue = crypto.randomBytes(bytesNeeded).readUIntBE(0, bytesNeeded);
    } while (randomValue >= threshold);
    
    return min + (randomValue % range);
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

// Export types for TypeScript
export interface EncryptedData {
  iv: string;
  data: string;
  tag: string;
}

export interface SecureRecord {
  data: any;
  timestamp: string;
  version: string;
  checksum?: string;
}
