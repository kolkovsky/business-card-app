# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

# ---------- build: install all deps, compile, then drop dev deps ----------
FROM node:${NODE_VERSION}-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
# postinstall runs `prisma generate`
RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build \
 && npm prune --omit=dev \
 && npm cache clean --force

# ---------- runtime: minimal image, non-root ----------
FROM node:${NODE_VERSION}-alpine AS runtime
RUN apk add --no-cache openssl tini
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build --chown=node:node /app/prisma/migrations ./prisma/migrations
COPY --chown=node:node docker-entrypoint.sh ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" > /dev/null || exit 1

ENTRYPOINT ["/sbin/tini", "--", "./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
