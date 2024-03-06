#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-tools#download-docker-bundlesh

set -euo pipefail

INCLUDE_E2E=true
USE_VOLUME=false
for param in $@
do
  if [ "$param" = "--volume" ]
  then
    USE_VOLUME=true
  fi
  if [ "$param" = "--skip-e2e" ]
  then
    INCLUDE_E2E=false
  fi
done

cd $(dirname "$0")/..

if ! command -v gh; then
  echo "Please install the github gh tool on your machine."
  exit 1
fi

# initialize package folder
mkdir -p ./docker

function download_docker_bundle {
  echo "Downloading latest version of E2E docker-compose package..."
  curl https://raw.githubusercontent.com/HSLdevcom/jore4-tools/main/docker/download-docker-bundle.sh | bash
}

function check_pinned_hasura {
  DOCKER_JQ="docker run --rm -i imega/jq"
  DOCKER_YQ="docker run --rm -i mikefarah/yq"
  GREEN='\033[1;32m'
  RED='\033[1;31m'
  NO_COLOR='\033[0m'

  # Find latest image with "hsl-main-" tag prefix from docker hub
  dockerHubHasuraImageList=$(curl --silent --get -H \"Accept: application/json\" https://hub.docker.com/v2/repositories/hsldevcom/jore4-hasura/tags/\?page_size=100\&page=1\&ordering=last_updated)
  dockerHubTag="$(echo ${dockerHubHasuraImageList} | ${DOCKER_JQ} --raw-output 'first(.results[] | select(.name | startswith("hsl-main-"))).name')"
  dockerHubHasuraImage="hsldevcom/jore4-hasura:${dockerHubTag}"
  echo "Docker hub image: ${dockerHubHasuraImage}"

  # Find current tag from values
  localHasuraImage="$(cat ./docker/docker-compose.custom.yml | ${DOCKER_YQ} e '.services.jore4-hasura.image')"
  echo "Local image: ${localHasuraImage}"

  # Warn the user if the local pinned version differs from the current one
  if [[ "$dockerHubHasuraImage" == "$localHasuraImage" ]]; then
    echo -e "${GREEN}The pinned hasura image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned hasura image version is different compared to the docker hub version"
    echo -e "You should update the hasura image in 'docker-compose.custom.yml' to: ${dockerHubHasuraImage}${NO_COLOR}"
  fi
}

function start_docker_bundle {
  if [ "$USE_VOLUME" = true ]; then
    # start the testdb with mounted volume
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.testdb-volume.yml -f ./docker/docker-compose.custom.yml"
    echo $DOCKER_COMPOSE_CMD
  else
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml"
    echo $DOCKER_COMPOSE_CMD
  fi

  # start up only services that are needed in local ui development
  e2eServices=""
  $DOCKER_COMPOSE_CMD up -d jore4-auth jore4-testdb jore4-hasura ${e2eServices} jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching jore4-hastus jore4-tiamat jore4-timetablesapi
}

download_docker_bundle
check_pinned_hasura
start_docker_bundle "${1:-x}"
./scripts/seed-infrastructure-links.sh testdb &
wait
