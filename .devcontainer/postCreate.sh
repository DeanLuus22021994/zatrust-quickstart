#!/usr/bin/env bash
# Devcontainer post-create entrypoint (delegates to modular library)
set -euo pipefail
source .devcontainer/scripts/lib.sh
provision_all
