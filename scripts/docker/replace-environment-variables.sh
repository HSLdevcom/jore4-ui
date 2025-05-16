#!/bin/sh
if [ -n "$NEXT_PUBLIC_DIGITRANSIT_API_KEY" ]; then
    sed -i -e "s/[[:alnum:]_\$]\+\.env\.NEXT_PUBLIC_DIGITRANSIT_API_KEY/\"$NEXT_PUBLIC_DIGITRANSIT_API_KEY\"/g" /usr/share/nginx/html/_next/static/chunks/pages/*.js
fi
