#!/usr/bin/env bash
# Verify that the images used for services in docker-compose.custom.yml and docker-compose.e2e.yml use the same version

set -euo pipefail

# Get all images from e2e
while IFS= read -r e2e_image; do
  # Try to find a matching image in custom
  found_match=false
  while IFS= read -r custom_image; do
    if [[ "$e2e_image" == "$custom_image" ]]; then
      found_match=true
      break
    fi
  done < <(grep -E "image: ('|\")" docker/docker-compose.custom.yml | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"](.*)['\"]/\1/")
  
  if [[ "$found_match" == false ]]; then
    echo "Images do not match between e2e and custom docker compose."
    exit 1
  fi
  
done < <(grep -E "image: ('|\")" docker/docker-compose.e2e.yml | sed -r "s/^[[:space:]]*image:[[:space:]]*['\"](.*)['\"]/\1/")
