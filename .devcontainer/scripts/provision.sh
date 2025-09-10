#!/usr/bin/env bash
# Devcontainer provisioning entrypoint (delegates to modular library functions)
# Idempotent and safe to re-run.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib.sh"
provision_all
