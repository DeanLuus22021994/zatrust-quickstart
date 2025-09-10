#!/usr/bin/env bash
###############################################################################
# Dev Container Provisioning Library
#
# Responsibilities (SRP): Provide reusable, idempotent helper functions consumed
# by thin orchestration scripts (provision.sh, start-runner.sh).
#
# Principles: DRY (shared logic centralized), SRP (each function clear purpose),
# small composable units.
###############################################################################
set -euo pipefail

LOG_PREFIX="[devcontainer]"
log() { printf '%s %s\n' "$LOG_PREFIX" "$*"; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { log "Missing required command: $1" >&2; exit 1; }
}

check_requirements() {
  for c in git npm curl tar sha256sum; do
    require_cmd "$c"
  done
}

# ---------- Git Configuration ----------

ensure_git_identity() {
  local name email
  name="${GIT_USER_NAME:-DeanLuus22021994}"
  email="${GIT_USER_EMAIL:-dean.luus22021994@gmail.com}"
  if [ "$(git config --global user.name || true)" != "$name" ]; then
    log "Configuring git user.name=$name"
    git config --global user.name "$name"
  else
    log "git user.name already $name"
  fi
  if [ "$(git config --global user.email || true)" != "$email" ]; then
    log "Configuring git user.email=$email"
    git config --global user.email "$email"
  else
    log "git user.email already $email"
  fi
}

configure_git_safe_directory() {
  if ! git config --global --get-all safe.directory | grep -q '^\*$'; then
    log "Adding git safe.directory '*'"
    git config --global --add safe.directory '*'
  else
    log "git safe.directory wildcard present"
  fi
}

install_node_dependencies() {
  if [ -f package-lock.json ]; then
    log "npm ci (fallback to install)"
    if ! npm ci --no-audit --no-fund; then
      log "npm ci failed -> attempting clean recovery"
      rm -rf node_modules
      if ! npm install --no-audit --no-fund; then
        log "npm install failed -> removing lockfile and retrying fresh"
        rm -f package-lock.json
        npm install --no-audit --no-fund
      fi
    fi
  else
    log "No lockfile -> npm install"
    npm install --no-audit --no-fund
  fi
  # Post-install sanity checks for TypeScript / ESLint resolution
  if [ ! -f node_modules/typescript/lib/tsserver.js ]; then
    log "TypeScript tsserver missing -> reinstalling typescript"
    npm install --no-audit --no-fund typescript@latest
  fi
  if [ ! -d node_modules/eslint ]; then
    log "ESLint missing -> reinstalling eslint"
    npm install --no-audit --no-fund eslint@latest
  fi
}

install_playwright() {
  if [ ! -d tests ]; then
    log "No tests/ directory -> skipping Playwright install"
    return 0
  fi
  local cache_dir="/home/node/.cache/ms-playwright"
  if [ ! -d "$cache_dir" ]; then
    log "Installing Playwright browsers (chromium)"
    npx --yes playwright install --with-deps chromium
  else
    log "Playwright cache present"
  fi
}

start_github_runner() {
  if [ "${ENABLE_GH_RUNNER:-false}" != "true" ]; then
    log "GitHub runner disabled (ENABLE_GH_RUNNER=false)"
    return 0
  fi
  if [ -z "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]; then
    log "Runner enabled but GITHUB_PERSONAL_ACCESS_TOKEN unset -> skipping"
    return 0
  fi
  log "Starting self-hosted GitHub Actions runner"
  bash .devcontainer/scripts/start-runner.sh || log "Runner script exited (non-critical)"
}

provision_all() {
  check_requirements
  ensure_git_identity
  configure_git_safe_directory
  install_node_dependencies
  install_playwright
  start_github_runner
  log "Provisioning complete"
}
