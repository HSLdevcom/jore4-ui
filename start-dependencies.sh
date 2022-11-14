#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-flux#docker-compose

set -euo pipefail

# initialize package folder
mkdir -p ./docker

function download_docker_bundle {
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
}

function check_pinned_hasura {
  DOCKER_JQ="docker run --rm -i imega/jq"
  DOCKER_YQ="docker run --rm -i mikefarah/yq"
  GREEN='\033[1;32m'
  RED='\033[1;31m'
  NO_COLOR='\033[0m'

  # Find latest image with "seed-main-" tag prefix from docker hub
  dockerHubImageList=$(curl --silent --get -H \"Accept: application/json\" https://hub.docker.com/v2/repositories/hsldevcom/jore4-hasura/tags/\?page_size=100\&page=1\&ordering=last_updated)
  dockerHubTag="$(echo ${dockerHubImageList} | ${DOCKER_JQ} --raw-output 'first(.results[] | select(.name | startswith("seed-main-"))).name')"
  dockerHubImage="hsldevcom/jore4-hasura:${dockerHubTag}"
  echo "Docker hub image: ${dockerHubImage}"

  # Find current tag from values
  localImage="$(cat ./docker/docker-compose.custom.yml | ${DOCKER_YQ} e '.services.jore4-hasura.image')"
  echo "Local image: ${localImage}"

  # Warn the user if the local pinned version differs from the current one
  if [[ "$dockerHubImage" == "$localImage" ]]; then
    echo -e "${GREEN}The pinned hasura image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned hasura image version is different compared to the docker hub version"
    echo -e "You should update the hasura image in 'docker-compose.custom.yml' to: ${dockerHubImage}${NO_COLOR}"
  fi
}

function start_docker_bundle {
  if [[ "${1:-x}" == "--e2e" ]]
  then
    # for e2e tests, no additional changes are made to the compose setup
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.e2e.yml"
    echo $DOCKER_COMPOSE_CMD
  elif [[ "${1:-x}" == "--volume" ]]
  then
    # start the testdb with mounted volume
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.testdb-volume.yml -f ./docker/docker-compose.custom.yml"
    echo $DOCKER_COMPOSE_CMD
  else
    DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml"
    echo $DOCKER_COMPOSE_CMD
  fi

  # start up only services that are needed in local ui development
  $DOCKER_COMPOSE_CMD up -d jore4-auth jore4-testdb jore4-hasura jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching
}

download_docker_bundle
check_pinned_hasura
start_docker_bundle "${1:-x}"
