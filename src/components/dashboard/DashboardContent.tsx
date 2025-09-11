/**
 * Dashboard content component - focuses solely on rendering
 * dashboard UI when user is authenticated.
 * 
 * Following Single Responsibility Principle (SRP), this component
 * is only responsible for presenting the dashboard content.
 * 
 * @example
 * ```tsx
 * <DashboardContent user={{ username: "john_doe" }} />
 * ```
 */

"use client";

import React from "react";

import type { User } from "@/lib/session";

import { config } from "@/lib/config";

/**
 * Props for the DashboardContent component
 */
interface DashboardContentProps {
  /** Authenticated user object containing user information */
  user: User;
}

/**
 * Main dashboard content component with enhanced logout functionality
 */
export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}</h1>
        <p className="text-gray-600">You have successfully accessed the dashboard.</p>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-actions">
          <form method="POST" action="/api/auth/logout">
            <button
              type="submit"
              className="logout-button"
            >
              Logout
            </button>
          </form>
        </section>

        <section className="dashboard-info">
          <details className="debug-info">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Debug Information
            </summary>
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              <p>User: {user.username}</p>
              <p>Session: Active</p>
              <p>Loaded: {new Date().toISOString()}</p>
              <p>Version: {config.app.version}</p>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}

/**
 * Component shown when user is not authenticated.
 * Provides clear guidance for unauthenticated users.
 */
export function UnauthenticatedView() {
  return (
    <div className="unauthenticated-view">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Authentication Required
        </h2>
        <p className="text-gray-600">
          You need to be logged in to access this page.
        </p>
        <a 
          href={config.auth.loginPath}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}