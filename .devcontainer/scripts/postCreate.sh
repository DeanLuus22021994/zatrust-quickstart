#!/usr/bin/env bash
set -euo pipefail

log() { echo "[postCreate] $*"; }

log "Ensuring writable node_modules"
mkdir -p node_modules
if [ ! -w node_modules ]; then
  log "Attempting chown (may be unnecessary)"
  sudo chown -R node:node node_modules || true
fi

log "Installing dependencies (ci -> install fallback)"
if npm ci; then
  log "npm ci succeeded"
else
  log "npm ci failed (likely no lock or mismatch), falling back to npm install"
  npm install
fi

log "Installing Playwright browsers"
npx playwright install --with-deps

if [ "${ENABLE_GH_RUNNER:-false}" = "true" ]; then
  log "ENABLE_GH_RUNNER=true -> starting self-hosted GitHub Actions runner"
  bash .github/scripts/start-runner.sh || { log "Runner startup failed"; exit 1; }
else
  log "GitHub runner disabled (ENABLE_GH_RUNNER!=true)"
fi

log "Done"
