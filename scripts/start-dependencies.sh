#!/usr/bin/env bash

cd "$(dirname "$0")"/.. || exit 1

scripts/development.sh start:deps "$@"
