/**
 * Loading state components to improve user experience during async operations.
 * Provides consistent loading indicators and skeleton screens.
 */

import React from "react";

import { config } from "@/lib/config";

/**
 * Loading spinner component with configurable sizes
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className = "",
  "aria-label": ariaLabel = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div 
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * Button with integrated loading state
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ 
  loading = false, 
  loadingText = "Loading...",
  disabled,
  children,
  ...props 
}: LoadingButtonProps) {
  return (
    <button 
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          className="mr-2" 
          aria-label={loadingText}
        />
      )}
      {loading ? loadingText : children}
    </button>
  );
}

/**
 * Skeleton loader for content placeholders
 */
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ 
  className = "",
  width = "100%",
  height = "1rem",
  rounded = false
}: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton text lines for content loading
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`} role="presentation" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i}
          height="0.75rem"
          width={i === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Page loading overlay
 */
interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

export function LoadingOverlay({ 
  message = "Loading...", 
  visible = true 
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label={message}
    >
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" aria-label={message} />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

/**
 * Hook for managing loading states with timeout
 */
export function useLoadingState(initialLoading = false) {
  const [loading, setLoading] = React.useState(initialLoading);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    
    // Auto-timeout after configured duration
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, config.ui.loadingTimeoutMs);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    loading,
    startLoading,
    stopLoading,
    setLoading
  };
}