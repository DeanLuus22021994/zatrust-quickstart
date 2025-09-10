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

## Documentation

- **[Technical Debt Analysis](./DEVELOPMENT_DEBT.md)** - Comprehensive analysis of development debt with RAG indicators and improvement roadmap
- **[Technical Debt Summary](./docs/TECHNICAL_DEBT_SUMMARY.md)** - Quick reference for identified issues and priorities

Repo guidance for GitHub Copilot

See `.github/copilot-instructions.md` for conventions and architectural guidance to keep changes DRY, SRP, SOLID, modular, and testable.

Permissions / node_modules note

Previously a named Docker volume was used for `node_modules`. This caused `EACCES` during `npm install` in the Dev Container because the volume root was owned by root. The setup now keeps `node_modules` inside the project bind mount for simplicity. If you need to isolate Linux-only dependencies from the host (e.g. on Windows), you can reintroduce a named volume and add a root-owned chown step before installing dependencies.

## Dev Container Provisioning & Environment Variables

Provisioning is modularized under `.devcontainer/scripts/`:

- `lib.sh` – Shared functions (git identity, safe.directory, dependency install, Playwright, runner)
- `provision.sh` – Single entrypoint invoked via `postCreateCommand` and available manually: `npm run provision`
- `start-runner.sh` – Self-hosted GitHub Actions runner bootstrap (idempotent, supports version pin + SHA256 verification)

Key environment variables (override via Dev Container `containerEnv`, local export, or workflow vars):

| Variable                       | Purpose                                                         | Default                              |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------------ |
| `GIT_USER_NAME`                | Configure global git user.name inside container                 | `DeanLuus22021994`                   |
| `GIT_USER_EMAIL`               | Configure global git user.email inside container                | `dean.luus22021994@gmail.com`        |
| `ENABLE_GH_RUNNER`             | If `true`, attempts to start self-hosted runner on provisioning | `false`                              |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | PAT with repo self-hosted runner registration permissions       | (unset)                              |
| `GITHUB_REPOSITORY`            | Owner/repo slug for runner registration                         | Detected / set in devcontainer.json  |
| `GH_RUNNER_LABELS`             | Comma-separated labels applied to the runner                    | `self-hosted,devcontainer,linux,x64` |
| `GITHUB_RUNNER_VERSION`        | Pin runner version (e.g. `v2.320.0`) or `latest`                | `latest`                             |

Security note: If pinning `GITHUB_RUNNER_VERSION`, the download is verified with published SHA256. For `latest`, the script validates SHA256 when the upstream `.sha256` file is available.

Playwright installation is conditional: if the `tests/` directory is absent, browser binaries are skipped to speed up provisioning.

### Enable self-hosted GitHub Actions runner inside Dev Container

Set in `.devcontainer/devcontainer.json`:

```jsonc
"containerEnv": {
  "GITHUB_REPOSITORY": "owner/repo",
  "GH_RUNNER_LABELS": "self-hosted,devcontainer,linux,x64",
  "ENABLE_GH_RUNNER": "true"
}
```

Export `GITHUB_PERSONAL_ACCESS_TOKEN` (repo scope) before rebuild or add to Dev Container secrets to allow registration.

Re-run provisioning manually:

```bash
npm run provision
```

This is safe to run repeatedly (idempotent operations).

### Self-hosted runner PAT

Instead of setting GITHUB_PERSONAL_ACCESS_TOKEN as an env var, you can place it (first line only) in one of:

- .devcontainer/secrets/github_runner_pat
- .devcontainer/secrets/pat
- .github_runner_pat

The provisioning script auto-loads it. Avoid committing secret files.

## Troubleshooting

### VS Code shows: The path .../node_modules/typescript/lib/tsserver.js doesn't point to a valid tsserver

This can happen if the dependency install was interrupted. The provisioning script now:

- Falls back from `npm ci` to `npm install`
- Cleans `node_modules` and retries if needed
- Reinstalls `typescript` and `eslint` if their expected files are missing

Manual fix:

```bash
rm -rf node_modules package-lock.json
npm install
```

Then reload the window.

### TypeScript tsserver path warning inside Dev Container

If VS Code reports an invalid tsserver path (e.g. /zatrust-quickstart/node_modules/...):
The provisioning now creates a compatibility symlink /zatrust-quickstart -> /workspaces/zatrust-quickstart.
If issues persist:

```bash
npm run provision
rm -rf node_modules/.cache/typescript 2>/dev/null || true
Reload VS Code window
```

### Dual mount to address tsserver path mismatch

A secondary bind mount to /zatrust-quickstart is added in docker-compose to satisfy tools that reference that root path. This avoids tsserver 'invalid install' warnings caused by stale absolute paths inside extension caches.

### Removed root symlink workaround

The earlier attempt to create /zatrust-quickstart symlink was removed (permission issues). Not required for TypeScript resolution.

### JS/TS Language Service crashes

Try:

1. Disable Copilot Chat temporarily
2. Run `npm run doctor` to verify key packages
3. Run `npm run provision` (idempotent)
4. Reload VS Code (`Developer: Reload Window`)
