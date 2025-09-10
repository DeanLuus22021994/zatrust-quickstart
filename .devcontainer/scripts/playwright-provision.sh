#!/usr/bin/env bash
# Idempotent Playwright provisioning (browsers + OS deps) for devcontainer / CI.
# Safe for repeated invocation. Uses versioned marker files to skip redundant work
# unless FORCE=1 is set. Supports optional PW_BROWSERS env (default: chromium firefox webkit).
set -euo pipefail

LOG_PREFIX="[playwright:provision]"
log() { printf '%s %s\n' "$LOG_PREFIX" "$*"; }

usage() {
  cat <<'EOF'
Playwright Provision Script
Ensures required OS dependencies and browsers are installed.

Environment:
  PW_BROWSERS   Space-separated list (default: "chromium firefox webkit")
  FORCE=1       Force re-install even if version marker present
  PLAYWRIGHT_CACHE_DIR  Override cache dir (default: "$HOME/.cache/ms-playwright")

Markers:
  Browsers: <cache>/.provisioned-<playwrightVersion>
  Deps:     /var/lib/.playwright-deps-<playwrightVersion> (root only)

Usage:
  bash .devcontainer/scripts/playwright-provision.sh
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage; exit 0;
fi

require_cmd() { command -v "$1" >/dev/null 2>&1 || { log "Missing command: $1"; exit 1; }; }
for c in node npm npx; do require_cmd "$c"; done

# Ensure dependency package is installed (in case user pruned node_modules)
if [ ! -d node_modules/@playwright/test ]; then
  log "@playwright/test not found -> installing (dev dependency)"
  npm install --no-audit --no-fund --save-dev @playwright/test >/dev/null 2>&1 || npm install --no-audit --no-fund --save-dev @playwright/test
fi

current_version="$(node -p 'require("@playwright/test/package.json").version' 2>/dev/null || echo unknown)"
cache_dir="${PLAYWRIGHT_CACHE_DIR:-$HOME/.cache/ms-playwright}"
mkdir -p "$cache_dir"
browser_marker="$cache_dir/.provisioned-$current_version"
deps_marker="/var/lib/.playwright-deps-$current_version"

FORCE="${FORCE:-0}"
PW_BROWSERS="${PW_BROWSERS:-chromium firefox webkit}"

log "Playwright version: $current_version"
log "Requested browsers: $PW_BROWSERS"

install_deps() {
  if [ -f "$deps_marker" ] && [ "$FORCE" != "1" ]; then
    log "OS dependencies already satisfied (marker present)"
    return 0
  fi
  if command -v apt-get >/dev/null 2>&1; then
    if [ "$(id -u)" -eq 0 ]; then
      log "Installing / updating Playwright OS dependencies"
      if npx --yes playwright install-deps >/dev/null 2>&1; then
        touch "$deps_marker" || true
        log "OS deps ok"
      else
        log "install-deps encountered errors (continuing)"
      fi
    else
      if command -v sudo >/dev/null 2>&1; then
        log "Attempting sudo playwright install-deps"
        if sudo npx --yes playwright install-deps >/dev/null 2>&1; then
          sudo touch "$deps_marker" || true
          log "OS deps ok (sudo)"
        else
          log "sudo install-deps failed (non-fatal)"
        fi
      else
        log "Not root and sudo missing -> skipping OS deps"
      fi
    fi
  else
    log "Non-apt system -> relying on 'playwright install --with-deps' fallback"
  fi
}

install_browsers() {
  if [ -f "$browser_marker" ] && [ "$FORCE" != "1" ]; then
    log "Browsers already provisioned for version $current_version"
    return 0
  fi
  log "Installing browsers: $PW_BROWSERS"
  if ! npx --yes playwright install $PW_BROWSERS; then
    log "Browser install failed -> retrying once"
    npx --yes playwright install $PW_BROWSERS
  fi
  touch "$browser_marker" || true
  log "Browser install complete"
}

install_deps
install_browsers
log "Provisioning finished"
