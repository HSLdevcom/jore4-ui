#!/bin/bash

function usage {

  SCRIPT_NAME=$(basename "$0")
  echo "
  Usage $SCRIPT_NAME <route-label> <dump-file> <target-json-file>

  <route-label> is the label of the route to search the ids for

  <dump-file> is the .sql dump from where to search the route definition

  <target-json-file> is the target file where to write the result
  "
}

if [[ -z "$3" ]]; then
  usage
  exit
fi

cd $(dirname "$0")/..

INBOUND_ROUTE_ID=$(grep -E "[[:space:]]$1[[:space:]]" $2 | grep -E "[[:space:]]2050-" | grep -E "[[:space:]]inbound[[:space:]]" | cut -f1)
INBOUND_JP_ID=$(grep -E "[[:space:]]$INBOUND_ROUTE_ID" $2 | cut -f1)
OUTBOUND_ROUTE_ID=$(grep -E "[[:space:]]$1[[:space:]]" $2 | grep -E "[[:space:]]2050-" | grep -E "[[:space:]]outbound[[:space:]]" | cut -f1)
OUTBOUND_JP_ID=$(grep -E "[[:space:]]$OUTBOUND_ROUTE_ID" $2 | cut -f1)

if [[ -z "$INBOUND_JP_ID" ]]; then
  echo "Aborting: inbound journey pattern id not found!"
  exit
fi

if [[ -z "$OUTBOUND_JP_ID" ]]; then
  echo "Aborting: outbound journey pattern id not found!"
  exit
fi

echo "// Auto-generated from dump ids when running the extract-seed-route-ids.sh or setup-dependencies-and-seed.sh
export const JOURNEY_PATTERN_IDS = {
  jp1: '$OUTBOUND_JP_ID',
  jp2: '$INBOUND_JP_ID',
};" > $3

