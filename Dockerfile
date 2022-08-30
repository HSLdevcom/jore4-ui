FROM node:18.8.0-alpine3.16 AS build
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./ui/package.json ./ui/
RUN yarn install --frozen-lockfile
COPY ./ui/src ./ui/src
COPY ./ui/public ./ui/public
COPY ./ui/tsconfig.json ./ui/next.config.js ./ui/next-env.d.ts ./ui/tailwind.config.js ./ui/postcss.config.js ./ui/convert-theme-to-ts.js ./ui/theme.js ./ui/graphql.schema.json ./ui/

ARG NEXT_PUBLIC_GIT_HASH=unknown
RUN yarn ws:ui run build

FROM nginx:1.19.6-alpine
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/ui/out /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
