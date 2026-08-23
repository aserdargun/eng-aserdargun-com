import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('package scripts expose the complete local project contract', async () => {
  const packageJson = JSON.parse(await read('package.json'));

  assert.equal(packageJson.type, 'module');
  assert.deepEqual(
    Object.keys(packageJson.scripts),
    ['dev:codex', 'build', 'test:unit', 'test:e2e', 'validate:codex', 'stop:codex'],
  );
  assert.match(packageJson.scripts['dev:codex'], /127\.0\.0\.1/);
  assert.match(packageJson.scripts['dev:codex'], /4173/);
  assert.match(packageJson.scripts['dev:codex'], /--strictPort/);
  assert.match(packageJson.scripts['validate:codex'], /git diff --check/);
});

test('Vite is locked to the project loopback preview address', async () => {
  const config = await read('vite.config.js');

  assert.match(config, /host:\s*['"]127\.0\.0\.1['"]/);
  assert.match(config, /port:\s*4173/);
  assert.match(config, /strictPort:\s*true/);
});

test('Codex exposes ordered Setup, Run, Validate, and Stop actions', async () => {
  const environment = await read('.codex/environments/environment.toml');

  assert.match(environment, /version = 1/);
  assert.match(environment, /script = "npm ci && npx playwright install chromium"/);
  assert.deepEqual(
    [...environment.matchAll(/^\[\[actions\]\]\nname = "([^"]+)"$/gm)].map((match) => match[1]),
    ['Run', 'Validate', 'Stop'],
  );
  assert.match(environment, /command = "npm run dev:codex"/);
  assert.match(environment, /command = "npm run validate:codex"/);
  assert.match(environment, /command = "npm run stop:codex"/);
});

test('Stop implementation is port-bounded and checks listener ownership', async () => {
  const stopScript = await read('scripts/stop-dev.mjs');

  assert.match(stopScript, /4173/);
  assert.match(stopScript, /listener working directory/i);
  assert.match(stopScript, /SIGTERM/);
  assert.match(stopScript, /SIGKILL/);
  assert.doesNotMatch(stopScript, /pkill/);
});
