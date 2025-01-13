#!/usr/bin/env bash

cd "$(dirname "$0")"/.. || exit 1

docker exec -i testdb sh -c 'psql postgresql://dbadmin:adminpassword@localhost:5432/jore4e2e < dump.sql'
