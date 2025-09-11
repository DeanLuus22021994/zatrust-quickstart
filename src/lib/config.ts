/**
 * Centralized application configuration to eliminate hard-coded values
 * scattered throughout the codebase.
 */

/**
 * Application configuration object with type safety
 */
export const config = {
  app: {
    name: "Zatrust Quickstart",
    description: "A minimal, modular Next.js (TypeScript) starter",
    defaultRedirect: "/dashboard",
    version: process.env.npm_package_version || "0.1.0"
  },

  auth: {
    sessionCookie: "demo_user",
    redirectParam: "from",
    protectedPrefixes: ["/dashboard", "/profile"],
    loginPath: "/login",
    homePath: "/"
  },

  api: {
    timeout: 30000,
    retries: 3,
    maxRequestSize: "1mb",
    responseHeaders: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block"
    }
  },

  logging: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    includeTimestamp: true,
    enableDebugInDevelopment: process.env.NODE_ENV === "development",
    enableConsoleInProduction: false
  },

  validation: {
    username: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/
    },
    email: {
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      minLength: 8,
      maxLength: 128
    },
    name: {
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/
    }
  },

  security: {
    cookieOptions: {
      httpOnly: true,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production"
    },
    allowedRedirectPatterns: [
      /^\/[A-Za-z0-9_\-./?&=,%]*$/
    ],
    csrfProtection: process.env.NODE_ENV === "production",
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  },

  ui: {
    debounceMs: 300,
    loadingTimeoutMs: 30000,
    animationDuration: 200,
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    }
  },

  development: {
    enableHotReload: process.env.NODE_ENV === "development",
    enableDebugRoutes: process.env.NODE_ENV === "development",
    verboseLogging: process.env.NODE_ENV === "development"
  }
} as const;

/**
 * Type-safe configuration getter with default fallback
 */
export function getConfig<T extends keyof typeof config>(
  section: T
): typeof config[T] {
  return config[section];
}

/**
 * Environment-specific configuration helpers
 */
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

/**
 * Feature flags for progressive enhancement
 */
export const features = {
  enableClientValidation: true,
  enableLoadingStates: true,
  enableOfflineMode: false,
  enableAnalytics: isProduction,
  enableErrorReporting: isProduction
} as const;

/**
 * Build-time constants
 */
export const buildInfo = {
  buildTime: new Date().toISOString(),
  environment: process.env.NODE_ENV || "development"
} as const;