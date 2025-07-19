import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Types
export type SanitizationLevel = 'basic' | 'strict';

export interface SanitizeOptions {
  level?: SanitizationLevel;
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
  preserveLineBreaks?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue: string;
}

export interface SanitizeResult {
  original: string;
  sanitized: string;
  changed: boolean;
  errors: string[];
}

// Default configurations
const DEFAULT_ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'u', 'br', 'p'];
const DEFAULT_ALLOWED_ATTRIBUTES = [];

const STRICT_ALLOWED_TAGS: string[] = [];
const STRICT_ALLOWED_ATTRIBUTES: string[] = [];

// Validation schemas
const emailSchema = z.string().email();
const phoneSchema = z.string().regex(/^[\+]?[\d\s\-\(\)]{7,20}$/);
const nameSchema = z.string().min(1).max(100).regex(/^[a-zA-Z\s\-\.\']+$/);
const urlSchema = z.string().url();

// HTML sanitization configuration
const createDOMPurifyConfig = (options: SanitizeOptions = {}) => {
  const { level = 'basic', allowedTags, allowedAttributes } = options;
  
  let tags: string[] = [];
  let attributes: string[] = [];
  
  if (level === 'strict') {
    tags = allowedTags || STRICT_ALLOWED_TAGS;
    attributes = allowedAttributes || STRICT_ALLOWED_ATTRIBUTES;
  } else {
    tags = allowedTags || DEFAULT_ALLOWED_TAGS;
    attributes = allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES;
  }
  
  return {
    ALLOWED_TAGS: tags,
    ALLOWED_ATTR: attributes,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    KEEP_CONTENT: true,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  };
};

// Core sanitization functions
export const sanitizeHtml = (input: string, options: SanitizeOptions = {}): SanitizeResult => {
  if (!input || typeof input !== 'string') {
    return {
      original: input || '',
      sanitized: '',
      changed: false,
      errors: input ? ['Invalid input type'] : [],
    };
  }

  const original = input;
  const config = createDOMPurifyConfig(options);
  
  try {
    const sanitized = DOMPurify.sanitize(input, config);
    
    return {
      original,
      sanitized,
      changed: original !== sanitized,
      errors: [],
    };
  } catch (error) {
    return {
      original,
      sanitized: '',
      changed: true,
      errors: ['Sanitization failed'],
    };
  }
};

export const sanitizeText = (input: string, options: SanitizeOptions = {}): SanitizeResult => {
  if (!input || typeof input !== 'string') {
    return {
      original: input || '',
      sanitized: '',
      changed: false,
      errors: input ? ['Invalid input type'] : [],
    };
  }

  const original = input;
  let sanitized = input;
  const errors: string[] = [];

  // Remove HTML tags completely
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Handle line breaks
  if (options.preserveLineBreaks) {
    sanitized = sanitized.replace(/\n+/g, '\n');
  } else {
    sanitized = sanitized.replace(/\n/g, ' ');
  }
  
  // Normalize Unicode
  sanitized = sanitized.normalize('NFC');
  
  // Remove control characters except common ones
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Handle maximum length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
    errors.push(`Input truncated to ${options.maxLength} characters`);
  }
  
  // Strict mode additional cleaning
  if (options.level === 'strict') {
    // Remove special characters that might be used for attacks
    sanitized = sanitized.replace(/[<>\"\'&]/g, '');
    // Remove excessive punctuation
    sanitized = sanitized.replace(/[!@#$%^&*()]{2,}/g, '');
  }

  return {
    original,
    sanitized,
    changed: original !== sanitized,
    errors,
  };
};

// Specific sanitization functions
export const sanitizeEmail = (input: string, options: SanitizeOptions = {}): ValidationResult => {
  const textResult = sanitizeText(input, { ...options, level: 'strict' });
  const sanitized = textResult.sanitized.toLowerCase();
  
  try {
    emailSchema.parse(sanitized);
    return {
      isValid: true,
      errors: textResult.errors,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [...textResult.errors, 'Invalid email format'],
      sanitizedValue: sanitized,
    };
  }
};

export const sanitizeName = (input: string, options: SanitizeOptions = {}): ValidationResult => {
  const textResult = sanitizeText(input, { ...options, maxLength: 100 });
  let sanitized = textResult.sanitized;
  
  // Allow only letters, spaces, hyphens, dots, and apostrophes
  sanitized = sanitized.replace(/[^a-zA-Z\s\-\.']/g, '');
  
  // Normalize multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Capitalize first letter of each word
  sanitized = sanitized.replace(/\b\w/g, (char) => char.toUpperCase());
  
  try {
    nameSchema.parse(sanitized);
    return {
      isValid: true,
      errors: textResult.errors,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [...textResult.errors, 'Invalid name format'],
      sanitizedValue: sanitized,
    };
  }
};

export const sanitizePhone = (input: string, options: SanitizeOptions = {}): ValidationResult => {
  const textResult = sanitizeText(input, { ...options, level: 'strict' });
  let sanitized = textResult.sanitized;
  
  // Allow only digits, spaces, hyphens, parentheses, and plus sign
  sanitized = sanitized.replace(/[^\d\s\-\(\)\+]/g, '');
  
  // Normalize spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  try {
    phoneSchema.parse(sanitized);
    return {
      isValid: true,
      errors: textResult.errors,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [...textResult.errors, 'Invalid phone format'],
      sanitizedValue: sanitized,
    };
  }
};

export const sanitizeUrl = (input: string, options: SanitizeOptions = {}): ValidationResult => {
  const textResult = sanitizeText(input, { ...options, level: 'strict' });
  let sanitized = textResult.sanitized;
  
  // Ensure protocol
  if (sanitized && !sanitized.match(/^https?:\/\//)) {
    sanitized = `https://${sanitized}`;
  }
  
  try {
    urlSchema.parse(sanitized);
    return {
      isValid: true,
      errors: textResult.errors,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [...textResult.errors, 'Invalid URL format'],
      sanitizedValue: sanitized,
    };
  }
};

// Utility functions
export const stripHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
};

export const escapeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};

export const unescapeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  const htmlUnescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  
  return input.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, (entity) => htmlUnescapeMap[entity]);
};

export const normalizeWhitespace = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/\s+/g, ' ').trim();
};

export const removeControlCharacters = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[\x00-\x1F\x7F]/g, '');
};

