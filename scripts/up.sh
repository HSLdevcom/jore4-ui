#!/bin/bash
set -euo pipefail

cd $(dirname "$0")/..

read -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

sh ./scripts/start-dependencies.sh

if [ ! -e jore4dump.pgdump ]
then
    echo "" | ./scripts/development.sh dump:download
fi

echo "y" | ./scripts/development.sh dump:import
cd ./test-db-manager
yarn seed2

echo "All done! Happy coding! :)"
