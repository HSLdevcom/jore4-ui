#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"/..

scripts/development.sh setup:env "$@"

