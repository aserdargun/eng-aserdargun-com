import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);

test('production artifact contains the manifesto and generated humanoid asset', async () => {
  const html = await readFile(new URL('index.html', dist), 'utf8');

  assert.match(html, /Build intelligence/);
  assert.match(html, /Production Candidate/);
  await access(new URL('humanoid-exploded.png', dist));
});

test('production HTML has no unresolved source entry references', async () => {
  const html = await readFile(new URL('index.html', dist), 'utf8');

  assert.doesNotMatch(html, /\/src\//);
  assert.doesNotMatch(html, /localhost|127\.0\.0\.1/);
});

