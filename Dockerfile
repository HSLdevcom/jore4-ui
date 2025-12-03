FROM node:24-alpine3.21 AS build
RUN apk update && apk add curl
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./ui/package.json ./ui/
COPY ./test-db-manager/package.json ./test-db-manager/
RUN yarn install --frozen-lockfile
COPY ./ui/src ./ui/src
COPY ./test-db-manager/src ./test-db-manager/src
COPY ./ui/public ./ui/public
COPY ./ui/tsconfig.json ./ui/next.config.js ./ui/next-env.d.ts ./ui/tailwind.config.js ./ui/postcss.config.js ./ui/convert-theme-to-ts.js ./ui/theme.js ./ui/graphql.schema.json ./ui/
COPY ./test-db-manager/rollup.config.mjs ./test-db-manager/tsconfig.json ./test-db-manager/

ARG NEXT_PUBLIC_GIT_HASH=unknown
RUN yarn ws:db run build
RUN yarn ws:ui run build

FROM nginx:1.24.0-alpine
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/ui/out /usr/share/nginx/html
COPY scripts/docker/replace-environment-variables.sh /tmp
RUN curl -o /tmp/read-secrets.sh "https://raw.githubusercontent.com/HSLdevcom/jore4-tools/main/docker/read-secrets.sh"
CMD /bin/sh -c 'source /tmp/read-secrets.sh && /tmp/replace-environment-variables.sh && nginx -g "daemon off;"'
