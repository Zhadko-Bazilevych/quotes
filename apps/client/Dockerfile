FROM node:22.17-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/client/package.json ./apps/client/package.json

RUN npm ci

COPY turbo.json ./
COPY apps/client/ apps/client/

RUN npm run build

FROM caddy:2.10-alpine AS runner
COPY --from=build /app/apps/client/dist /srv
COPY apps/client/Caddyfile /etc/caddy/Caddyfile
