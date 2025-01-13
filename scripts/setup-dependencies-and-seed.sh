#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"/.. || exit 1

scripts/development.sh setup:env "$@"

