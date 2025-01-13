#!/usr/bin/env bash

cd "$(dirname "$0")"/..

scripts/development.sh start:deps "$@"
