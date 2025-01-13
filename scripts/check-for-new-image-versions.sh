#!/bin/bash -e
# Verify that the images used for services in docker-compose.custom.yml and docker-compose.e2e.yml use the newest version

cd "$(dirname "$0")"/.. || exit 1

# Find image versions defined in docker-compose files, eg. hsldevcom/jore4-hasura:hsl-main
CUSTOM_DOCKER_IMAGES=($(grep -E "image: ('|\")" docker/docker-compose.custom.yml | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"](.*)--.*['\"]/\1/"))
E2E_DOCKER_IMAGES=($(grep -E "image: ('|\")" docker/docker-compose.e2e.yml | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"](.*)--.*['\"]/\1/"))

for item in "${CUSTOM_DOCKER_IMAGES[@]}"
do
  # Find version in custom yml
  custom_image=$(grep $item docker/docker-compose.custom.yml | grep 'image:' | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"]${item//\//\\/}--(.*)['\"]/\1/")

  # Find version in base docker yml
  newest_image=$(grep $item docker/docker-compose.base.yml | grep 'image:' | sed -r "s/^.*${item//\//\\/}--(.*)\}['\"]/\1/")

  if test "$custom_image" != "$newest_image"; then
    echo -e "\033[31m$item\033[0m does not use newest image in custom.yml, uses \033[31m$custom_image\033[0m newest is \033[32m$newest_image\033[0m"
  fi
done

for item in "${E2E_DOCKER_IMAGES[@]}"
do
  # Find version in e2e yml
  e2e_image=$(grep $item docker/docker-compose.e2e.yml | grep 'image:' | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"]${item//\//\\/}--(.*)['\"]/\1/")

  # Find version in base docker yml
  newest_image=$(grep $item docker/docker-compose.base.yml | grep 'image:' | sed -r "s/^.*${item//\//\\/}--(.*)\}['\"]/\1/")

  if test "$e2e_image" != "$newest_image"; then
    echo -e "\033[31m$item\033[0m does not use newest image in e2e.yml, uses \033[31m$custom_image\033[0m newest is \033[32m$newest_image\033[0m"
  fi
done
