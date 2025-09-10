"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="error-container">
      <h1>Something went wrong!</h1>
      <p>An error occurred while loading this page.</p>
      <details className="error-details">
        <summary>Error Details</summary>
        <pre>{error.message}</pre>
        {error.digest && <p>Error ID: {error.digest}</p>}
      </details>
      <button onClick={() => reset()}>Try again</button>
      <a href="/login">Go to Login</a>
    </main>
  );
}