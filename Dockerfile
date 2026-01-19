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
ENV NEXT_PUBLIC_DIGITRANSIT_API_KEY="DIGITRANSIT_API_KEY_PLACEHOLDER"
RUN yarn ws:db run build
RUN yarn ws:ui run build

FROM nginx:1.29.4-alpine
EXPOSE 80
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/ui/out /usr/share/nginx/html

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp

# Set ownership for non-root user (10001)
RUN chown -R 10001:10001 /var/cache/nginx /usr/share/nginx/html

# Remove the default user directive
RUN sed -i '/^user /d' /etc/nginx/nginx.conf

# Configure nginx to use /tmp for PID file (writable by all users)
RUN sed -i 's|/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf

COPY --chmod=755 scripts/docker/replace-environment-variables.sh /tmp
ADD --chmod=755 https://raw.githubusercontent.com/HSLdevcom/jore4-tools/main/docker/read-secrets.sh /tmp/read-secrets.sh

CMD ["/bin/sh", "-c", "source /tmp/read-secrets.sh && /tmp/replace-environment-variables.sh && nginx -g \"daemon off;\""]
