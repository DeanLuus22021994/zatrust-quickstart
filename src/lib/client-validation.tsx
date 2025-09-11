/**
 * Client-side validation utilities for progressive enhancement.
 * Provides real-time form validation while maintaining server-side validation for security.
 */

"use client";

import React from "react";

import type { ValidationResult, ValidationSchema } from "@/lib/validation";

import { config } from "@/lib/config";
import { createValidator } from "@/lib/validation";

/**
 * Real-time form validation hook with debouncing
 */
export function useFormValidation<T extends Record<string, string>>(
  schema: ValidationSchema<T>,
  debounceMs: number = config.ui.debounceMs
) {
  const [values, setValues] = React.useState<Partial<T>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const validator = React.useMemo(() => createValidator(schema), [schema]);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Validate a single field
   */
  const validateField = React.useCallback((fieldName: string, value: string) => {
    const fieldSchema = { [fieldName]: schema[fieldName as keyof T] } as ValidationSchema<Pick<T, keyof T>>;
    const fieldValidator = createValidator(fieldSchema);
    const result = fieldValidator({ [fieldName]: value });
    
    if (!result.success) {
      setErrors(prev => ({ ...prev, [fieldName]: result.errors[fieldName] || "" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [schema]);

  /**
   * Validate entire form
   */
  const validateForm = React.useCallback((): ValidationResult<T> => {
    const result = validator(values);
    
    if (!result.success) {
      setErrors(result.errors);
    } else {
      setErrors({});
    }
    
    return result;
  }, [validator, values]);

  /**
   * Handle field value change with debounced validation
   */
  const handleFieldChange = React.useCallback((fieldName: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldName]: value } as Partial<T>));
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounced validation
    debounceTimeoutRef.current = setTimeout(() => {
      if (touched[fieldName]) {
        validateField(fieldName, value);
      }
    }, debounceMs);
  }, [validateField, touched, debounceMs]);

  /**
   * Handle field blur (mark as touched and validate immediately)
   */
  const handleFieldBlur = React.useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const value = values[fieldName as keyof T] || "";
    validateField(fieldName, value as string);
  }, [values, validateField]);

  /**
   * Handle form submission
   */
  const handleSubmit = React.useCallback(async (
    onSubmit: (data: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allFields = Object.keys(schema);
    setTouched(prev => {
      const newTouched = { ...prev };
      allFields.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    try {
      const result = validateForm();
      
      if (result.success) {
        await onSubmit(result.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, validateForm]);

  /**
   * Reset form state
   */
  const resetForm = React.useCallback(() => {
    setValues({});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  /**
   * Get error for a specific field (only if touched)
   */
  const getFieldError = React.useCallback((fieldName: string) => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  }, [touched, errors]);

  /**
   * Check if form is valid
   */
  const isValid = React.useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length > 0;
  }, [errors, touched]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    validateForm,
    setValues
  };
}

/**
 * Enhanced form input component with built-in validation
 */
interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  name: string;
  label: string;
  error?: string;
  onFieldChange: (name: string, value: string) => void;
  onFieldBlur: (name: string) => void;
  required?: boolean;
}

export function ValidatedInput({
  name,
  label,
  error,
  onFieldChange,
  onFieldBlur,
  required = false,
  className = "",
  ...props
}: ValidatedInputProps) {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(name, e.target.value);
  };
  
  const handleBlur = () => {
    onFieldBlur(name);
  };

  return (
    <div className="space-y-1">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        {...props}
        id={inputId}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        required={required}
      />
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Form submission helper with loading state
 */
export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const submitForm = React.useCallback(async (
    action: () => Promise<void>
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setSubmitError(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitForm,
    clearError
  };
}