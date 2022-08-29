#!/bin/bash

set -euo pipefail

# clean up container to be able to run the test again with the same container name
cleanup() {
  docker rm cypress || echo "no cypress container to remove"
}
trap cleanup EXIT

DOCKER_COMPOSE_CMD="docker-compose -f ./docker/docker-compose.cypress.yml"

# build the cypress docker image and include all e2e tests
$DOCKER_COMPOSE_CMD build jore4-cypress

# running against the local "yarn dev" version of the UI
$DOCKER_COMPOSE_CMD run \
  --name cypress \
  -e "CYPRESS_BASE_URL=http://host.docker.internal:3300" \
  jore4-cypress yarn test:e2e

# copy the test results to the host machine
# note: this is copying it to the ./cypress/reports folder, the same place
# to where the local runs' reports are placed
docker cp cypress:/e2e/cypress/reports ./cypress/
