// Comprehensive Security Validator
// Input validation, sanitization, and security checks

// Dynamic import for DOMPurify to handle server/client environments
let DOMPurify: any = null;

// Initialize DOMPurify only in browser environment
if (typeof window !== 'undefined') {
  import('isomorphic-dompurify').then((module) => {
    DOMPurify = module.default;
  });
}

export class SecurityValidator {
  // Suspicious user agent patterns
  private static suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http-client/i,
    /postman/i,
    /insomnia/i
  ];

  // SQL injection patterns
  private static sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\'|\"|;|--|\*|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*(\=|\<|\>)/i,
    /(UNION.*SELECT)/i,
    /(DROP.*TABLE)/i
  ];

  // XSS patterns
  private static xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
  ];

  // Path traversal patterns
  private static pathTraversalPatterns = [
    /\.\.\//g,
    /\.\.[\\\/]/g,
    /%2e%2e%2f/gi,
    /%2e%2e%5c/gi,
    /\.\.%2f/gi,
    /\.\.%5c/gi
  ];

  // Command injection patterns
  private static commandInjectionPatterns = [
    /[;&|`$(){}[\]]/,
    /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig|ping|nslookup|dig)\b/i,
    /(\||&&|;|`|\$\(|\$\{)/
  ];

  /**
   * Validate and sanitize email address
   */
  public static validateEmail(email: string): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = email.trim().toLowerCase();

    // Basic email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(sanitized)) {
      errors.push('Invalid email format');
    }

    // Check for suspicious patterns
    if (this.containsSqlInjection(sanitized)) {
      errors.push('Email contains suspicious characters');
    }

    // Length validation
    if (sanitized.length > 254) {
      errors.push('Email too long');
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  /**
   * Validate and sanitize password
   */
  public static validatePassword(password: string): { isValid: boolean; strength: string; errors: string[] } {
    const errors: string[] = [];
    let strength = 'weak';

    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Complexity checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let complexityScore = 0;
    if (hasUppercase) complexityScore++;
    if (hasLowercase) complexityScore++;
    if (hasNumbers) complexityScore++;
    if (hasSpecialChars) complexityScore++;

    if (complexityScore < 3) {
      errors.push('Password must contain at least 3 of: uppercase, lowercase, numbers, special characters');
    }

    // Determine strength
    if (password.length >= 12 && complexityScore >= 3) {
      strength = 'strong';
    } else if (password.length >= 8 && complexityScore >= 2) {
      strength = 'medium';
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }

    if (/123456|password|qwerty|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns');
    }

    return {
      isValid: errors.length === 0,
      strength,
      errors
    };
  }

  /**
   * Validate and sanitize general text input
   */
  public static validateText(input: string, maxLength: number = 1000): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = input.trim();

    // Length validation
    if (sanitized.length > maxLength) {
      errors.push(`Text too long (max ${maxLength} characters)`);
      sanitized = sanitized.substring(0, maxLength);
    }

    // XSS protection - use basic sanitization if DOMPurify not available
    if (DOMPurify) {
      sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
    } else {
      // Basic XSS protection without DOMPurify
      sanitized = this.basicSanitize(sanitized);
    }

    // SQL injection check
    if (this.containsSqlInjection(sanitized)) {
      errors.push('Text contains suspicious patterns');
    }

    // Command injection check
    if (this.containsCommandInjection(sanitized)) {
      errors.push('Text contains potentially dangerous commands');
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  /**
   * Validate phone number
   */
  public static validatePhone(phone: string): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = phone.replace(/\D/g, ''); // Remove non-digits

    // Cameroon phone number validation
    const cameroonRegex = /^(237)?[26][0-9]{8}$/;
    
    if (!cameroonRegex.test(sanitized)) {
      errors.push('Invalid Cameroon phone number format');
    }

    // Add country code if missing
    if (sanitized.length === 9 && sanitized.startsWith('6')) {
      sanitized = '237' + sanitized;
    }

    return {
      isValid: errors.length === 0,
      sanitized: '+' + sanitized,
      errors
    };
  }

  /**
   * Validate file upload
   */
  public static validateFile(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // File size validation
    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // File name validation
    if (this.containsPathTraversal(file.name)) {
      errors.push('Invalid file name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user agent is suspicious
   */
  public static isSuspiciousUserAgent(userAgent: string): boolean {
    return this.suspiciousUserAgents.some(pattern => pattern.test(userAgent));
  }

  /**
   * Check for SQL injection patterns
   */
  public static containsSqlInjection(input: string): boolean {
    return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for XSS patterns
   */
  public static containsXSS(input: string): boolean {
    return this.xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for path traversal patterns
   */
  public static containsPathTraversal(input: string): boolean {
    return this.pathTraversalPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for command injection patterns
   */
  public static containsCommandInjection(input: string): boolean {
    return this.commandInjectionPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Sanitize HTML content
   */
  public static sanitizeHTML(html: string): string {
    if (DOMPurify) {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      });
    } else {
      // Basic HTML sanitization without DOMPurify
      return this.basicSanitize(html);
    }
  }

  /**
   * Basic sanitization without DOMPurify (for server-side)
   */
  private static basicSanitize(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;');
  }

  /**
   * Generate secure random token
   */
  public static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Validate JSON structure
   */
  public static validateJSON(jsonString: string, maxDepth: number = 10): { isValid: boolean; parsed?: any; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const parsed = JSON.parse(jsonString);
      
      // Check depth
      if (this.getObjectDepth(parsed) > maxDepth) {
        errors.push('JSON structure too deep');
      }
      
      // Check for suspicious content
      const stringified = JSON.stringify(parsed);
      if (this.containsSqlInjection(stringified) || this.containsXSS(stringified)) {
        errors.push('JSON contains suspicious content');
      }
      
      return {
        isValid: errors.length === 0,
        parsed,
        errors
      };
    } catch (error) {
      errors.push('Invalid JSON format');
      return {
        isValid: false,
        errors
      };
    }
  }

  /**
   * Get object depth for JSON validation
   */
  private static getObjectDepth(obj: any, depth: number = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return depth;
    }
    
    let maxDepth = depth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentDepth = this.getObjectDepth(obj[key], depth + 1);
        maxDepth = Math.max(maxDepth, currentDepth);
      }
    }
    
    return maxDepth;
  }

  /**
   * Rate limit key generator
   */
  public static generateRateLimitKey(ip: string, endpoint: string, userId?: string): string {
    const base = `${ip}:${endpoint}`;
    return userId ? `${base}:${userId}` : base;
  }
}
