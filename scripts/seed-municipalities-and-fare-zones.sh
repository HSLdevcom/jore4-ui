#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"/.. || exit 1

echo "Uploading municipality and fare zones to localhost:$1"

curl --silent --output /dev/null --show-error --fail -X POST -H"Content-Type: application/xml" -d @netex/hsl-zones-netex.xml localhost:$1/services/stop_places/netex
