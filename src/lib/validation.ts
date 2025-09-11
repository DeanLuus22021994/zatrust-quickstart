/**
 * Comprehensive form validation utilities to provide reusable
 * validation logic across forms with consistent error handling.
 */

/**
 * Validation result type with success/failure states
 */
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: Record<string, string>;
};

/**
 * Individual field validation rule
 */
export interface FieldRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null; // Returns error message or null
}

/**
 * Validation schema definition
 */
export type ValidationSchema<T> = {
  [K in keyof T]: FieldRule;
};

/**
 * Create a validator function from a schema
 */
export function createValidator<T extends Record<string, string>>(
  schema: ValidationSchema<T>
): (input: FormData | Record<string, unknown>) => ValidationResult<T> {
  return (input: FormData | Record<string, unknown>): ValidationResult<T> => {
    const errors: Record<string, string> = {};
    const data: Record<string, string> = {};

    for (const [fieldName, rules] of Object.entries(schema)) {
      let value: string;

      // Extract value from FormData or object
      if (input instanceof FormData) {
        const formValue = input.get(fieldName);
        value = typeof formValue === 'string' ? formValue : '';
      } else {
        value = typeof input[fieldName] === 'string' ? input[fieldName] as string : '';
      }

      value = value.trim();

      // Required validation
      if (rules.required && !value) {
        errors[fieldName] = `${fieldName} is required`;
        continue;
      }

      // Skip other validations if field is empty and not required
      if (!value && !rules.required) {
        data[fieldName] = value;
        continue;
      }

      // Min length validation
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors[fieldName] = `${fieldName} must be at least ${rules.minLength} characters`;
        continue;
      }

      // Max length validation
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors[fieldName] = `${fieldName} must be no more than ${rules.maxLength} characters`;
        continue;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[fieldName] = `${fieldName} format is invalid`;
        continue;
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          errors[fieldName] = customError;
          continue;
        }
      }

      data[fieldName] = value;
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: data as T };
  };
}

/**
 * Pre-defined validation schemas for common forms
 */

export interface LoginData {
  username: string;
}

export const loginSchema: ValidationSchema<LoginData> = {
  username: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    custom: (value) => {
      if (value.includes(' ')) {
        return 'Username cannot contain spaces';
      }
      return null;
    }
  }
};

export const validateLoginForm = createValidator(loginSchema);

/**
 * Email validation utility
 */
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Common validation rules for reuse
 */
export const commonRules = {
  email: {
    required: true,
    maxLength: 254,
    custom: (value: string) => isValidEmail(value) ? null : 'Invalid email address'
  },
  
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number';
      }
      return null;
    }
  },

  name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/
  }
} as const;

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}