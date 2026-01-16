FROM node:24-alpine3.22 AS build
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./ui/package.json ./ui/
COPY ./test-db-manager/package.json ./test-db-manager/
RUN yarn install --frozen-lockfile
COPY ./ui/src ./ui/src
COPY ./test-db-manager/src ./test-db-manager/src
COPY ./ui/public ./ui/public
COPY ./ui/tsconfig.json ./ui/next.config.js ./ui/tailwind.config.js ./ui/postcss.config.js ./ui/convert-theme-to-ts.js ./ui/theme.js ./ui/graphql.schema.json ./ui/
COPY ./test-db-manager/rollup.config.mjs ./test-db-manager/tsconfig.json ./test-db-manager/

ARG NEXT_PUBLIC_GIT_HASH=unknown
ARG NEXT_PUBLIC_BUILD_TIME
RUN yarn ws:db run build
RUN yarn ws:ui run build

FROM nginx:1.24.0-alpine
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/ui/out /usr/share/nginx/html

RUN chown -R 10001:10001 /usr/share/nginx/html

COPY --chmod=755 scripts/docker/generateConfigJSON.sh /tmp
ADD --chmod=755 https://raw.githubusercontent.com/HSLdevcom/jore4-tools/main/docker/read-secrets.sh /tmp/read-secrets.sh
ENV NEXT_PUBLIC_DIGITRANSIT_API_KEY="PLACEHOLDER"
ENV NEXT_PUBLIC_HASURA_URL=""
CMD ["/bin/sh", "-c", "source /tmp/read-secrets.sh && /tmp/generateConfigJSON.sh && nginx -g \"daemon off;\""]
