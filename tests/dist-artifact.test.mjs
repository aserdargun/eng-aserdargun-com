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


test('artifact fingerprints match every emitted asset and the current source inputs', async () => {
  const { sha256 } = await import('../scripts/artifact-contract.mjs');
  const { SCHEMA_VERSIONS } = await import('../src/site-contract.js');
  const manifest = JSON.parse(await readFile(new URL('artifact-manifest.json', dist), 'utf8'));
  assert.deepEqual(manifest.schemaVersions, SCHEMA_VERSIONS);
  assert.match(manifest.sourceRevision, /^[a-f0-9]{40}$/);
  for (const required of ['index.html', 'humanoid-exploded.png', 'staticwebapp.config.json']) {
    assert.ok(manifest.files[required], `${required} is fingerprinted`);
  }
  for (const [file, hash] of Object.entries(manifest.files)) {
    assert.equal(sha256(await readFile(new URL(file, dist))), hash, file);
  }
  for (const [file, hash] of Object.entries(manifest.sources)) {
    assert.equal(sha256(await readFile(new URL(`../${file}`, import.meta.url))), hash, file);
  }
  assert.equal(manifest.files['humanoid-exploded.png'], manifest.sources['public/humanoid-exploded.png']);
});
