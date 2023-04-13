#!/bin/bash

DB_CONNECTION_STRING=postgresql://dbadmin:adminpassword@localhost:6432/jore4e2e

echo "Seeding infrastructure links..."

SUCCESS=false
while ! $SUCCESS; do
  echo "Checking if infrastructure link schema exists..."
  if [[ $(psql $DB_CONNECTION_STRING -AXqtc "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'infrastructure_network' AND tablename = 'infrastructure_link');") = "t" ]]; then
    echo "Schema found! Seeding infrastructure links..."
      psql $DB_CONNECTION_STRING < test-db-manager/src/dumps/infraLinks/infraLinks.sql; 
      SUCCESS=true
  fi
  sleep 2
done
