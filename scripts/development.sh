#!/usr/bin/env bash

set -eo pipefail

cd "$(dirname "$0")"/..

# By default, the tip of the main branch of the jore4-docker-compose-bundle
# repository is used as the commit reference, which determines the version of
# the Docker Compose bundle to download. For debugging purposes, this default
# can be overridden by some other commit reference (e.g., commit SHA or its
# initial substring), which you can pass via the `BUNDLE_REF` environment
# variable.
DOCKER_COMPOSE_BUNDLE_REF=${BUNDLE_REF:-main}

DUMP_ROUTES_FILENAME="routes-12-2024.pgdump"
DUMP_TIMETABLES_FILENAME="timetables-12-2024.pgdump"
DUMP_STOPS_FILENAME="stopdb-12-2024.pgdump"

DOCKER_TESTDB_IMAGE="jore4-testdb"
DOCKER_IMAGES="jore4-auth jore4-hasura jore4-mbtiles jore4-mapmatchingdb jore4-mapmatching jore4-hastus jore4-tiamat jore4-timetablesapi"
DOCKER_E2E_IMAGES="jore4-hasura-e2e jore4-tiamat-e2e jore4-timetablesapi-e2e jore4-testdb-e2e"

ROUTES_DB_CONNECTION_STRING=postgresql://dbadmin:adminpassword@localhost:5432/jore4e2e

INCLUDE_E2E=true
USE_VOLUME=false

LOGGED_IN=false

for param in "$@"; do
  if [ "$param" = "--volume" ]; then
    USE_VOLUME=true
  fi
  if [ "$param" = "--skip-e2e" ]; then
    INCLUDE_E2E=false
  fi
done

DOCKER_COMPOSE_CMD="docker compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml"

if [ "$USE_VOLUME" = true ]; then
  # start the testdb with mounted volume
  DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD -f ./docker/docker-compose.testdb-volume.yml"
fi

# start up only services that are needed in local ui development
if [ "$INCLUDE_E2E" = true ]; then
  DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD -f ./docker/docker-compose.e2e.yml"
fi

function login {
  if [ $LOGGED_IN != true ]; then
    echo "Log in to Azure"
    az login
    LOGGED_IN=true
  fi
}

function wait_for_database {
  SUCCESS=false
  while ! $SUCCESS; do
    echo "$1: Checking if schema $2 and table $3 exist..."
    if [[ $(docker exec "$1" psql $ROUTES_DB_CONNECTION_STRING -AXqtc "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = '$2' AND tablename = '$3');" 2> /dev/null) = "t" ]]; then
        SUCCESS=true
    fi
    sleep 2
  done
}

function seed_infra_links {
  echo "$1: Seeding infrastructure links..."

  wait_for_database "$1" infrastructure_network infrastructure_link
  docker exec -i "$1" psql $ROUTES_DB_CONNECTION_STRING < test-db-manager/src/dumps/infraLinks/infraLinks.sql;
}

