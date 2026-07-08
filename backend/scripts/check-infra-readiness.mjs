import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { resolve } from 'node:path';

const strict = process.argv.includes('--strict');
const checks = [
  commandCheck('docker', ['--version'], 'Optional Docker CLI for docker compose Postgres/Redis'),
  commandCheck('redis-server', ['--version'], 'Optional local Redis server binary'),
  commandCheck('psql', ['--version'], 'Optional local PostgreSQL client binary'),
  fileCheck('prisma/schema.prisma', 'Prisma schema'),
  fileCheck('prisma/migrations/20260707213500_init/migration.sql', 'Initial Prisma migration SQL'),
  envCheck('DATABASE_URL', 'PostgreSQL connection string'),
  envCheck('REDIS_URL', 'Redis connection string'),
];

if (process.env.DATABASE_URL) {
  checks.push(await tcpUrlCheck(process.env.DATABASE_URL, 5432, 'PostgreSQL TCP connectivity'));
}

if (process.env.REDIS_URL) {
  checks.push(await tcpUrlCheck(process.env.REDIS_URL, 6379, 'Redis TCP connectivity'));
}

console.log('PawRoom infrastructure readiness report');
for (const check of checks) {
  const marker = check.ok ? 'OK ' : 'MISS';
  console.log(`[${marker}] ${check.name}${check.detail ? ` - ${check.detail}` : ''}`);
}

const baseRequirementNames = ['Prisma schema', 'Initial Prisma migration SQL'];
const strictRequirementNames = [
  ...baseRequirementNames,
  'PostgreSQL connection string',
  'Redis connection string',
  'PostgreSQL TCP connectivity',
  'Redis TCP connectivity',
];
const requirementNames = strict ? strictRequirementNames : baseRequirementNames;
const hardRequirements = checks.filter((check) => requirementNames.includes(check.name));
const missingHard = hardRequirements.filter((check) => !check.ok);
if (missingHard.length > 0) {
  process.exit(1);
}

function commandCheck(command, args, name) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  return {
    name,
    ok: result.status === 0,
    detail: result.status === 0 ? firstLine(result.stdout || result.stderr) : 'not available',
  };
}

function fileCheck(relativePath, name) {
  const absolute = resolve(process.cwd(), relativePath);
  return {
    name,
    ok: existsSync(absolute),
    detail: relativePath,
  };
}

function envCheck(key, name) {
  return {
    name,
    ok: Boolean(process.env[key]),
    detail: process.env[key] ? `${key} is set` : `${key} is not set`,
  };
}

function firstLine(value) {
  return String(value).split(/\r?\n/).find(Boolean) ?? '';
}

function tcpUrlCheck(rawUrl, defaultPort, name) {
  return new Promise((resolveCheck) => {
    let url;
    try {
      url = new URL(rawUrl);
    } catch {
      resolveCheck({ name, ok: false, detail: 'invalid URL' });
      return;
    }

    const host = url.hostname;
    const port = Number(url.port || defaultPort);
    const socket = net.createConnection({ host, port });
    const finish = (ok, detail) => {
      socket.destroy();
      resolveCheck({ name, ok, detail });
    };

    socket.setTimeout(2000);
    socket.once('connect', () => finish(true, `${host}:${port} reachable`));
    socket.once('timeout', () => finish(false, `${host}:${port} timeout`));
    socket.once('error', (error) => finish(false, `${host}:${port} ${error.code ?? error.message}`));
  });
}