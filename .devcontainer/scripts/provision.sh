#!/usr/bin/env bash
# Devcontainer provisioning entrypoint
# Thin wrapper around functions in lib.sh (maintains SRP & DRY)
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "${SCRIPT_DIR}/lib.sh"
provision_all
