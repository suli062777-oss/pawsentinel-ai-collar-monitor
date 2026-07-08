# PawSentinel Frontend Prototype

This folder contains the static high-fidelity frontend prototype for the PawSentinel desktop pet safety world.

The prototype focuses on the visual and interaction layer of the product:

- Desktop pet world
- Pet state dashboard
- Daily journey timeline
- Safety, low-battery, offline, and attention states
- Creation studio entry points
- Pixel-style pet and room assets
- Backend-driven mock collar scenarios
- Realtime state updates through Socket.IO

It can still run as a standalone visual prototype, but the P0 demo path now automatically connects to the backend when it is available. The frontend consumes the backend REST and Socket.IO contract documented in:

```text
../docs/pawroom-frontend-integration-api-v0.1.md
```

## Run Locally

### Visual-only mode

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

### Backend-connected mode

Start the backend first:

```powershell
cd ../backend
npm.cmd run start
```

Then open the frontend:

```text
http://127.0.0.1:4177/?page=world
```

By default, the frontend connects to:

```text
http://localhost:4000
```

If the backend is running on another URL, pass it in the query string:

```text
http://127.0.0.1:4177/?page=world&api=http://localhost:4001
```

The demo control bar lets reviewers switch mock collar scenarios, reconnect to the backend, and play the current scenario as a timed realtime sequence.

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

## P0 Demo Flow

```text
Backend mock collar data
  -> Pet state engine
  -> Socket.IO realtime events
  -> Desktop pet world animation, safety status, alerts, and timeline
```

Supported scenario IDs:

```text
quiet_day
active_day
waiting_day
attention_day
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