function check_pinned_image {
  DOCKER_JQ="docker run --rm -i imega/jq"
  DOCKER_YQ="docker run --rm -i mikefarah/yq"
  GREEN='\033[1;32m'
  RED='\033[1;31m'
  NO_COLOR='\033[0m'

  PREFIX="${2:-main-}"

  local dockerHubImageList
  local dockerHubTag
  local dockerHubImage
  local localImage

  # Find latest image with "hsl-main-" tag prefix from docker hub
  dockerHubImageList=$(curl --silent --get -H \"Accept: application/json\" https://hub.docker.com/v2/repositories/hsldevcom/jore4-"$1"/tags/\?page_size=100\&page=1\&ordering=last_updated)
  dockerHubTag="$(echo "$dockerHubImageList" | ${DOCKER_JQ} --arg PREFIX "$PREFIX" --raw-output 'first(.results[] | select(.name | startswith($PREFIX))).name')"
  dockerHubImage="hsldevcom/jore4-${1}:${dockerHubTag}"
  echo "Docker hub image: ${dockerHubImage}"

  # Find current tag from values
  localImage="$(cat ./docker/docker-compose.custom.yml | ${DOCKER_YQ} e \".services.jore4-${1}.image\")"
  echo "Local image: ${localImage}"

  # Warn the user if the local pinned version differs from the current one
  if [[ "$dockerHubImage" == "$localImage" ]]; then
    echo -e "${GREEN}The pinned ${1} image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned ${1} image version is different compared to the docker hub version"
    echo -e "You should update the ${1} image in 'docker-compose.custom.yml' to: ${dockerHubImage}${NO_COLOR}"
  fi
}

# Download Docker Compose bundle from the "jore4-docker-compose-bundle"
# repository. GitHub CLI is required to be installed.
#
# A commit reference is read from global `DOCKER_COMPOSE_BUNDLE_REF` variable,
# which should be set based on the script execution arguments.
download_docker_compose_bundle() {
  local commit_ref="$DOCKER_COMPOSE_BUNDLE_REF"

  local repo_name="jore4-docker-compose-bundle"
  local repo_owner="HSLdevcom"

  # Check GitHub CLI availability.
  if ! command -v gh &> /dev/null; then
    echo "Please install the GitHub CLI (gh) on your machine."
    exit 1
  fi

  # Make sure the user is authenticated to GitHub.
  gh auth status || gh auth login

  echo "Using the commit reference '${commit_ref}' to fetch a Docker Compose bundle..."

  # First, try to find a commit on GitHub that matches the given reference.
  # This function exits with an error code if no matching commit is found.
  local commit_sha
  commit_sha=$(
    gh api \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "repos/${repo_owner}/${repo_name}/commits/${commit_ref}" \
      --jq '.sha'
  )

  echo "Commit with the following SHA digest was found: ${commit_sha}"

  local zip_file="/tmp/${repo_name}.zip"
  local unzip_target_dir_prefix="/tmp/${repo_owner}-${repo_name}"

  # Remove old temporary directories if any remain.
  rm -fr "$unzip_target_dir_prefix"-*

  echo "Downloading the JORE4 Docker Compose bundle..."

  # Download Docker Compose bundle from the jore4-docker-compose-bundle
  # repository as a ZIP file.
  gh api "repos/${repo_owner}/${repo_name}/zipball/${commit_sha}" > "$zip_file"

  # Extract ZIP file contents to a temporary directory.
  unzip -q "$zip_file" -d /tmp

  # Clean untracked files from `docker` directory even if they are git-ignored.
  git clean -fx ./docker

  echo "Copying JORE4 Docker Compose bundle files to ./docker directory..."

  # Copy files from the `docker-compose` directory of the ZIP file to your
  # local `docker` directory.
  mv "$unzip_target_dir_prefix"-*/docker-compose/* ./docker

  # Remove the temporary files and directories created above.
  rm -fr "$zip_file" "$unzip_target_dir_prefix"-*

  echo "Generating a release version file for the downloaded bundle..."

  # Create a release version file containing the SHA digest of the referenced
  # commit.
  echo "$commit_sha" > ./docker/RELEASE_VERSION.txt
}

function start_docker_images {
  echo "Running docker compose command: $DOCKER_COMPOSE_CMD"

  $DOCKER_COMPOSE_CMD up -d "$@"
}

function stop_dependencies {
  docker compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml -f ./docker/docker-compose.e2e.yml down --volumes
}

function start_dependencies {
  download_docker_compose_bundle

  local additional_images=""
  if [ "$INCLUDE_E2E" = true ]; then
    additional_images=$DOCKER_E2E_IMAGES
  fi

  start_docker_images $DOCKER_TESTDB_IMAGE $DOCKER_IMAGES $additional_images
  # Use port 3010 for tiamat and 3110 for tiamat-e2e
  ./scripts/seed-municipalities-and-fare-zones.sh 3010 &
  if [ "$INCLUDE_E2E" = true ]; then
    ./scripts/seed-municipalities-and-fare-zones.sh 3110 &
  fi
  wait

  check_images
}

function download_dump {
  echo "Downloading database dump for JORE4 network & routes from Azure Blob Storage..."

  # Here is a breakdown of the dump name used below:
  # - "jore4e2e"        ~ The name of the database to which the data dump applies
  # - "test-20240104"   ~ The data originates from the Jore3 test database (not production) and specifically the snapshot taken on 4.1.2024.
  # - "data-only"       ~ The dump contains only data. It does not contain DDL, i.e. table and other schema element definitions.
  # - "8a28ef5f"        ~ The dump is based on the database migrations of the jore4-hasura image version starting with this hash.
  # - "20240104" (2nd)  ~ The day when the jore3-importer was run
  if [ -z ${1+x} ]; then
    read -p "Dump file name (default: jore4e2e-test-20240104-data-only-8a28ef5f-20240104.pgdump): " DUMP_FILENAME
    DUMP_FILENAME="${DUMP_FILENAME:-jore4e2e-test-20240104-data-only-8a28ef5f-20240104.pgdump}"
  else
    DUMP_FILENAME=$1
  fi

  login

  # Check dump file
  if [ ! -f "$1" ]; then
    echo "Downloading dump file as $DUMP_FILENAME"
    az storage blob download \
      --account-name "jore4storage" \
      --container-name "jore4-dump" \
      --name "$DUMP_FILENAME" \
      --file "$DUMP_FILENAME" \
      --auth-mode login
  fi
}

function import_dump {
  if [[ -z ${1+x} || -z ${2+x} ]]; then
    echo "File and target database need to be defined!"
    echo "usage:"
    echo "       development.sh dump:import file database"
    exit
  fi

  echo "Importing JORE4 dump to $2 database"

  # Download dump if it is missing
  if [ ! -f "$1" ]; then
    download_dump "$1"
  fi

  docker exec -i testdb pg_restore -U dbadmin --dbname="$2" --format=c < "$1"
}

function download_digitransit_key {
  login

  echo "Downloading secret value to ui/.env.local"
  { echo -n "NEXT_PUBLIC_DIGITRANSIT_API_KEY=" && az keyvault secret show --name "hsl-jore4-digitransit-api-key" --vault-name "hsl-jore4-dev-vault" --query "value"; } > ui/.env.local
}

function setup_environment {

  read -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi

  if [ ! -f ui/.env.local ]; then
    download_digitransit_key
  fi

  download_docker_compose_bundle

  start_docker_images $DOCKER_TESTDB_IMAGE

  if [[ -z ${1+x} || $1 != "test" ]]; then
    wait_for_database testdb topology topology
    import_dump $DUMP_ROUTES_FILENAME jore4e2e
    import_dump $DUMP_TIMETABLES_FILENAME timetablesdb
    import_dump $DUMP_STOPS_FILENAME stopdb
  fi

  local additional_images=""
  if [ "$INCLUDE_E2E" = true ]; then
    additional_images=$DOCKER_E2E_IMAGES
  fi

  start_docker_images $DOCKER_IMAGES $additional_images

  if [ "$INCLUDE_E2E" = true ]; then
    seed_infra_links testdb-e2e
    # Use port 3110 for tiamat-e2e
    ./scripts/seed-municipalities-and-fare-zones.sh 3110
  fi

  if [[ $1 = "test" ]]; then
    # Existing tests are made using old data and the data is not compatible with stop registry dump
    seed_infra_links testdb
    local old_dump=jore4e2e-test-20240104-data-only-8a28ef5f-20240104.pgdump
    if [ ! -f $old_dump ]; then
      download_dump $old_dump
    fi
    docker exec -i testdb pg_restore --format=c --disable-triggers --no-owner --role=dbhasura -f dump.sql < $old_dump

    # Add a row to sql dump disabling triggers
    docker exec -i testdb sed -i '1s;^;SET session_replication_role = replica\;\n;' dump.sql
    docker exec -i testdb sh -c 'psql postgresql://dbadmin:adminpassword@localhost:5432/jore4e2e < dump.sql'

    # Use port 3010 for tiamat
    ./scripts/seed-municipalities-and-fare-zones.sh 3010

    cd ./test-db-manager
    yarn build
    yarn seed
    cd ..
  fi


  echo "All done! Happy coding! :)"
}

function check_images {
  check_pinned_image hasura hsl-main-
  check_pinned_image tiamat
}

function usage {
  echo "
  Usage $0 <command>

  start:deps
    Start dependencies but do not insert data to database.

    You can change which version of the Docker Compose bundle is loaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  stop:deps
    Stop all Docker container dependencies.

  setup:env
    Start dependencies and seed databases with dump data.

    You can change which version of the Docker Compose bundle is loaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  setup:test
    Start dependencies and seed databases with test data.

    You can change which version of the Docker Compose bundle is loaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  dump:download
    Downloads JORE4 database dump for road infrastructure network and bus routes
    from Azure Blob Storage.

  dump:import file database
    Imports database dump from the given file to the specified database.

  digitransit:fetch
    Download Digitransit map API key for JORE4 account.

  check:images
    Check if the Docker images used are the latest.

  help
    Show this usage information.
  "
}

case $1 in
start:deps)
  start_dependencies
  ;;

stop:deps)
  stop_dependencies
  ;;

setup:env)
  setup_environment
  ;;

setup:test)
  setup_environment test
  ;;

dump:download)
  download_dump
  ;;

dump:import)
  import_dump
  ;;

digitransit:fetch)
  download_digitransit_key
  ;;

check:images)
  check_images
  ;;

help)
  usage
  ;;

*)
  usage
  ;;
esac
