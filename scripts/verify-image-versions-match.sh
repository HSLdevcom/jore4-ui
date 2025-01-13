#!/usr/bin/env bash
# Verify that the images used for services in docker-compose.custom.yml and docker-compose.e2e.yml use the same version

set -euo pipefail

# Find image versions defined in docker-compose.e2e.yml, eg. hsldevcom/jore4-hasura:hsl-main
DOCKER_IMAGES_TO_CHECK=($(grep -E "image: ('|\")" docker/docker-compose.e2e.yml | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"](.*)--.*['\"]/\1/"))

for item in "${DOCKER_IMAGES_TO_CHECK[@]}"
do
  # Find version in custom yml
  custom_image=$(grep $item docker/docker-compose.custom.yml | grep 'image:' | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"]${item//\//\\/}--(.*)['\"]/\1/")

  # Find version in e2e yml
  e2e_image=$(grep $item docker/docker-compose.e2e.yml | grep 'image:' | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"]${item//\//\\/}--(.*)['\"]/\1/")

  if test "$custom_image" != "$e2e_image"; then
    echo "$item does not match between e2e and custom docker compose."
    exit 1
  fi
done
