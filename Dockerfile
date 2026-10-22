FROM node:26.12.1-alpine3.24 AS build
WORKDIR /app

RUN npm install --global yarn@1.22.22

# Copy over files needed to install dependecies.
COPY package.json yarn.lock tsconfig.json ./
COPY ./test-db-manager/docker.minimal.package.json ./test-db-manager/package.json
COPY ./ui/package.json ./ui/

# Install the depdencies
RUN yarn install --frozen-lockfile

# Copy over the actual UI code
COPY ./ui/tsconfig.json \
     ./ui/next.config.js \
     ./ui/tailwind.config.js \
     ./ui/postcss.config.js \
     ./ui/convert-theme-to-ts.js \
     ./ui/theme.js \
     ./ui/graphql.schema.json \
     ./ui/
COPY ./ui/public ./ui/public
# but skip unit test files.
COPY --exclude=**/*.spec.ts* --exclude=**/integration-tests/* ./ui/src ./ui/src

# Package up the UI code.
ARG NEXT_PUBLIC_GIT_HASH=unknown
ARG NEXT_PUBLIC_BUILD_TIME
RUN NEXT_TELEMETRY_DISABLED=1 yarn ws:ui run build

# This is a silly thing to do, but nginx-unprivileged base image
# makes it difficult to RUN commans in it's Dockerfile section.
# Prepare a symbolic link for an config file, pointint to a /tmp
# into which the nginx user is allowed to write, and into where
# we can generate the config file from ENV variables at container
# startup time.
# Remove the plaholder file and replace with the link.
RUN rm /app/ui/out/config.json && \
    ln -s /tmp/config.json /app/ui/out/config.json


# Setup the final nginx image to serve the UI from.
FROM nginxinc/nginx-unprivileged:1.31-alpine

EXPOSE 8080

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 scripts/docker/generateConfigJSON.sh /tmp
ADD --chmod=755 https://raw.githubusercontent.com/HSLdevcom/jore4-tools/main/docker/read-secrets.sh /tmp/read-secrets.sh

COPY --from=build --chown=10001:0 /app/ui/out /usr/share/nginx/html

ENV NEXT_PUBLIC_DIGITRANSIT_API_KEY="PLACEHOLDER"
ENV NEXT_PUBLIC_HASURA_URL=""
CMD ["/bin/sh", "-c", "source /tmp/read-secrets.sh && /tmp/generateConfigJSON.sh && nginx -g \"daemon off;\""]