export const normalizeUnicode = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.normalize('NFC');
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

export const isValidName = (name: string): boolean => {
  try {
    nameSchema.parse(name);
    return true;
  } catch {
    return false;
  }
};

export const isValidUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

// Comprehensive sanitization function
export const sanitizeInput = (
  input: string,
  type: 'html' | 'text' | 'email' | 'name' | 'phone' | 'url' = 'text',
  options: SanitizeOptions = {}
): SanitizeResult | ValidationResult => {
  switch (type) {
    case 'html':
      return sanitizeHtml(input, options);
    case 'text':
      return sanitizeText(input, options);
    case 'email':
      return sanitizeEmail(input, options);
    case 'name':
      return sanitizeName(input, options);
    case 'phone':
      return sanitizePhone(input, options);
    case 'url':
      return sanitizeUrl(input, options);
    default:
      return sanitizeText(input, options);
  }
};

// Batch sanitization
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  rules: Record<keyof T, { type: 'html' | 'text' | 'email' | 'name' | 'phone' | 'url'; options?: SanitizeOptions }>
): { sanitized: T; errors: Record<keyof T, string[]>; isValid: boolean } => {
  const sanitized = {} as T;
  const errors = {} as Record<keyof T, string[]>;
  let isValid = true;

  for (const [key, rule] of Object.entries(rules)) {
    const value = obj[key];
    if (typeof value === 'string') {
      const result = sanitizeInput(value, rule.type, rule.options);
      
      if ('isValid' in result) {
        sanitized[key as keyof T] = result.sanitizedValue as T[keyof T];
        errors[key as keyof T] = result.errors;
        if (!result.isValid) isValid = false;
      } else {
        sanitized[key as keyof T] = result.sanitized as T[keyof T];
        errors[key as keyof T] = result.errors;
      }
    } else {
      sanitized[key as keyof T] = value;
      errors[key as keyof T] = [];
    }
  }

  return { sanitized, errors, isValid };
};