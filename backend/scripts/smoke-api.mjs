import { spawn } from 'node:child_process';

const port = Number(process.env.PAWROOM_SMOKE_PORT ?? 4020);
const baseUrl = `http://localhost:${port}`;
const mode = process.env.PAWROOM_SMOKE_MODE ?? 'memory';

const server = spawn(process.execPath, ['dist/main.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port),
    PAWROOM_ENABLE_PRISMA_STORE:
      mode === 'infra' ? process.env.PAWROOM_ENABLE_PRISMA_STORE ?? 'true' : 'false',
    PAWROOM_CREATION_QUEUE: mode === 'infra' ? process.env.PAWROOM_CREATION_QUEUE ?? 'bullmq' : 'memory',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const output = [];
server.stdout.on('data', (chunk) => output.push(chunk.toString()));
server.stderr.on('data', (chunk) => output.push(chunk.toString()));

try {
  await waitForHealth();
  const health = await request('/health');
  const scenarios = await request('/demo/scenarios');
  const session = await request('/demo/sessions', {
    method: 'POST',
    body: { scenarioId: 'attention_day' },
  });
  const playback = await request('/demo/sessions/' + session.sessionId + '/playback', {
    method: 'POST',
    body: { includeFirst: false },
  });
  const telemetry = await request('/devices/collar_demo_001/telemetry', {
    method: 'POST',
    body: {
      sampleId: `smoke_${Date.now()}`,
      deviceId: 'collar_demo_001',
      petId: 'pet_coco_demo',
      timestamp: '2026-07-07T14:25:00+08:00',
      zoneId: 'door',
      activityLevel: 'medium',
      motionHint: 'pacing',
      heartRateTrend: 'slightly_high',
      respirationTrend: 'slightly_high',
      restingDurationTrend: 'normal',
      battery: 21,
      confidence: 0.66,
      sessionId: session.sessionId,
    },
  });
  const creation = await request('/creations', {
    method: 'POST',
    body: {
      sessionId: session.sessionId,
      petId: 'pet_coco_demo',
      type: 'comic_card',
      inputEventIds: [telemetry.timelineEvent.id],
    },
  });
  const invalidCreation = await requestRaw('/creations', {
    method: 'POST',
    body: {
      sessionId: session.sessionId,
      petId: 'pet_coco_demo',
      type: 'bad_type',
    },
  });
  const invalidTelemetry = await requestRaw('/devices/collar_demo_001/telemetry', {
    method: 'POST',
    body: {
      petId: 'pet_coco_demo',
      zoneId: 'garage',
      activityLevel: 'medium',
      battery: 80,
      confidence: 0.8,
    },
  });
  const balanceAfterInvalidCreation = await request(
    `/credits/balance?sessionId=${encodeURIComponent(session.sessionId)}`,
  );

  assert(health.status === 'ok', 'health status must be ok');
  assert(scenarios.length === 4, 'expected four scenarios');
  assert(playback.playedSampleCount === 4, 'expected four playback samples after skipping first');
  assert(playback.snapshots.at(-1).stateKey === 'resting', 'expected playback to end in resting state');
  assert(telemetry.snapshot.stateKey === 'needs_attention', 'expected needs_attention state');
  assert(telemetry.snapshot.safetyLevel === 'watch', 'expected watch safety level');
  assert(telemetry.snapshot.bubbleText.includes('\u95e8\u53e3'), 'expected readable Chinese bubble text');
  assert(creation.status === 'completed', 'expected completed creation job');
  assert(creation.balanceAfter === 65, 'expected comic card balance after 65');
  assert(invalidCreation.status === 400, 'invalid creation type must be rejected with 400');
  assert(invalidTelemetry.status === 400, 'invalid telemetry zone must be rejected with 400');
  assert(balanceAfterInvalidCreation.balance === 65, 'invalid creation must not consume credits');

  console.log(
    JSON.stringify(
      {
        mode,
        health: health.status,
        scenarioCount: scenarios.length,
        sessionScenario: session.scenarioId,
        playbackCount: playback.playedSampleCount,
        playbackFinalState: playback.snapshots.at(-1).stateKey,
        telemetryState: telemetry.snapshot.stateKey,
        telemetrySafety: telemetry.snapshot.safetyLevel,
        creationStatus: creation.status,
        balanceAfter: creation.balanceAfter,
      },
      null,
      2,
    ),
  );
} finally {
  server.kill();
}

async function waitForHealth() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    try {
      await request('/health');
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Server did not become healthy. Output:\n${output.join('')}`);
}

async function request(path, options = {}) {
  const response = await requestRaw(path, options);
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${response.status} ${response.text}`);
  }
  return response.json;
}

async function requestRaw(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'content-type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    text,
    json: text ? JSON.parse(text) : null,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
