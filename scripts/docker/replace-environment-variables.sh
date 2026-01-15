#!/bin/sh
if [ -n "$NEXT_PUBLIC_DIGITRANSIT_API_KEY" ]; then
    sed -i -e "s|DIGITRANSIT_API_KEY_PLACEHOLDER|${NEXT_PUBLIC_DIGITRANSIT_API_KEY}|g" /usr/share/nginx/html/_next/static/chunks/*.js
fi
