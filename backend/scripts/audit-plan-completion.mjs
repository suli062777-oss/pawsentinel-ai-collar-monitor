import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const repoRoot = resolve(root, '..');
const failures = [];
const warnings = [];

const requiredRestPaths = [
  '/health',
  '/demo/scenarios',
  '/demo/sessions',
  '/demo/sessions/{sessionId}/playback',
  '/pets',
  '/pets/{petId}/assets',
  '/devices/mock/connect',
  '/devices/{deviceId}/telemetry',
  '/pets/{petId}/state/latest',
  '/pets/{petId}/timeline',
  '/interactions',
  '/creations/estimate',
  '/creations',
  '/creations/{creationId}',
  '/credits/balance',
  '/settings/notifications',
];

const requiredWebsocketEvents = [
  'pet.state.updated',
  'pet.alert.created',
  'scene.animation.command',
  'timeline.event.created',
  'device.status.updated',
  'creation.job.updated',
];

const requiredSourceFiles = [
  'src/demo/demo.service.ts',
  'src/demo/demo-playback.service.ts',
  'src/pets/pets.controller.ts',
  'src/devices/devices.service.ts',
  'src/devices/telemetry-adapter.port.ts',
  'src/devices/mock-telemetry.adapter.ts',
  'src/devices/mqtt-telemetry.adapter.stub.ts',
  'src/state/pet-state-engine.service.ts',
  'src/realtime/realtime.gateway.ts',
  'src/timeline/timeline.service.ts',
  'src/creations/creations.service.ts',
  'src/creations/creation-queue.port.ts',
  'src/creations/bullmq-creation-queue.service.ts',
  'src/credits/credits.service.ts',
  'src/settings/settings.controller.ts',
  'src/store/pawroom-store.port.ts',
  'src/store/composite-store.service.ts',
  'src/store/prisma-store.service.ts',
  'src/prisma/prisma.service.ts',
];

const requiredTests = [
  'src/state/pet-state-engine.service.spec.ts',
  'src/credits/credits.service.spec.ts',
  'src/creations/creations.service.spec.ts',
  'src/devices/devices.service.spec.ts',
  'src/timeline/timeline.service.spec.ts',
  'src/realtime/realtime.gateway.spec.ts',
  'src/demo/demo-playback.service.spec.ts',
];

const requiredPrismaModels = [
  'DemoSession',
  'Pet',
  'PetAsset',
  'CollarDevice',
  'TelemetrySample',
  'PetStateSnapshot',
  'TimelineEvent',
  'CreationJob',
  'CreditLedgerEntry',
  'UserSettings',
];

checkFile('../docs/pawroom-backend-architecture-and-reuse-plan-v0.1.md', 'backend architecture plan doc');
checkFile('../data/pawroom-mock-collar-scenarios-v0.1.json', 'mock collar scenario data');
checkFile('docker-compose.yml', 'Postgres/Redis docker compose file');
checkFile('prisma/schema.prisma', 'Prisma schema');
checkFile('prisma/migrations/20260707213500_init/migration.sql', 'initial Prisma migration');
checkFile('openapi.yaml', 'OpenAPI contract');
checkFile('scripts/verify-mock-data.mjs', 'mock data verifier');
checkFile('scripts/check-infra-readiness.mjs', 'infrastructure readiness script');
checkFile('scripts/smoke-api.mjs', 'API smoke test script');

for (const file of requiredSourceFiles) {
  checkFile(file, `source file ${file}`);
}

for (const file of requiredTests) {
  checkFile(file, `test file ${file}`);
}

const pkg = readJson('package.json', 'package manifest');
if (pkg) {
  for (const dependency of ['@nestjs/core', '@prisma/client', 'socket.io', 'bullmq']) {
    check(Boolean(pkg.dependencies?.[dependency]), `dependency ${dependency}`);
  }
  for (const script of [
    'build',
    'test',
    'verify',
    'prisma:generate',
    'prisma:migrate',
    'infra:check',
    'infra:check:strict',
    'smoke:api',
    'smoke:api:infra',
  ]) {
    check(Boolean(pkg.scripts?.[script]), `npm script ${script}`);
  }
}

const mockData = readJson('../data/pawroom-mock-collar-scenarios-v0.1.json', 'mock scenario data');
if (mockData) {
  check(mockData.scenarios?.length === 4, 'exactly four mock scenarios');
  check(
    mockData.scenarios?.every((scenario) => Array.isArray(scenario.samples) && scenario.samples.length >= 5),
    'each mock scenario has at least five samples',
  );
  check(mockData.creationExamples?.length === 5, 'five creation examples');
}

const openapi = readText('openapi.yaml', 'OpenAPI contract');
if (openapi) {
  for (const path of requiredRestPaths) {
    check(openapi.includes(`  ${path}:`), `OpenAPI path ${path}`);
  }
}

const realtime = readText('src/realtime/realtime.gateway.ts', 'RealtimeGateway source');
if (realtime) {
  for (const event of requiredWebsocketEvents) {
    check(realtime.includes(event), `WebSocket event ${event}`);
  }
}

const prismaSchema = readText('prisma/schema.prisma', 'Prisma schema');
if (prismaSchema) {
  for (const model of requiredPrismaModels) {
    check(prismaSchema.includes(`model ${model} `), `Prisma model ${model}`);
  }
}

const readiness = readText('scripts/check-infra-readiness.mjs', 'infra readiness script');
if (readiness) {
  check(readiness.includes('Docker CLI'), 'infra script checks Docker');
  check(readiness.includes('REDIS_URL'), 'infra script checks Redis URL');
  check(readiness.includes('DATABASE_URL'), 'infra script checks database URL');
}

const smoke = readText('scripts/smoke-api.mjs', 'API smoke script');
if (smoke) {
  check(smoke.includes('/demo/sessions/') && smoke.includes('/playback'), 'smoke covers demo playback');
  check(smoke.includes('/devices/collar_demo_001/telemetry'), 'smoke covers telemetry ingestion');
  check(smoke.includes('/creations'), 'smoke covers creation job');
}

if (process.env.DATABASE_URL || process.env.REDIS_URL) {
  warnings.push('External infra env vars are set; use smoke:api:infra for runtime DB/Redis validation.');
} else {
  warnings.push('External Postgres/Redis runtime validation is not proven in this environment.');
}

if (failures.length > 0) {
  console.error('PawRoom backend plan audit failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('PawRoom backend plan audit passed.');
if (warnings.length > 0) {
  console.log('Warnings:');
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

function checkFile(relativePath, label) {
  check(existsSync(resolve(root, relativePath)), label);
}

function readJson(relativePath, label) {
  const text = readText(relativePath, label);
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch (error) {
    failures.push(`${label} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function readText(relativePath, label) {
  const absolutePath = relativePath.startsWith('../')
    ? resolve(repoRoot, relativePath.slice(3))
    : resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`missing ${label}`);
    return undefined;
  }
  return readFileSync(absolutePath, 'utf8');
}

function check(condition, label) {
  if (!condition) {
    failures.push(label);
  }
}
