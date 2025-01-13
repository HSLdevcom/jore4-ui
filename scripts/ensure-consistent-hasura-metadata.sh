#!/usr/bin/env bash

# A script for checking that Hasura metadata is in a consistent state,
# and if necessary to reload it to (hopefully) fix it.

set -euo pipefail

cd "$(dirname "$0")"/.. || exit 1

HASURA_PASSWORD=$(cat ./docker/secret-hasura-hasura-admin-secret)
FORCE=false
PORT=3201
for param in $@
do
  if [ "$param" = "--e2e" ]
  then
    PORT=3211
  fi
  if [ "$param" = "--force" ]
  then
    FORCE=true
  fi
done

# Check current situation, that is, if metadata needs reloading.
IS_CONSISTENT="false"
if [ $FORCE == false ]; then
  echo "Fetching metadata consistency information from port $PORT..."

  RESPONSE=$(
    curl --header "Content-Type: application/json" \
        --header "x-hasura-admin-secret: $HASURA_PASSWORD" \
        --request POST \
        --data '{"type":"get_inconsistent_metadata","args":{}}' \
        --silent \
        localhost:$PORT/v1/metadata
  )

  # There should be a "is_consistent" field in the response, eg:
  #   "is_consistent": false
  # Parse the boolean value:
  IS_CONSISTENT=$(echo "$RESPONSE" | sed -n 's/.*"is_consistent":[[:space:]]*\([a-z]*\).*/\1/p')

  if [[ "$IS_CONSISTENT" != "false" && "$IS_CONSISTENT" != "true" ]]; then
    echo "Unrecognized value for is_consistent: $IS_CONSISTENT"
    exit 1
  fi
fi

if [ "$IS_CONSISTENT" = "true" ]; then
  echo "Metadata is consistent."
  exit 0
fi

# Metadata is inconsistent: reload should fix it.
echo "Reloading metadata..."
curl --header "Content-Type: application/json" \
     --header "x-hasura-admin-secret: $HASURA_PASSWORD" \
     --request POST \
     --data '{"type":"reload_metadata","args":{"reload_remote_schemas":true,"reload_sources":true}}' \
     --silent \
     localhost:$PORT/v1/metadata
echo ""
echo "Metadata reloaded."
