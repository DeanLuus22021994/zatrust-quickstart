/**
 * Dashboard content component - focuses solely on rendering
 * dashboard UI when user is authenticated.
 */

import type { User } from "@/lib/session";

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <>
      <p>Welcome, {user.username}</p>
      <form action="/api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
        <p>Debug info: Loaded at {new Date().toISOString()}</p>
      </div>
    </>
  );
}

/**
 * Component shown when user is not authenticated
 */
export function UnauthenticatedView() {
  return (
    <div>
      <p>You are not logged in.</p>
      <a href="/login">Go to Login</a>
    </div>
  );
}