#!/bin/bash
set -euo pipefail

cd $(dirname "$0")/..

DUMP_LOCAL_FILENAME="jore4dump.pgdump"

function download_dump {
  echo "Downloading JORE4 dump from Azure"

  read -p "Dump file name (default: jore4e2e-data-only-orphan-removal-20230418-ef6ce574.pgdump): " PGHOSTNAME
  DUMP_FILENAME="${PGHOSTNAME:-jore4e2e-data-only-orphan-removal-20230418-ef6ce574.pgdump}"

  echo "Log in to Azure"
  az login

  echo "Downloading dump file as jore4dump.pgdump"
  az storage blob download \
    --account-name "jore4storage" \
    --container-name "jore4-dump" \
    --name "$DUMP_FILENAME" \
    --file "$DUMP_LOCAL_FILENAME" \
    --auth-mode login
}

function import_dump {
  echo "Importing JORE4 dump to database"

  read -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      exit 1
  fi

  pg_restore --format=c --disable-triggers --no-owner --role=dbhasura -f dump.sql $DUMP_LOCAL_FILENAME

  # Add a row to sql dump disabling triggers
  echo -e "SET session_replication_role = replica;\n$(cat dump.sql)" > dump.sql

  ./scripts/seed-from-dump.sh
}

function download_digitransit_key {
  echo "Log in to Azure"
  az login

  echo "Downloading secret value to ui/.env.local"
  { echo -n "NEXT_PUBLIC_DIGITRANSIT_API_KEY=" && az keyvault secret show --name "jore4-digitransit-api-key" --vault-name "hsl-jore4-vault" --query "value"; } > ui/.env.local
}

function usage {
  echo "
  Usage $0 <command>

  dump:download
    Downloads JORE4 dump from Azure.

  dump:import
    Imports JORE4 dump to running instance of jore4-testdb

  digitransit:fetch
    Download JORE4 digitransit map API key

  help
    Show this usage information
  "
}

case $1 in
dump:download)
  download_dump
  ;;

dump:import)
  import_dump
  ;;

digitransit:fetch)
  download_digitransit_key
  ;;

help)
  usage
  ;;

*)
  usage
  ;;
esac
