#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]]; then
  echo "[runner] GITHUB_PERSONAL_ACCESS_TOKEN env var not set. Export and re-run." >&2
  exit 1
fi

REPO="${GITHUB_REPOSITORY:-DeanLuus22021994/zatrust-quickstart}"   # owner/repo
RUNNER_DIR="/tmp/actions-runner"
LABELS="${GH_RUNNER_LABELS:-self-hosted,devcontainer}"

if [[ ! -d "$RUNNER_DIR" ]]; then
  mkdir -p "$RUNNER_DIR"
  cd "$RUNNER_DIR"
  echo "[runner] Downloading latest runner..."
  LATEST_URL=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | grep browser_download_url | grep linux-x64 | cut -d '"' -f4)
  curl -fsSL "$LATEST_URL" -o runner.tar.gz
  tar xzf runner.tar.gz
else
  cd "$RUNNER_DIR"
fi

CONFIGURED_FLAG=".configured"

if [[ ! -f "$CONFIGURED_FLAG" ]]; then
  echo "[runner] Requesting registration token..."
  REG_TOKEN=$(curl -fsSL -H "Authorization: token ${GITHUB_PERSONAL_ACCESS_TOKEN}" -X POST "https://api.github.com/repos/${REPO}/actions/runners/registration-token" | grep token | head -n1 | cut -d '"' -f4)
  echo "[runner] Configuring runner for $REPO with labels: $LABELS"
  ./config.sh --url "https://github.com/${REPO}" --token "$REG_TOKEN" --labels "$LABELS" --unattended --replace
  touch "$CONFIGURED_FLAG"
else
  echo "[runner] Already configured. Skipping config step."
fi

cleanup() {
  echo "[runner] Removing runner";
  if [[ -f config.sh ]]; then
    REG_TOKEN=$(curl -fsSL -H "Authorization: token ${GITHUB_PERSONAL_ACCESS_TOKEN}" -X POST "https://api.github.com/repos/${REPO}/actions/runners/remove-token" | grep token | head -n1 | cut -d '"' -f4 || true)
    if [[ -n "${REG_TOKEN:-}" ]]; then
      ./config.sh remove --token "$REG_TOKEN" --unattended || true
    fi
  fi
}
trap cleanup EXIT

echo "[runner] Starting listener..."
exec ./run.sh
