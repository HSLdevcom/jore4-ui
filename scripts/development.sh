#!/bin/bash
set -euo pipefail

DUMP_LOCAL_FILENAME="jore4dump.pgdump"

function download_dump {
  echo "Downloading JORE4 dump from Azure"

  read -p "Dump file name (default: jore4e2e-data-only-orphan-removal-28032023.pgdump): " PGHOSTNAME
  DUMP_FILENAME="${PGHOSTNAME:-jore4e2e-data-only-orphan-removal-28032023.pgdump}"

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

  sh ./scripts/seed-from-dump.sh
}

function usage {
  echo "
  Usage $0 <command>

  dump:download
    Downloads JORE4 dump from Azure.

  dump:import
    Imports JORE4 dump to running instance of jore4-testdb

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

help)
  usage
  ;;

*)
  usage
  ;;
esac
