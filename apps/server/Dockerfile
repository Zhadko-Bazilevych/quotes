FROM node:22.17-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/server/package.json ./apps/server/package.json

RUN npm ci

COPY turbo.json ./
COPY apps/server/ apps/server/

RUN npm run build

FROM node:22.17-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 -G nodejs nodejs

COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/package-lock.json ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/server/package.json ./apps/server/package.json

RUN npm ci --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/apps/server/dist ./apps/server/dist

USER nodejs

WORKDIR /app/apps/server/

ENV NODE_ENV=production

CMD ["node", "dist/main"]
