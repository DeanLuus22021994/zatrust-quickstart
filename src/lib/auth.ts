// Auth utility helpers (sanitization, validation) to keep route handlers lean.

/**
 * Very small whitelist validation for internal redirect destinations.
 * Only allow same-origin, absolute path starting with single slash.
 * Disallow protocol indicators (:") and protocol-relative (//) to avoid open redirects.
 */
export function sanitizeRedirectPath(
  raw: unknown,
  fallback: string = "/dashboard"
): string {
  if (typeof raw !== "string") return fallback;
  const value = raw.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback; // protocol-relative prevention
  if (value.includes("://")) return fallback; // absolute URL attempt
  // Basic allow-list of characters (path + query) – tighten as needed.
  const valid = /^[A-Za-z0-9_\-./?&=,%]*$/.test(value);
  if (!valid) return fallback;
  return value || fallback;
}

export function validateUsername(raw: unknown): { ok: boolean; value: string } {
  if (typeof raw !== "string") return { ok: false, value: "" };
  const value = raw.trim();
  if (!value) return { ok: false, value: "" };
  // Additional rules could be added here (length, charset, etc.)
  return { ok: true, value };
}
