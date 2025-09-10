# Zatrust Quickstart

A minimal, modular Next.js (TypeScript) starter focused on:

- E2E testability (Playwright)
- DRY, SRP, SOLID
- Low-code patterns
- Modular structure

Includes:

- Landing page (`/`)
- Login (`/login`) with simple cookie-based demo auth
- Dashboard (`/dashboard`) protected by middleware
- One-command Dev Container via Docker Compose

Quick start

- Prerequisites: Docker Desktop, VS Code + Dev Containers extension
- Recommended: Use VS Code "Reopen in Container" (auto-detects)
- One command (PowerShell) for detached dev infra:
  - `docker compose up -d dev`
  - VS Code will forward container port 3000 to an available host port if 3000 is busy.

App scripts

- `npm run dev` – starts dev server on first free port >= 3000 (prints chosen port). Accepts `-p <port>` to require a specific port (errors if unavailable).
- `npm run dev:fixed` – force dev server on port 3000 (may conflict if already in use)
- (Standalone compose only) Uncomment ports in `docker-compose.yml` to explicitly map host ports
- `WEB_PORT=3100 docker compose up -d dev` – example explicit host port mapping (when ports are uncommented)
- `npm run build` – build
- `npm run start` – run production build (uses PORT env or 3000)
- `npm run lint` – lint with ESLint
- `npm run typecheck` – TypeScript check
- `npm run test:e2e` – run Playwright tests

Auth note

This starter uses a minimal cookie-based demo auth to keep dependencies low. For production, replace with NextAuth or your IdP. E2E tests cover the happy path.

Repo guidance for GitHub Copilot

See `.github/copilot-instructions.md` for conventions and architectural guidance to keep changes DRY, SRP, SOLID, modular, and testable.

Permissions / node_modules note

Previously a named Docker volume was used for `node_modules`. This caused `EACCES` during `npm install` in the Dev Container because the volume root was owned by root. The setup now keeps `node_modules` inside the project bind mount for simplicity. If you need to isolate Linux-only dependencies from the host (e.g. on Windows), you can reintroduce a named volume and add a root-owned chown step before installing dependencies.
