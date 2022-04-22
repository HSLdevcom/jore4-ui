#!/bin/bash
set -euo pipefail

DUMP_LOCAL_FILENAME="jore4dump.backup"

function download_dump {
  echo "Downloading JORE4 dump from Azure"

  read -p "Dump file name (default: jore4e2e-14042022.backup): " PGHOSTNAME
  DUMP_FILENAME="${PGHOSTNAME:-jore4e2e-14042022.backup}"

  echo "Log in to Azure"
  az login

  echo "Downloading dump file as jore4dump.backup"
  az storage blob download \
    --account-name "jore4storage" \
    --container-name "jore4-dump" \
    --name "$DUMP_FILENAME" \
    --file "$DUMP_LOCAL_FILENAME"
}

function import_dump {
  echo "Importing JORE4 dump to database"

  read -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      exit 1
  fi

  echo "Please fill in the connection parameters for the database to import the data to:"
  read -p "Hostname (default: localhost): " PGHOSTNAME
  export PGHOST="${PGHOST:-localhost}"
  read -p "Database name (default: jore4e2e): " PGDATABASE
  export PGDATABASE="${PGDATABASE:-jore4e2e}"
  read -p "Port (default: 6432): " PGPORT
  export PGPORT="${PGPORT:-6432}"
  read -p "Username (default: dbadmin): " PGUSERNAME
  export PGUSER="${PGUSER:-dbadmin}"
  read -p "Password (default: adminpassword): " PGPASSWORD
  PGPASSWORD="${PGPASSWORD:-adminpassword}"

  PGPASSWORD="${PGPASSWORD}" pg_restore --clean --dbname "$PGDATABASE" "$DUMP_LOCAL_FILENAME"
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
