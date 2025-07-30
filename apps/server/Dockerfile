FROM node:22.17-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/server/package.json ./apps/server/package.json

RUN npm ci

COPY turbo.json ./
COPY apps/client/ apps/client/

RUN npm run build

FROM node:22.17-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/server/package.json ./apps/server/package.json

RUN npm ci --omit=dev
COPY --from=builder /app/apps/server/dist ./dist

RUN chown -R app:app /app
USER app

ENV NODE_ENV=production

CMD ["node", "dist/main"]
