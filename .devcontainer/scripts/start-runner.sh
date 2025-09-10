#!/usr/bin/env bash
# Self-hosted GitHub Actions runner bootstrap (uses lib functions for logging)
set -euo pipefail
source .devcontainer/scripts/lib.sh

if [ -z "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]; then
  log "GITHUB_PERSONAL_ACCESS_TOKEN not set; aborting" >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-DeanLuus22021994/zatrust-quickstart}"
RUNNER_DIR="${GITHUB_RUNNER_WORKDIR:-/tmp/actions-runner}"
LABELS="${GH_RUNNER_LABELS:-self-hosted,devcontainer}"
ARCHIVE_TAG="${GITHUB_RUNNER_VERSION:-latest}" # allow pinning e.g. v2.320.0

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

download_runner() {
  local url
  if [ "$ARCHIVE_TAG" = "latest" ]; then
    url=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | grep browser_download_url | grep linux-x64 | cut -d '"' -f4)
  else
    url="https://github.com/actions/runner/releases/download/${ARCHIVE_TAG}/actions-runner-linux-x64-${ARCHIVE_TAG#v}.tar.gz"
  fi
  log "Downloading runner ($ARCHIVE_TAG)"
  curl -fsSL "$url" -o runner.tar.gz
  tar xzf runner.tar.gz
  touch .downloaded
}

[ -f .downloaded ] || download_runner

if [ ! -f .configured ]; then
  log "Requesting registration token"
  REG_TOKEN=$(curl -fsSL -H "Authorization: token ${GITHUB_PERSONAL_ACCESS_TOKEN}" -X POST "https://api.github.com/repos/${REPO}/actions/runners/registration-token" | grep token | head -n1 | cut -d '"' -f4)
  log "Configuring runner for $REPO labels=$LABELS"
  ./config.sh --url "https://github.com/${REPO}" --token "$REG_TOKEN" --labels "$LABELS" --unattended --replace
  touch .configured
else
  log "Already configured"
fi

cleanup() {
  log "Deregistering runner"
  if [ -f config.sh ]; then
    REG_TOKEN=$(curl -fsSL -H "Authorization: token ${GITHUB_PERSONAL_ACCESS_TOKEN}" -X POST "https://api.github.com/repos/${REPO}/actions/runners/remove-token" | grep token | head -n1 | cut -d '"' -f4 || true)
    if [ -n "${REG_TOKEN:-}" ]; then
      ./config.sh remove --token "$REG_TOKEN" --unattended || true
    fi
  fi
}
trap cleanup EXIT

log "Starting runner"
exec ./run.sh
