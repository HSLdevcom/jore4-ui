#!/bin/bash

# based on https://github.com/HSLdevcom/jore4-tools#download-docker-bundlesh

set -euo pipefail

DB_CONNECTION_STRING=postgresql://dbadmin:adminpassword@localhost:6432/jore4e2e

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
  $DOCKER_COMPOSE_CMD up -d jore4-auth jore4-testdb jore4-testdb-e2e1 jore4-testdb-e2e2 jore4-testdb-e2e3 jore4-hasura jore4-hasura-e2e1 jore4-hasura-e2e2 jore4-hasura-e2e3 jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching jore4-hastus
}

function seed_infrastructure_links {
  echo "Seeding infrastructure links..."

  SUCCESS=false
  while ! $SUCCESS; do
    echo "Checking if infrstructure link schema exists..."
    if [[ $(psql $DB_CONNECTION_STRING -AXqtc "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'infrastructure_network' AND tablename = 'infrastructure_link');") = "t" ]]; then
      echo "Schema found! Seeding infrastructure links..."
        psql $DB_CONNECTION_STRING < test-db-manager/src/dumps/infraLinks/infraLinks.sql; 
        SUCCESS=true
    fi
    sleep 2
  done

  echo "All done! Happy coding! :)"
}

download_docker_bundle
check_pinned_hasura
start_docker_bundle "${1:-x}"
seed_infrastructure_links
