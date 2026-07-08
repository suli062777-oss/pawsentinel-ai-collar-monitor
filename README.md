# PawSentinel AI Collar Monitor

PawSentinel is an AI-powered pet safety monitoring prototype that combines smart collar sensing with an interactive software experience. The product concept includes a smart pet collar, a backend state engine, a desktop companion world, and lightweight mobile-style alerts. The current repository focuses on the software MVP and uses simulated collar data to validate the full hardware-to-software interaction loop.

> Note: some early design and technical documents use the prototype names PawRoom or PawGuard. They refer to the same product direction: a collar-based pet safety monitoring system with an interactive desktop pet world.

## Product Concept

PawSentinel is designed as a one-stop hardware and software system for pet safety monitoring.

- The smart collar collects activity zone, motion state, battery level, resting trend, and vital trend signals.
- The backend converts raw collar signals into safety states, alert levels, timeline events, and desktop animation commands.
- The desktop experience presents pet status as a soft cartoon scene instead of raw charts or passive surveillance video.
- The mobile concept can surface lightweight lock-screen or dynamic-island-style reminders.
- The memory studio lets users create optional sticker packs, comic cards, role cards, memory cards, or short clips from selected pet moments.

PawSentinel is not a medical diagnosis tool and does not replace real surveillance video. It is intended to make pet safety monitoring clearer, softer, and easier to keep using every day.

## MVP Scope

The repository currently validates the software side of the system:

- Mock smart-collar telemetry scenarios
- Rule-based pet state engine
- REST APIs for demo sessions, telemetry, pet state, timeline, interactions, credits, and creations
- Socket.IO realtime events for desktop pet world updates
- Credits model for user-triggered AI creation jobs
- Frontend static prototype for the desktop pet safety world
- Product, hardware, design, competitor, and integration documentation

Real collar hardware is represented through product design docs, data structures, and adapter interfaces. The MVP does not require a physical device to run.

## Repository Structure

```text
backend/   NestJS backend for collar telemetry, state engine, realtime events, and creation jobs
frontend/  Static high-fidelity desktop pet world prototype
data/      Shared mock collar scenarios and validation data
docs/      PRD, hardware design, backend architecture, design system, integration guide, and research docs
scripts/   Workspace helper scripts
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run build
npm test
npm run verify
npm run smoke:api
npm run start
```

Default backend URL:

```text
http://localhost:4000
```

The default mode uses in-memory storage and mock collar data, so Docker, PostgreSQL, and Redis are not required for the MVP demo.

### Frontend

```bash
cd frontend
node serve.mjs
```

Then open:

```text
http://127.0.0.1:4177
```

The frontend can also be opened directly from `frontend/index.html`.

## Demo Flow

1. Create a demo session from one of four collar scenarios.
2. Join the Socket.IO demo room using the returned `sessionId`.
3. Play mock telemetry samples.
4. Render `scene.animation.command` in the desktop pet world.
5. Show safety states such as `safe`, `watch`, and `attention`.
6. Trigger optional memory creation jobs that consume Paw Credits.

See the frontend integration guide:

- [Frontend Integration API](docs/pawroom-frontend-integration-api-v0.1.md)

## Key Documentation

- [Latest PRD](docs/pawroom-ai-pet-collar-platform-prd-v0.4.md)
- [Backend Architecture](docs/pawroom-backend-architecture-and-reuse-plan-v0.1.md)
- [Frontend Integration API](docs/pawroom-frontend-integration-api-v0.1.md)
- [Software Prototype Development Plan](docs/pawroom-software-prototype-development-plan-v0.1.md)
- [Design System](docs/pawroom-design-system-v0.1.md)
- [Hardware Design](docs/pawroom-collar-hardware-design-v0.1.md)
- [Competitor Analysis](docs/pawroom-competitor-analysis.md)
- [User Evidence Report](docs/pawroom-user-evidence-report.md)

## Backend Validation

Latest local validation targets:

```bash
cd backend
npm run build
npm test
npm run verify
npm run smoke:api
npm run audit:plan
```

The infrastructure-backed mode can be enabled later with PostgreSQL, Redis, Prisma, and BullMQ. For the current GitHub demo package, memory mode is the recommended path.

## Technology Stack

- Backend: NestJS, TypeScript, Prisma, Socket.IO, BullMQ
- Data: PostgreSQL-ready schema, in-memory MVP mode, shared mock telemetry JSON
- Realtime: Socket.IO events for pet state, timeline, alerts, device status, and creation jobs
- Frontend prototype: HTML, CSS, JavaScript, static assets
- Product validation: PRD, competitor analysis, user evidence, mock scenarios, smoke tests

## Safety Boundary

PawSentinel only presents daily monitoring trends and safety reminders. Vital trend fields are treated as non-medical indicators. The product does not diagnose disease, provide medical-grade monitoring, or replace veterinary care.
