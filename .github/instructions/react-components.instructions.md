---
applyTo: "src/**/*.tsx"
---

## React Server vs Client Component Instructions

Defaults:
- Server Components by default (no "use client" unless required).
- Add "use client" only for: interactive stateful UI (event handlers), browser APIs, useState/useEffect, or context providers needing client runtime.

Patterns:
1. Keep server boundaries high-level; push interactivity to smallest leaf.
2. Lift data fetching to Server Components; pass serialized props down.
3. Use type-only imports with `import type`.
4. Avoid global mutable singletons; prefer per-request context or parameters.
5. Co-locate small helper functions with component if only used there; otherwise move to src/lib/.
6. Keep components pure (no side effects) except minimal client components managing UI state.

File Guidance:
- Name components PascalCase.
- Export a single primary component per file when possible.
- If adding a client component wrapper around a server component, keep wrapper minimal.

Error / Edge Handling:
- Use route segment error.tsx for recoverable errors.
- Avoid try/catch unless adding domain-specific fallback UI.

Performance:
- Avoid unnecessary "use client".
- Prefer async Server Component + streaming where beneficial.
- Use React.lazy in client space only when truly code-splitting interactive bundles.

Testing Impact:
- Favor server components for easier deterministic E2E (less hydration variance).
- When adding client logic, ensure predictable initial HTML for Playwright assertions.

When Unsure:
- Start server-side; convert to client only if interactivity mandates.