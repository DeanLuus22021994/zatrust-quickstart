/**
 * Login form component with client-side validation and enhanced UX.
 * Provides immediate feedback while maintaining server-side validation for security.
 * 
 * @example
 * ```tsx
 * <LoginForm from="/dashboard" />
 * ```
 */

"use client";

import React from "react";

import { LoadingButton } from "@/components/ui/LoadingStates";
import { useFormValidation, useFormSubmission, ValidatedInput } from "@/lib/client-validation";
import { loginSchema } from "@/lib/validation";

/**
 * Props for the LoginForm component
 */
interface LoginFormProps {
  /** Optional redirect path after successful login */
  from?: string;
}

/**
 * Enhanced login form with client-side validation and loading states
 */
export default function LoginForm({ from }: LoginFormProps) {
  const {
    values,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getFieldError,
    isValid
  } = useFormValidation(loginSchema);

  const { isSubmitting, submitError, submitForm, clearError } = useFormSubmission();

  /**
   * Handle form submission with proper error handling
   */
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    await handleSubmit(async (data) => {
      await submitForm(async () => {
        const formData = new FormData();
        const { username } = data;
        if (!username) {
          throw new Error("Username is required");
        }
        
        formData.append('username', username);
        if (from) {
          formData.append('from', from);
        }

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        // Redirect will be handled by the server response
        window.location.href = response.url;
      });
    });
  };

  // Clear errors when user starts typing
  React.useEffect(() => {
    if (submitError && values.username) {
      clearError();
    }
  }, [values.username, submitError, clearError]);

  return (
    <form onSubmit={onSubmit} className="login-form" noValidate>
      {from && <input type="hidden" name="from" value={from} />}
      
      <ValidatedInput
        name="username"
        label="Username"
        placeholder="demo"
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        error={getFieldError('username')}
        required
        aria-describedby="username-help"
        autoComplete="username"
      />
      
      <div id="username-help" className="login-help">
        Enter any username to continue
      </div>

      {submitError && (
        <div className="text-red-600 text-sm mb-4" role="alert">
          {submitError}
        </div>
      )}
      
      <div className="login-actions">
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Signing in..."
          disabled={!isValid && Object.keys(getFieldError('username') || {}).length > 0}
        >
          Login
        </LoadingButton>
      </div>
    </form>
  );
}
