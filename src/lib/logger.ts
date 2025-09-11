/**
 * Centralized logging utility to replace scattered console.log statements.
 * Provides consistent logging format and environment-aware debug logging.
 * 
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger';
 * 
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Database connection failed', error);
 * logger.debug('Debug info', { data: complexObject });
 * ```
 */

import { config } from "./config";

/**
 * Metadata object for structured logging
 */
export interface LogMeta {
  [key: string]: unknown;
}

/**
 * Log level enumeration for type safety
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Format log message with timestamp and metadata
 */
function formatLogMessage(level: LogLevel, message: string, meta?: LogMeta): string {
  const timestamp = config.logging.includeTimestamp ? new Date().toISOString() : '';
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  const timestampStr = timestamp ? ` ${timestamp}` : '';
  
  return `[${level.toUpperCase()}${timestampStr}] ${message}${metaStr}`;
}

/**
 * Centralized logger with consistent formatting and environment awareness
 */
export const logger = {
  /**
   * Log informational messages for general application flow
   * @param message - The log message
   * @param meta - Optional structured metadata
   */
  info: (message: string, meta?: LogMeta): void => {
    console.log(formatLogMessage('info', message, meta));
  },

  /**
   * Log error messages with optional error object
   * @param message - The error message
   * @param error - Optional error object for stack trace
   * @param meta - Optional structured metadata
   */
  error: (message: string, error?: Error, meta?: LogMeta): void => {
    console.error(formatLogMessage('error', message, meta), error || '');
  },

  /**
   * Log warning messages for potentially problematic situations
   * @param message - The warning message
   * @param meta - Optional structured metadata
   */
  warn: (message: string, meta?: LogMeta): void => {
    console.warn(formatLogMessage('warn', message, meta));
  },

  /**
   * Log debug messages (only in development environment)
   * Useful for detailed debugging information that should not appear in production
   * @param message - The debug message
   * @param meta - Optional structured metadata
   */
  debug: (message: string, meta?: LogMeta): void => {
    if (config.logging.enableDebugInDevelopment) {
      console.debug(formatLogMessage('debug', message, meta));
    }
  },

  /**
   * Create a child logger with consistent context
   * @param context - Context string to prepend to all messages
   * @returns Logger with context
   */
  withContext: (context: string) => ({
    info: (message: string, meta?: LogMeta) => logger.info(`[${context}] ${message}`, meta),
    error: (message: string, error?: Error, meta?: LogMeta) => logger.error(`[${context}] ${message}`, error, meta),
    warn: (message: string, meta?: LogMeta) => logger.warn(`[${context}] ${message}`, meta),
    debug: (message: string, meta?: LogMeta) => logger.debug(`[${context}] ${message}`, meta)
  })
};