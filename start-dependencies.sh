#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-flux#docker-compose

set -euo pipefail

# initialize package folder
mkdir -p ./docker

# compare versions
GITHUB_VERSION=$(curl -L https://github.com/HSLdevcom/jore4-flux/releases/download/e2e-docker-compose/RELEASE_VERSION.txt --silent)
LOCAL_VERSION=$(cat ./docker/RELEASE_VERSION.txt || echo "unknown")

# download latest version of the docker-compose package in case it has changed
if [ "$GITHUB_VERSION" != "$LOCAL_VERSION" ]; then
  echo "E2E docker-compose package is not up to date, downloading a new version."
  curl -L https://github.com/HSLdevcom/jore4-flux/releases/download/e2e-docker-compose/e2e-docker-compose.tar.gz --silent | tar -xzf - -C ./docker/
else
  echo "E2E docker-compose package is up to date, no need to download new version."
fi

if [[ "${1:-x}" == "--volume" ]]
then
  # start the testdb with mounted volume
  DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.testdb-volume.yml -f ./docker/docker-compose.custom.yml"
  echo $DOCKER_COMPOSE_CMD
else
  DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml"
  echo $DOCKER_COMPOSE_CMD
fi

# start up only services that are needed in local ui development
$DOCKER_COMPOSE_CMD up -d jore4-auth jore4-testdb jore4-hasura jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching autoheal
