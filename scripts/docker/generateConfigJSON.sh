#!/bin/sh

#TODO: Get rid of the unneeded NEXT_PUBLIC prefixes
cat > /tmp/config.json << EOF
{
  "digitransitApiKey": "$(echo "${NEXT_PUBLIC_DIGITRANSIT_API_KEY}" | tr '"' '\"')",
  "hasuraUrl": "$(echo "${NEXT_PUBLIC_HASURA_URL}" | tr '"' '\"')"
}
EOF
