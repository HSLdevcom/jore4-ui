#!/bin/bash

set -euo pipefail

docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml down
