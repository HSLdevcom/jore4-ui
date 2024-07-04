#!/bin/bash
set -euo pipefail

cd $(dirname "$0")/..

read -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Start dependencies
./scripts/start-dependencies.sh "$@"

# Fetch Digitransit API key if local environment variable file does not exist
if [ ! -e ui/.env.local ]
then
    echo "" | ./scripts/development.sh digitransit:fetch
fi

# Download routes and lines dump if it does not exist
if [ ! -e jore4dump.pgdump ]
then
    echo "" | ./scripts/development.sh dump:download
fi

# Import routes and lines dump to db
echo "y" | ./scripts/development.sh dump:import

# Seed timetables and stop registry
cd ./test-db-manager
yarn build
yarn seed

echo "All done! Happy coding! :)"
