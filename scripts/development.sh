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

# Define a Docker Compose project name to distinguish the Docker environment of
# this project from others.
export COMPOSE_PROJECT_NAME=jore4-ui

DUMP_ROUTES_FILENAME="2025-04-03_test/2025-04-03-jore4-local-jore4e2e.pgdump"
DUMP_TIMETABLES_FILENAME="2025-04-03_test/2025-04-03-jore4-local-timetablesdb-nodata.pgdump"
DUMP_STOPS_FILENAME="2025-04-03_test/2025-04-03-jore4-local-stopdb.pgdump"

DOCKER_TESTDB_IMAGE="jore4-testdb"
DOCKER_IMAGES=("jore4-auth" "jore4-hasura" "jore4-mbtiles" "jore4-mapmatchingdb" "jore4-mapmatching" "jore4-hastus" "jore4-tiamat" "jore4-timetablesapi")
DOCKER_E2E_IMAGES=("jore4-hasura-e2e" "jore4-tiamat-e2e" "jore4-timetablesapi-e2e" "jore4-testdb-e2e")

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

login() {
  if [ $LOGGED_IN != true ]; then
    echo "Log in to Azure"
    az login
    LOGGED_IN=true
  fi
}

wait_for_database() {
  SUCCESS=false
  while ! $SUCCESS; do
    echo "$1: Checking if schema $2 and table $3 exist..."
    if [[ $(docker exec "$1" psql $ROUTES_DB_CONNECTION_STRING -AXqtc "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = '$2' AND tablename = '$3');" 2> /dev/null) = "t" ]]; then
        SUCCESS=true
    fi
    sleep 2
  done
}

seed_infra_links() {
  echo "$1: Seeding infrastructure links..."

  wait_for_database "$1" infrastructure_network infrastructure_link
  docker exec -i "$1" psql $ROUTES_DB_CONNECTION_STRING < test-db-manager/src/dumps/infraLinks/infraLinks.sql;
}

