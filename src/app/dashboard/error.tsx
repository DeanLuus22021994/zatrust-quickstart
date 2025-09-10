"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error specifically for dashboard
    console.error("Dashboard error:", error);
    
    // Report to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // In a real app, you'd send this to your monitoring service
      console.error("DASHBOARD_LOAD_ERROR", {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  return (
    <main className="error-container">
      <h1>Dashboard Error</h1>
      <p>Failed to load the dashboard. This might be the ERR_FAILED issue.</p>
      <details className="error-details">
        <summary>Error Details</summary>
        <pre>{error.message}</pre>
        {error.digest && <p>Error ID: {error.digest}</p>}
        <p>Timestamp: {new Date().toISOString()}</p>
      </details>
      <div className="error-actions">
        <button onClick={() => reset()}>Try again</button>
        <a href="/login">Back to Login</a>
        <a href="/">Home</a>
      </div>
    </main>
  );
}