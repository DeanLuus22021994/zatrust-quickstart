/**
 * Centralized logging utility to replace scattered console.log statements.
 * Provides consistent logging format and environment-aware debug logging.
 */

export interface LogMeta {
  [key: string]: unknown;
}

export const logger = {
  /**
   * Log informational messages
   */
  info: (message: string, meta?: LogMeta) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[INFO ${timestamp}] ${message}${metaStr}`);
  },

  /**
   * Log error messages with optional error object
   */
  error: (message: string, error?: Error, meta?: LogMeta) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.error(`[ERROR ${timestamp}] ${message}${metaStr}`, error || '');
  },

  /**
   * Log warning messages
   */
  warn: (message: string, meta?: LogMeta) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.warn(`[WARN ${timestamp}] ${message}${metaStr}`);
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
      console.debug(`[DEBUG ${timestamp}] ${message}${metaStr}`);
    }
  }
};