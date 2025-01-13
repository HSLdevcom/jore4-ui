#!/bin/bash

cd "$(dirname "$0")"/.. || exit 1

if [ -z "$1" ]; then
    echo "Usage: $0 version_number"
    echo "No version given, exiting..."
else
    NODE_VERSION="$1"

    sed -i "s/\"node\": \".*\",/\"node\": \"$NODE_VERSION\",/g" package.json
    sed -i "s/\"@types\/node\": \".*\",/\"@types\/node\": \"^$NODE_VERSION\",/g" ui/package.json
    sed -i "s/\"@types\/node\": \".*\",/\"@types\/node\": \"^$NODE_VERSION\",/g" cypress/package.json
    sed -i "s/ARG NODE_VERSION='.*'/ARG NODE_VERSION='$NODE_VERSION'/g" Dockerfile.cypress
    sed -i "s/FROM node:.*-alpine/FROM node:$NODE_VERSION-alpine/g" Dockerfile
    sed -i "s/node-version: '.*'/node-version: '$NODE_VERSION'/g" .github/workflows/check-generated-resources.yml
    sed -i "s/node-version: '.*'/node-version: '$NODE_VERSION'/g" .github/workflows/check-seed-generators.yml
    sed -i "s/node-version: '.*'/node-version: '$NODE_VERSION'/g" .github/workflows/ci.yml
    sed -i "s/node-version: '.*'/node-version: '$NODE_VERSION'/g" .github/workflows/run-integration-tests.yml
fi
