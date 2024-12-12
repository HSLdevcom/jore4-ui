#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-tools#download-docker-bundlesh

cd $(dirname "$0")/..
scripts/development.sh start:deps "$@"

