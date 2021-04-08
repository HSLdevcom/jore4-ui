FROM node:15.8.0-alpine3.12 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./pages ./pages
COPY ./public ./public
COPY ./styles ./styles
COPY tsconfig.json  ./
ARG NEXT_PUBLIC_GIT_HASH=unknown
RUN yarn build

FROM nginx:1.19.6-alpine
EXPOSE 80
COPY --from=build /app/out /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
