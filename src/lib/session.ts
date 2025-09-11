/**
 * Centralized session management to standardize cookie handling
 * across authentication routes and components.
 */

import { cookies } from "next/headers";

export const SESSION_CONFIG = {
  cookieName: "demo_user",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  }
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