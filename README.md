# react-template

A full-stack TypeScript monorepo built on [Bun](https://bun.com) and [Turborepo](https://turborepo.dev). It pairs a [Hono](https://hono.dev) API (OpenAPI + type-safe RPC) with a [React 19](https://react.dev) single-page application, backed by [PostgreSQL](https://www.postgresql.org) via [Prisma](https://www.prisma.io).

## Table of Contents

- [react-template](#react-template)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
  - [API Documentation](#api-documentation)
  - [Database](#database)
  - [Deployment](#deployment)

## Overview

The repository is organized as a Bun workspace orchestrated by Turborepo. Two applications (`api` and `web`) consume three shared packages (`db`, `schemas`, and `constants`). The API exposes a typed RPC client that the web application imports directly, providing end-to-end type safety from the database to the browser.

## Architecture

```
                 ┌──────────────┐        RPC (typed)        ┌──────────────┐
   Browser  ───▶ │  apps/web    │ ───────────────────────▶ │  apps/api    │
                 │  React + Vite│                           │  Hono        │
                 └──────────────┘                           └──────┬───────┘
                                                                    │ Prisma
                                                             ┌──────▼───────┐
                                                             │  PostgreSQL  │
                                                             └──────────────┘
```

- In development, the Vite dev server proxies `/` to the API, and `dev:rpc` continuously rebuilds the RPC type definitions.
- In production, the API serves the compiled web assets from its `public/` directory.

## Tech Stack

| Area      | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Runtime   | Bun 1.3.x                                                                  |
| Monorepo  | Turborepo, Bun workspaces                                                  |
| API       | Hono, `@hono/zod-openapi`, `@hono/swagger-ui`                              |
| Web       | React 19, Vite 6, TanStack Router, TanStack Query, Tailwind CSS 4         |
| Database  | PostgreSQL 16, Prisma 7                                                    |
| Validation| Zod 4 (shared schemas)                                                    |
| Language  | TypeScript 5.8                                                            |

## Prerequisites

- [Bun](https://bun.com) `1.3.14` or later
- [Docker](https://www.docker.com) and Docker Compose
- [GNU Make](https://www.gnu.org/software/make/) (optional, for the convenience targets)

## Getting Started

The repository ships with two Make entrypoints, each invoked with `make -f <file> <target>`:

- **`mlocal`** — local development. Only PostgreSQL runs in Docker; the API and web run on your host with hot reload.
- **`mglobal`** — the full stack (API + web + PostgreSQL) in Docker, mirroring production.

### Local development (recommended)

1. Copy the example environment file and adjust values as needed:

```bash
cp secret/.env.example secret/.env
```

2. Bootstrap and start everything with a single command. This installs dependencies, starts the database in Docker, resets and seeds it, then launches the dev servers and Prisma Studio:

```bash
make -f mlocal install
```

Under the hood this runs, in order: `down` → `up-db` → `bun-install` → `db-reset` → `seed` → `dev` → `studio`.

Once it's up:

- Web app (Vite dev server): `http://localhost:5173`
- API: `http://localhost:8000`

3. Day-to-day you usually only need a subset of targets. **Every target is a thin wrapper around a `bun` command** — use whichever you prefer:

| Target        | What it does                                    | Equivalent Bun command   |
| ------------- | ----------------------------------------------- | ------------------------ |
| `bun-install` | Install workspace dependencies                  | `bun install`            |
| `dev`         | Run the API and web dev servers with hot reload | `bun dev`                |
| `generate`    | Generate the Prisma client                      | `bun run:db generate`    |
| `db-reset`    | Reset (drop, re-create, migrate) the database   | `bun run:db reset`       |
| `seed`        | Seed the database                               | `bun run:db seed`        |
| `studio`      | Open Prisma Studio                              | `bun run:db studio`      |
| `up-db`       | Start only the PostgreSQL container (detached)  | _(Docker only)_          |
| `down`        | Stop the Docker services                        | _(Docker only)_          |
| `install`     | Full bootstrap (all of the above)               | _(composite)_            |

### Using Bun directly

Once the database is running (`make -f mlocal up-db`) and dependencies are installed, you can skip Make entirely and drive everything through Bun:

```bash
bun install              # install all workspace dependencies
bun dev                  # run the API + web dev servers (turbo, parallel)
bun run build            # build every workspace package
bun run typecheck        # type-check the whole monorepo
bun run lint             # format and lint with Biome

bun run:db generate      # generate the Prisma client
bun run:db reset         # reset the database
bun run:db seed          # seed the database
bun run:db studio        # open Prisma Studio
```

`bun run:db <script>` is a shortcut for `cd packages/db && bun <script>`, so any script in `packages/db/package.json` is available this way.

### Full Docker stack

To build and run the entire application in Docker (closest to production):

```bash
make -f mglobal build   # build the production image
make -f mglobal up      # start db + app (foreground)
make -f mglobal up-d    # start db + app (detached)
make -f mglobal down    # stop everything
make -f mglobal logs    # follow logs
```

Useful `mglobal` helpers — note database tasks here run **inside** the running container:

| Target      | What it does                                              |
| ----------- | -------------------------------------------------------- |
| `migrate`   | Run `prisma migrate` inside the db container             |
| `seed`      | Seed the database inside the db container                |
| `studio`    | Open Prisma Studio inside the db container               |
| `psql`      | Open a `psql` shell in the db container                  |
| `bash-db`   | Open a shell in the db container                         |
| `bash-app`  | Open a shell in the app container                        |
| `clear`     | Remove dependencies, build artifacts, and the db volume  |
| `install`   | Tear down, clear, rebuild, migrate, seed, and start      |

Run `make -f mglobal help` to list every available target.

## Project Structure

```
.
├── apps/
│   ├── api/                # Hono API server (OpenAPI + RPC)
│   │   └── src/
│   │       ├── modules/    # Feature modules (auth, user)
│   │       ├── lib/        # App wiring (env, prisma, rpc, auth)
│   │       └── utils/      # Cross-cutting helpers (crypto, errors, middleware)
│   └── web/                # React + Vite single-page application
│       └── src/
│           ├── routes/     # TanStack Router route components
│           ├── modules/    # Feature modules and queries
│           └── lib/        # API client, auth, query client
├── packages/
│   ├── db/                 # Prisma schema, migrations, seed, generated client
│   ├── schemas/            # Shared Zod schemas (auth, user)
│   └── constants/          # Shared constants
├── docker-compose.yaml     # PostgreSQL and full-stack app services
├── Dockerfile              # Production image build
├── mlocal                  # Make targets for local development (DB in Docker, apps on host)
├── mglobal                 # Make targets for the full Docker stack
└── turbo.json              # Turborepo task pipeline
```

## API Documentation

When the API runs in development mode, interactive documentation is available:

- Swagger UI: `http://localhost:8000/api/docs`
- OpenAPI specification: `http://localhost:8000/api/openapi.json`

All routes are mounted under the `/api` base path (for example, `/api/auth` and `/api/user`). Authentication is session-based, and access to protected routes is enforced through `WORKER` and `ADMIN` roles.

## Database

The data model is defined in `packages/db/prisma/schema.prisma` and currently includes `User` and `Session` models with a `Role` enum (`WORKER`, `ADMIN`).

| Task                       | Bun command             | Make target                |
| -------------------------- | ----------------------- | -------------------------- |
| Generate the Prisma client | `bun run:db generate`   | `make -f mlocal generate`  |
| Reset the database         | `bun run:db reset`      | `make -f mlocal db-reset`  |
| Seed data                  | `bun run:db seed`       | `make -f mlocal seed`      |
| Inspect data visually      | `bun run:db studio`     | `make -f mlocal studio`    |

These run against the PostgreSQL container started by `make -f mlocal up-db`. When working entirely inside Docker, use the equivalent `mglobal` targets (`make -f mglobal migrate`, `make -f mglobal seed`, ...), which execute the same Bun scripts inside the running db container.

## Deployment

The production stack is built and run with Docker Compose via the `mglobal` targets:

```bash
make -f mglobal build   # build the application image
make -f mglobal up      # start the database and application
```

The application container runs the API in production mode and serves the pre-built web assets. The PostgreSQL service persists data in the `db_data` volume.
# react-hono-docker-boilerplate
