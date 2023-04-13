#!/bin/bash

set -euo pipefail

cd $(dirname "$0")/..

docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml down
