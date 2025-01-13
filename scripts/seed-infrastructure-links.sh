#!/bin/bash

cd "$(dirname "$0")"/.. || exit 1

DB_CONNECTION_STRING=postgresql://dbadmin:adminpassword@localhost:5432/jore4e2e

echo "$1: Seeding infrastructure links..."

SUCCESS=false
while ! $SUCCESS; do
  echo "$1: Checking if infrastructure link schema exists..."
  if [[ $(docker exec $1 psql $DB_CONNECTION_STRING -AXqtc "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'infrastructure_network' AND tablename = 'infrastructure_link');") = "t" ]]; then
    echo "$1: Schema found! Seeding infrastructure links..."
      docker exec -i $1 psql $DB_CONNECTION_STRING < test-db-manager/src/dumps/infraLinks/infraLinks.sql;
      SUCCESS=true
  fi
  sleep 2
done
