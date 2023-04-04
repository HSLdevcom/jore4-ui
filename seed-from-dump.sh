#!/bin/bash

psql postgresql://dbadmin:adminpassword@localhost:6432/jore4e2e < dump.sql
