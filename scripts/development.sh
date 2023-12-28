#!/bin/bash
set -euo pipefail

cd $(dirname "$0")/..

DUMP_LOCAL_FILENAME="jore4dump.pgdump"

function download_dump {
  echo "Downloading JORE4 dump from Azure"

  # Here is a breakdown of the dump name used below:
  # - "jore4e2e"        ~ The name of the database to which the data dump applies
  # - "test-20240104"   ~ The data originates from the Jore3 test database (not production) and specifically the snapshot taken on 4.1.2024.
  # - "data-only"       ~ The dump contains only data. It does not contain DDL, i.e. table and other schema element definitions.
  # - "8a28ef5f"        ~ The dump is based on the database migrations of the jore4-hasura image version starting with this hash.
  # - "20240104" (2nd)  ~ The day when the jore3-importer was run
  read -p "Dump file name (default: jore4e2e-test-20240104-data-only-8a28ef5f-20240104.pgdump): " DUMP_FILENAME
  DUMP_FILENAME="${DUMP_FILENAME:-jore4e2e-test-20240104-data-only-8a28ef5f-20240104.pgdump}"

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

  docker exec -i testdb pg_restore --format=c --disable-triggers --no-owner --role=dbhasura -f dump.sql < $DUMP_LOCAL_FILENAME

  # Add a row to sql dump disabling triggers
  docker exec -i testdb sed -i '1s;^;SET session_replication_role = replica\;\n;' dump.sql

  ./scripts/seed-from-dump.sh
}

function download_digitransit_key {
  echo "Log in to Azure"
  az login

  echo "Downloading secret value to ui/.env.local"
  { echo -n "NEXT_PUBLIC_DIGITRANSIT_API_KEY=" && az keyvault secret show --name "hsl-jore4-digitransit-api-key" --vault-name "hsl-jore4-dev-vault" --query "value"; } > ui/.env.local
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
