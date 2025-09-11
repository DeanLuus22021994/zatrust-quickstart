/**
 * Centralized session management to standardize cookie handling
 * across authentication routes and components.
 */

import { cookies } from "next/headers";

import { config } from "./config";

export const SESSION_CONFIG = {
  cookieName: config.auth.sessionCookie,
  options: config.security.cookieOptions
} as const;

export interface User {
  username: string;
}

/**
 * Set user session cookie with standardized configuration
 */
export async function setUserSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.cookieName, username, SESSION_CONFIG.options);
}

/**
 * Clear user session cookie
 */
export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.cookieName);
}

/**
 * Get current user session data
 * @returns User object if session exists, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_CONFIG.cookieName);
  
  if (!session?.value) {
    return null;
  }
  
  return { username: session.value };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}