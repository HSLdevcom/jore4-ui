#!/usr/bin/env bash

set -eo pipefail

trap "pkill Xvfb" EXIT

export CYPRESS_SCREEN_WIDTH=3840
export CYPRESS_SCREEN_HEIGHT=2160
export CYPRESS_VIEWPORT_WIDTH=3000
export CYPRESS_VIEWPORT_HEIGHT=1800

export DISPLAY=:91

runArgs=(ws:e2e)

if [[ $TEST_VIDEO = "true" ]]; then
  runArgs+=(cy:run:video)
else
  runArgs+=(cy:run)
fi

if [[ -n $TEST_TAGS ]]; then
  runArgs+=(--env grepTags=\'"${TEST_TAGS}"\')
fi

# Start a "virtual" X11 framebuffer server with a 4K resolution.
Xvfb -screen 0 ${CYPRESS_SCREEN_WIDTH}x${CYPRESS_SCREEN_HEIGHT}x24 $DISPLAY &

yarn "${runArgs[@]}"
