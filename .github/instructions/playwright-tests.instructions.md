---
applyTo: "**/tests/**/*.spec.ts"
---

## Playwright Test Instructions

Follow project principles (DRY, SRP, deterministic).

Guidelines:

1. Prefer getByRole / accessible name; use data-testid only if no stable accessible hook exists.
2. Specs independent; no cross-test state or ordering assumptions.
3. No arbitrary waits; rely on auto-wait + expect matchers.
4. Assertions specific (toHaveText, toBeVisible, etc.).
5. Extract shared auth / navigation helpers into tests/lib when repetition >2.
6. Keep tests fast; avoid unnecessary network interception.
7. One concern per spec file (auth, navigation, profile, etc.).
8. On adding protected routes, extend coverage.

Style:

- Use test.describe only for logical grouping.
- Name tests by user-observable outcome.
- Helpers pure and typed.

Maintenance:

- Remove flaky constructs immediately.
- Update selectors when aria labels / routes change.
