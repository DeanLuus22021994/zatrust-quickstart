#!/usr/bin/env bash
# Self-hosted GitHub Actions runner bootstrap (idempotent)
# Responsibilities: obtain binary (with integrity), register runner, start listener.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "${SCRIPT_DIR}/lib.sh"

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
  local url filename sha_url expected_sha
  if [ "$ARCHIVE_TAG" = "latest" ]; then
    url=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | grep browser_download_url | grep linux-x64 | cut -d '"' -f4)
  else
    url="https://github.com/actions/runner/releases/download/${ARCHIVE_TAG}/actions-runner-linux-x64-${ARCHIVE_TAG#v}.tar.gz"
  fi
  filename="${url##*/}"
  sha_url="${url}.sha256"
  log "Downloading runner archive $filename ($ARCHIVE_TAG)"
  curl -fsSL "$url" -o "$filename"
  if curl -fsSL "$sha_url" -o "$filename.sha256" 2>/dev/null; then
    expected_sha=$(cut -d ' ' -f1 "$filename.sha256")
    actual_sha=$(sha256sum "$filename" | cut -d ' ' -f1)
    if [ "$expected_sha" != "$actual_sha" ]; then
      log "SHA256 mismatch for runner archive" >&2
      log "Expected: $expected_sha" >&2
      log "Actual:   $actual_sha" >&2
      exit 1
    fi
    log "SHA256 verified"
  else
    log "No SHA256 file available; proceeding without verification"
  fi
  tar xzf "$filename"
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
