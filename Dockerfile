FROM node:18.15.0-alpine3.17 AS build
WORKDIR /app
COPY package.json yarn.lock ./
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

FROM nginx:1.23.3-alpine
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/ui/out /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
