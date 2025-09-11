/**
 * Standardized API error handling utilities to ensure consistent
 * error responses across all API routes.
 */

import { NextResponse } from "next/server";

import { logger } from "./logger";

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Create standardized error response with consistent format
 */
export function createErrorResponse(
  message: string, 
  status: number, 
  details?: unknown
): NextResponse {
  const response: ApiErrorResponse = { error: message };
  if (details) {
    response.details = details;
  }
  
  return NextResponse.json(response, { status });
}

/**
 * Handle API errors with standardized logging and response format
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  logger.error(`${context} failed`, error instanceof Error ? error : new Error(String(error)));
  
  if (error instanceof ValidationError) {
    return createErrorResponse(error.message, 400, {
      field: error.field
    });
  }
  
  if (error instanceof Error) {
    // Log the full error but don't expose internal details in production
    if (process.env.NODE_ENV === 'development') {
      return createErrorResponse("Internal server error", 500, {
        message: error.message,
        stack: error.stack
      });
    }
  }
  
  return createErrorResponse("Internal server error", 500);
}

/**
 * Validate required form fields and throw ValidationError if missing
 */
export function validateRequiredField(
  value: unknown, 
  fieldName: string
): string {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  return value.trim();
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logger.warn("Failed to parse JSON", { jsonString, error });
    return null;
  }
}