import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('README documents the manifesto and complete local lifecycle', async () => {
  const readme = await read('README.md');

  assert.match(readme, /Open Humanoid Engineering/i);
  assert.match(readme, /npm ci/);
  assert.match(readme, /npm run dev:codex/);
  assert.match(readme, /npm run validate:codex/);
  assert.match(readme, /npm run stop:codex/);
  assert.match(readme, /https:\/\/github\.com\/aserdargun\/eng-aserdargun-com/);
});

test('repository carries an MIT license', async () => {
  const license = await read('LICENSE');

  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026/);
});

test('continuous validation runs the same local contract', async () => {
  const workflow = await read('.github/workflows/validate.yml');

  assert.match(workflow, /npm ci/);
  assert.match(workflow, /playwright install --with-deps chromium/);
  assert.match(workflow, /npm run validate:codex/);
});
