# PawSentinel Backend MVP

This backend is the first implementation target for the PawSentinel smart-collar safety monitoring MVP and two-week validation plan.

Some internal module names, environment variables, and early documents still use the prototype name `PawRoom`. They refer to the same product direction: a collar-based pet safety monitoring system with an interactive desktop pet world.

It is intentionally a modular NestJS monolith:

- Mock collar scenarios drive the prototype before real hardware exists.
- A rule-based `PetStateEngine` turns collar samples into pet state snapshots.
- REST endpoints expose pets, devices, timeline, credits, and one-off creation jobs.
- Socket.IO events are reserved for realtime desktop pet world updates.
- Prisma schema captures the future persistent model, but the first API pass can run with in-memory services.

## Setup

```bash
npm install
npm run verify
npm run start:dev
```

The `verify` script has no external dependencies. It validates the shared mock collar data and checks that rule-derived states match the expected scenario states.
## Persistence Mode

By default, the API uses an in-memory store so the prototype runs without local infrastructure.

To enable Prisma persistence writes:

```bash
docker compose up -d
npm run prisma:migrate
set PAWROOM_ENABLE_PRISMA_STORE=true
npm run start:dev
```

The current mode is memory-first with optional Prisma background writes. This keeps the demo stable while preparing the switch to PostgreSQL.

## MVP Boundaries

- No real collar hardware in v0.1.
- No high-frequency AI calls.
- No medical diagnosis wording.
- Safety monitoring and basic desktop pet interactions do not consume Paw Credits.
- Paw Credits are only consumed by user-triggered memory creation jobs.

## Key Files

- `../data/pawroom-mock-collar-scenarios-v0.1.json`: shared frontend/backend mock data.
- `src/state/pet-state-engine.service.ts`: rule-based collar sample to pet state mapping.
- `src/demo/mock-scenarios.loader.ts`: shared mock data loader.
- `prisma/schema.prisma`: future persistent model.

## Creation Queue Mode

By default, memory creation jobs run through the in-memory queue and complete immediately.

To use the Redis-backed BullMQ adapter:

```bash
set PAWROOM_CREATION_QUEUE=bullmq
set REDIS_URL=redis://localhost:6379
npm run start:dev
```

The BullMQ adapter starts a local worker in the same Nest process for MVP validation. A separate worker process can be split out later without changing the `CreationQueue` interface.
## Infrastructure Readiness

Run the non-strict readiness report before attempting database or Redis validation:

```bash
npm run infra:check
```

Use strict mode only when Docker/Postgres/Redis are expected to be installed and configured:

```bash
npm run infra:check:strict
```
## Smoke Tests

Run the default memory-mode API smoke after building:

```bash
npm run build
npm run smoke:api
```

When Postgres and Redis are available, run the infrastructure-backed smoke:

```bash
set PAWROOM_SMOKE_MODE=infra
set PAWROOM_ENABLE_PRISMA_STORE=true
set PAWROOM_CREATION_QUEUE=bullmq
set DATABASE_URL=postgresql://pawroom:pawroom@localhost:5432/pawroom?schema=public
set REDIS_URL=redis://localhost:6379
npm run smoke:api:infra
```
## Plan Audit

Run the static plan coverage audit to confirm the MVP backend artifacts match the planned architecture:

```bash
npm run audit:plan
```

This audit checks required modules, REST paths, WebSocket events, mock scenarios, Prisma schema, migration files, queue adapters, and verification scripts. It does not replace runtime Postgres/Redis smoke tests.
## Pixel Avatar Kit

PawSentinel also includes a visual studio flow for turning pet photos into a reusable pixel-game asset kit.

Default local mode uses `PAWROOM_IMAGE_PROVIDER=mock`, so frontend development can run without ByteDance credentials.

To use ByteDance/Volcengine image generation, put credentials in `backend/.env`:

```env
PAWROOM_IMAGE_PROVIDER=byteark
BYTEARK_API_KEY="your_api_key_here"
BYTEARK_IMAGE_ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/images/generations"
BYTEARK_IMAGE_MODEL="your_image_model_id"
BYTEARK_IMAGE_RESPONSE_FORMAT="b64_json"
BYTEARK_IMAGE_INPUT_MODE="base64"
BYTEARK_IMAGE_SOURCE_FIELD="image"
```

Main API flow:

```text
POST /pets/:petId/visual-assets
POST /pets/:petId/pixel-avatar-kits
POST /visual-studio/pixel-avatar-kits/:kitId/select-candidate
GET  /visual-studio/pixel-avatar-kits/:kitId
```

Run the local flow check:

```bash
npm run smoke:visual
```

More detail: `../docs/pawroom-pixel-avatar-kit-architecture-v0.1.md`.
