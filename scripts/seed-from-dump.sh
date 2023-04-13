#!/bin/bash

cd $(dirname "$0")/..

psql postgresql://dbadmin:adminpassword@localhost:6432/jore4e2e < dump.sql
