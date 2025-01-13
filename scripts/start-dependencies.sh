#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-tools#download-docker-bundlesh

cd "$(dirname "$0")"/.. || exit 1

scripts/development.sh start:deps "$@"
