import { spawn } from 'node:child_process';

const port = Number(process.env.PAWROOM_VISUAL_SMOKE_PORT ?? 4021);
const baseUrl = `http://localhost:${port}`;

const server = spawn(process.execPath, ['dist/main.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port),
    PAWROOM_IMAGE_PROVIDER: process.env.PAWROOM_IMAGE_PROVIDER ?? 'mock',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const output = [];
server.stdout.on('data', (chunk) => output.push(chunk.toString()));
server.stderr.on('data', (chunk) => output.push(chunk.toString()));

try {
  await waitForHealth();
  const provider = await request('/visual-studio/provider');
  const styles = await request('/visual-studio/styles');
  const source = await request('/pets/pet_pixel_demo/visual-assets/from-url', {
    method: 'POST',
    body: {
      url: 'data:image/png;base64,ZmFrZV9wZXRfcGhvdG8=',
      label: 'demo pet front photo',
      mimeType: 'image/png',
    },
  });
  const kit = await request('/pets/pet_pixel_demo/pixel-avatar-kits', {
    method: 'POST',
    body: {
      sourceAssetIds: [source.assetId],
      petName: 'Coco',
      species: 'dog',
      traitNotes: ['golden fur', 'round face', 'small tail'],
      candidateCount: 2,
    },
  });
  const completed = await request(`/visual-studio/pixel-avatar-kits/${kit.kitId}/select-candidate`, {
    method: 'POST',
    body: {
      candidateAssetId: kit.candidates[0].assetId,
    },
  });

  assert(provider.activeProvider === 'mock', 'default visual provider should be mock');
  assert(styles.length >= 1, 'expected at least one pixel style');
  assert(kit.status === 'awaiting_selection', 'kit should wait for candidate selection');
  assert(kit.candidates.length === 2, 'expected two avatar candidates');
  assert(completed.status === 'completed', 'selected kit should be completed');
  assert(completed.assets.some((asset) => asset.kind === 'scene_token'), 'completed kit should include scene token');
  assert(completed.assets.some((asset) => asset.kind === 'sticker_happy'), 'completed kit should include stickers');

  console.log(
    JSON.stringify(
      {
        provider: provider.activeProvider,
        style: styles[0].key,
        sourceAssetId: source.assetId,
        kitId: kit.kitId,
        candidateCount: kit.candidates.length,
        completedStatus: completed.status,
        generatedAssetCount: completed.assets.length,
        selectedAvatarAssetId: completed.selectedAvatarAssetId,
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
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'content-type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${response.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
