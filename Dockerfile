FROM oven/bun:1.3.14-slim AS base
WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

FROM base AS install

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/constants/package.json ./packages/constants/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY scripts/ ./scripts/

# - install dependencies into temp directory
# this will cache them and speed up future builds
# - add CI=true
# this will skip husky init
RUN --mount=type=cache,target=/root/.bun/install/cache \
  CI=true bun install --frozen-lockfile

COPY . .

# add CI=true
# this will skip  husky init
RUN --mount=type=cache,target=/root/.bun/install/cache \
  CI=true bun install --frozen-lockfile --production

ENV NODE_ENV=production

ARG BACK_PORT=8000
ARG DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres

ENV BACK_PORT=${BACK_PORT}
ENV DATABASE_URL=${DATABASE_URL}

RUN cd ./packages/db && bun run generate
RUN cd ./apps/api && bun run build:rpc
RUN cd ./apps/web && bun run build
RUN mkdir -p ./apps/api/public && cp -r apps/web/dist/* apps/api/public/

EXPOSE ${BACK_PORT}
WORKDIR /usr/src/app
CMD ["bun", "run", "--cwd", "apps/api", "prod"]