check_pinned_image() {
  DOCKER_YQ="docker run --rm -i mikefarah/yq"
  GREEN='\033[1;32m'
  RED='\033[1;31m'
  NO_COLOR='\033[0m'

  local bundleImage
  local localImage

  bundleImage=$(
    export "$(echo "${1}" | tr '[:upper:]' '[:lower:]')_DOCKER_IMAGE"=
    eval "echo $(${DOCKER_YQ} ".services.jore4-${1}-base.image" <docker/docker-compose.base.yml)"
  )

  # Find current tag from values
  localImage="$(${DOCKER_YQ} e ".services.jore4-${1}.image" <./docker/docker-compose.custom.yml)"

  echo "Bundle image: ${bundleImage}"
  echo "Local image:  ${localImage}"

  # Warn the user if the local pinned version differs from the current one
  if [[ "$bundleImage" == "$localImage" ]]; then
    echo -e "${GREEN}The pinned ${1} image is current, no need to update${NO_COLOR}"
  else
    echo -e "${RED}The pinned ${1} image version is different compared to the docker-compose bundle version"
    echo -e "You should update the ${1} image in 'docker-compose.custom.yml' to: ${bundleImage}${NO_COLOR}"
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

start_docker_containers() {
  echo "Running Docker Compose command: $DOCKER_COMPOSE_CMD"

  $DOCKER_COMPOSE_CMD up -d "$@"
}

stop_dependencies() {
  docker compose --project-name "$COMPOSE_PROJECT_NAME" down --volumes
}

start_dependencies() {
  download_docker_compose_bundle

  local additional_images=()
  if [ "$INCLUDE_E2E" = true ]; then
    additional_images+=("${DOCKER_E2E_IMAGES[@]}")
  fi

  start_docker_containers "$DOCKER_TESTDB_IMAGE" "${DOCKER_IMAGES[@]}" "${additional_images[@]}"

  # Use port 3010 for tiamat and 3110 for tiamat-e2e

  seed_infra_links testdb
  ./scripts/seed-municipalities-and-fare-zones.sh 3010 &

  if [ "$INCLUDE_E2E" = true ]; then
    seed_infra_links testdb-e2e
    ./scripts/seed-municipalities-and-fare-zones.sh 3110 &
  fi

  wait

  check_images
}

download_dump() {
  local az_blob_filepath

  if [ -z "$1" ]; then
    read -r -p "Dump file name: " az_blob_filepath
    if [ -z "$az_blob_filepath" ]; then
      echo "Error: empty Azure Blob container filepath given. Exiting..."
      exit 1
    fi
  else
    az_blob_filepath="$1"
  fi

  # Download the dump file, if it does not already exist.
  if [ ! -f "$az_blob_filepath" ]; then
    login

    echo "Downloading dump file: $az_blob_filepath"

    az storage blob download \
      --subscription "HSLAZ-CORP-DEV-JORE4" \
      --account-name "stjore4dev001" \
      --container-name "jore4-dump" \
      --name "$az_blob_filepath" \
      --file "$(basename "$az_blob_filepath")" \
      --auth-mode login
  fi
}

import_dump() {
  local az_blob_filepath="$1"
  local target_database="$2"

  if [[ -z ${az_blob_filepath} || -z ${target_database} ]]; then
    echo "Azure Blob container filepath and target database need to be defined!"
    echo "usage:"
    echo "   development.sh dump:import <azure_blob_filepath> <database_name>"
    exit
  fi

  # Extract the filename from the full path, which may include directory names.
  local az_blob_filename
  az_blob_filename=$(basename "$az_blob_filepath")

  # Download dump if it is missing
  if [ ! -f "$az_blob_filename" ]; then
    download_dump "$az_blob_filepath"
  fi

  echo "Importing database dump from the file '$az_blob_filename' to the '${target_database}' database..."

  docker exec -i testdb bash -c "
    set -eux
    dropdb --username=dbadmin --force $target_database
    pg_restore --username=dbadmin --dbname=postgres --format=custom --create
  " < "$az_blob_filename"
}

download_digitransit_key() {
  if [[ -z "$AZ_HTTPS_PROXY" ]]; then
    echo "The AZ_HTTPS_PROXY environment variable must be set according to the general JORE4 Azure guidelines when fetching the Digitransit subscription key from Azure Key Vault."
    exit 1
  fi

  login

  echo "Fetching Digitransit subscription key value to ui/.env.local"
  { echo -n "NEXT_PUBLIC_DIGITRANSIT_API_KEY=" && HTTPS_PROXY="$AZ_HTTPS_PROXY" az keyvault secret show --name "hsl-jore4-digitransit-api-key" --vault-name "kv-jore4-dev-001" --query "value"; } > ui/.env.local
}

setup_environment() {

  read -r -p "Warning: all the current data in the database will be overwritten! Are you sure (y/n)? " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi

  if [ ! -f ui/.env.local ]; then
    download_digitransit_key
  fi

  download_docker_compose_bundle

  start_docker_containers $DOCKER_TESTDB_IMAGE

  wait_for_database testdb topology topology
  import_dump $DUMP_ROUTES_FILENAME jore4e2e
  import_dump $DUMP_TIMETABLES_FILENAME timetablesdb
  import_dump $DUMP_STOPS_FILENAME stopdb

  local additional_images=()
  if [ "$INCLUDE_E2E" = true ]; then
    additional_images+=("${DOCKER_E2E_IMAGES[@]}")
  fi

  start_docker_containers "${DOCKER_IMAGES[@]}" "${additional_images[@]}"

  if [ "$INCLUDE_E2E" = true ]; then
    seed_infra_links testdb-e2e
    # Use port 3110 for tiamat-e2e
    ./scripts/seed-municipalities-and-fare-zones.sh 3110
  fi

  if [[ $1 = "test" ]]; then
    cd ./test-db-manager
    yarn build
    # Stop registry dumps do not include any terminal data, use the seed data to insert them
    yarn seed:terminals
    cd ..
  fi


  echo "All done! Happy coding! :)"
}

check_images() {
  check_pinned_image hasura
  check_pinned_image tiamat
}

print_usage() {
  echo "
  Usage: $(basename "$0") <command>

  start:deps
    Start dependencies but do not insert data to database.

    You can change which version of the Docker Compose bundle is downloaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  stop
    Stop all Docker container dependencies.

  setup:env
    Start dependencies and seed databases with dump data.

    If the Digitransit subscription key has not yet been fetched (stored in
    ui/.env.local), you will need to set the AZ_HTTPS_PROXY environment
    variable. For more information, see the README.md file.

    You can change which version of the Docker Compose bundle is downloaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  setup:test
    Start dependencies and seed databases with dump data and insert additional terminals.

    The stop registry dump does not currently contain any terminals, so use this command
    if you want to have terminal data in the database.

    If the Digitransit subscription key has not yet been fetched (stored in
    ui/.env.local), you will need to set the AZ_HTTPS_PROXY environment
    variable. For more information, see the README.md file.

    You can change which version of the Docker Compose bundle is downloaded by
    passing a commit reference to the jore4-docker-compose-bundle repository via
    the BUNDLE_REF environment variable. By default, the latest version is
    downloaded.

  dump:download [<azure_blob_filepath>]
    Downloads a JORE4 database dump from Azure Blob Storage. A full file path
    may be given as a parameter. The file path is used to refer to a file inside
    the 'jore4-dump' container under the 'stjore4dev001' storage account in the
    'rg-jore4-dev-001' resource group.

  dump:import <azure_blob_filepath> <database_name>
    Imports a database dump from the given file to the specified database.
    The dump file must be given as a Azure Blob storage reference where a full
    file path needs to be given within the 'jore4-dump' container under the
    'stjore4dev001' storage account in the 'rg-jore4-dev-001' resource group.

  digitransit:fetch
    Download Digitransit subscription key for JORE4 account.

    You will need to set the AZ_HTTPS_PROXY environment variable. For more
    information, see the README.md file.

  check:images
    Check if the Docker images used are the latest.

  help
    Show this usage information.
  "
}

if [[ $# -eq 0 ]]; then
  print_usage
  exit 1
fi

case $1 in
start:deps)
  start_dependencies
  ;;

stop)
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
  print_usage
  ;;

*)
  echo ""
  echo "Unknown command: '${1}'"
  print_usage
  exit 1
  ;;
esac
