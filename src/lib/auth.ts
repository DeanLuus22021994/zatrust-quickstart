// Auth utility helpers (sanitization, validation) to keep route handlers lean.

import { config } from "./config";

/**
 * Very small whitelist validation for internal redirect destinations.
 * Only allow same-origin, absolute path starting with single slash.
 * Disallow protocol indicators (:") and protocol-relative (//) to avoid open redirects.
 */
export function sanitizeRedirectPath(
  raw: unknown,
  fallback: string = config.app.defaultRedirect
): string {
  if (typeof raw !== "string") return fallback;
  const value = raw.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback; // protocol-relative prevention
  if (value.includes("://")) return fallback; // absolute URL attempt
  
  // Use centralized validation pattern
  const isValid = config.security.allowedRedirectPatterns.some(pattern => 
    pattern.test(value)
  );
  
  if (!isValid) return fallback;
  return value || fallback;
}

/**
 * @deprecated Use validation utilities from @/lib/validation instead
 */
export function validateUsername(raw: unknown): { ok: boolean; value: string } {
  if (typeof raw !== "string") return { ok: false, value: "" };
  const value = raw.trim();
  if (!value) return { ok: false, value: "" };
  
  // Use centralized validation rules
  const rules = config.validation.username;
  if (value.length < rules.minLength || value.length > rules.maxLength) {
    return { ok: false, value: "" };
  }
  if (!rules.pattern.test(value)) {
    return { ok: false, value: "" };
  }
  
  return { ok: true, value };
}
