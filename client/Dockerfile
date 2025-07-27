FROM node:22.17-alpine AS build

WORKDIR /build
COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

FROM caddy:2.10-alpine AS dist
COPY --from=build /build/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
