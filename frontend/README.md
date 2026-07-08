# PawSentinel Frontend Prototype

This folder contains the static high-fidelity frontend prototype for the PawSentinel desktop pet safety world.

The prototype focuses on the visual and interaction layer of the product:

- Desktop pet world
- Pet state dashboard
- Daily journey timeline
- Safety, low-battery, offline, and attention states
- Creation studio entry points
- Pixel-style pet and room assets

It is currently a static prototype and can run without the backend, but it is designed to consume the backend REST and Socket.IO contract documented in:

```text
../docs/pawroom-frontend-integration-api-v0.1.md
```

## Run Locally

Open directly:

```text
frontend/index.html
```

Or start the local static server:

```bash
node serve.mjs
```

Then visit:

```text
http://127.0.0.1:4177
```

On Windows, you can also run:

```powershell
./start-preview.ps1
```

## Page Routes

```text
?page=home
?page=world
?page=data
?page=journey
?page=settings
?page=create
?page=battery
?page=profile
```

## State Modes

```text
?page=home&mode=normal
?page=world&mode=lowBattery
?page=world&mode=offline
?page=world&mode=attention
?page=data&mode=offline
?page=battery&mode=lowBattery
```

## Key Files

```text
index.html
src/app.js
src/styles.css
serve.mjs
assets/
```

## Validation

```bash
node --check src/app.js
node validate-world-assets.mjs
node audit-restoration.mjs ../docs/assets/frontend-screenshots-v0.14
```

The frontend is part of the MVP package and should be treated as a visual prototype rather than a production application.
