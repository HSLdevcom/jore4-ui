#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-flux#docker-compose

set -euo pipefail

if ! command -v gh; then
  echo "Please install the github gh tool on your machine."
  exit 1
fi

# initialize package folder
mkdir -p ./docker/update

function download_docker_bundle {
  echo "Downloading latest version of E2E docker-compose package..."
  gh auth status || gh auth login

  # gh cannot overwrite existing files, therefore first download into separate dir. This way we still have the old copy
  # in case the download fails
  rm -rf ./docker/update/*
  gh release download e2e-docker-compose --repo HSLdevcom/jore4-flux --dir ./docker/update
  cp -R ./docker/update/* ./docker
}

function check_pinned_hasura {
  DOCKER_JQ="docker run --rm -i imega/jq"
  DOCKER_YQ="docker run --rm -i mikefarah/yq"
  GREEN='\033[1;32m'
  RED='\033[1;31m'
  NO_COLOR='\033[0m'

  # Find latest image with "seed-main-" tag prefix from docker hub
  dockerHubImageList=$(curl --silent --get -H \"Accept: application/json\" https://hub.docker.com/v2/repositories/hsldevcom/jore4-hasura/tags/\?page_size=100\&page=1\&ordering=last_updated)
  dockerHubSeedTag="$(echo "${dockerHubImageList}" | ${DOCKER_JQ} --raw-output 'first(.results[] | select(.name | startswith("seed-main-"))).name')"
  dockerHubSeedImage="hsldevcom/jore4-hasura:${dockerHubSeedTag}"
  dockerHubHSLTag="$(echo "${dockerHubImageList}" | ${DOCKER_JQ} --raw-output 'first(.results[] | select(.name | startswith("hsl-main-"))).name')"
  dockerHubHSLImage="hsldevcom/jore4-hasura:${dockerHubHSLTag}"
  echo "Docker hub seed image: ${dockerHubSeedImage}"
  echo "Docker hub HSL image: ${dockerHubHSLImage}"

  # Find current seed image tag from values
  localSeedImage="$(${DOCKER_YQ} e '.services.jore4-hasura.image'<./docker/docker-compose.custom.yml)"
  echo "Local seed image: ${localSeedImage}"

  # Find current HSL image tag from values
  localHSLImage="$(${DOCKER_YQ} e '.services.jore4-hasura.image'<./docker/docker-compose.e2e.yml)"
  echo "Local HSL image: ${localHSLImage}"

  # Warn the user if the local pinned seed image version differs from the current one
  if [[ "$dockerHubSeedImage" == "$localSeedImage" ]]; then
    echo -e "${GREEN}The pinned hasura seed image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned hasura seed image version is different compared to the docker hub version"
    echo -e "You should update the hasura seed image in 'docker-compose.custom.yml' to: ${dockerHubSeedImage}${NO_COLOR}"
  fi

  # Warn the user if the local pinned HSL image version differs from the current one
  if [[ "$dockerHubHSLImage" == "$localHSLImage" ]]; then
    echo -e "${GREEN}The pinned hasura HSL image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned hasura HSL image version is different compared to the docker hub version"
    echo -e "You should update the hasura image in 'docker-compose.e2e.yml' to: ${dockerHubHSLImage}${NO_COLOR}"
  fi
}

function start_docker_bundle {
  if [[ "${1:-x}" == "--e2e" ]]
  then
    # for e2e tests, no additional changes are made to the compose setup
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.e2e.yml"
    echo "$DOCKER_COMPOSE_CMD"
  elif [[ "${1:-x}" == "--volume" ]]
  then
    # start the testdb with mounted volume
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.testdb-volume.yml -f ./docker/docker-compose.custom.yml"
    echo "$DOCKER_COMPOSE_CMD"
  else
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml"
    echo "$DOCKER_COMPOSE_CMD"
  fi

  # start up only services that are needed in local ui development
  $DOCKER_COMPOSE_CMD up -d jore4-auth jore4-testdb jore4-hasura jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching
}

download_docker_bundle
check_pinned_hasura
start_docker_bundle "${1:-x}"
