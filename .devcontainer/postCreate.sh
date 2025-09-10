#!/usr/bin/env bash
# Devcontainer post-create provisioning script
# Idempotent: safe to re-run.
set -euo pipefail

log() { printf "[postCreate] %s\n" "$*"; }

# 1. Configure global git identity (persisted in container layer)
GIT_NAME="DeanLuus22021994"
GIT_EMAIL="dean.luus22021994@gmail.com"
CURRENT_NAME="$(git config --global user.name || true)"
CURRENT_EMAIL="$(git config --global user.email || true)"
if [ "$CURRENT_NAME" != "$GIT_NAME" ]; then
  log "Setting git user.name -> $GIT_NAME"
  git config --global user.name "$GIT_NAME"
else
  log "git user.name already set ($CURRENT_NAME)"
fi
if [ "$CURRENT_EMAIL" != "$GIT_EMAIL" ]; then
  log "Setting git user.email -> $GIT_EMAIL"
  git config --global user.email "$GIT_EMAIL"
else
  log "git user.email already set ($CURRENT_EMAIL)"
fi

# 2. Suppress safe.directory warnings (allow any path inside container)
if ! git config --global --get-all safe.directory | grep -q "^\*$"; then
  log "Adding wildcard safe.directory entry"
  git config --global --add safe.directory '*'
fi

# 3. Install Node dependencies (prefer clean, fallback to install)
if [ -f package-lock.json ]; then
  log "Running npm ci (with fallback)"
  if ! npm ci --no-audit --no-fund; then
    log "npm ci failed; falling back to npm install"
    npm install --no-audit --no-fund
  fi
else
  log "No lockfile found, running npm install"
  npm install --no-audit --no-fund
fi

# 4. Install Playwright browsers (skip if already present)
if [ ! -d /home/node/.cache/ms-playwright ]; then
  log "Installing Playwright browsers"
  npx --yes playwright install --with-deps chromium
else
  log "Playwright browsers already installed"
fi

# 5. Optional: start self-hosted GitHub Actions runner
if [ "${ENABLE_GH_RUNNER:-false}" = "true" ]; then
  if [ -n "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]; then
    log "ENABLE_GH_RUNNER=true and token present; starting runner registration"
    bash .github/scripts/start-runner.sh || log "Runner script exited (check logs)"
  else
    log "ENABLE_GH_RUNNER=true but GITHUB_PERSONAL_ACCESS_TOKEN not set; skipping runner startup"
  fi
else
  log "Self-hosted runner disabled (ENABLE_GH_RUNNER=false)"
fi

log "Post-create provisioning complete."
