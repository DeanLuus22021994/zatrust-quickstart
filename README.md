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
- One command (PowerShell):
  - `docker compose up -d dev`
  - Then: "Dev Containers: Reopen in Container" in VS Code (or it auto-detects)

App scripts

- `npm run dev` – start Next.js dev server on http://localhost:3000
- `npm run build` – build
- `npm run start` – run production build
- `npm run lint` – lint with ESLint
- `npm run typecheck` – TypeScript check
- `npm run test:e2e` – run Playwright tests

Auth note

This starter uses a minimal cookie-based demo auth to keep dependencies low. For production, replace with NextAuth or your IdP. E2E tests cover the happy path.

Repo guidance for GitHub Copilot

See `.github/copilot-instructions.md` for conventions and architectural guidance to keep changes DRY, SRP, SOLID, modular, and testable.
