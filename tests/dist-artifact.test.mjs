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


import { verifyArtifact, verifyReleaseRecord } from '../scripts/artifact-contract.mjs';

test('built bytes match the source and complete artifact record', async () => {
  await verifyArtifact();
});

test('publication rejects missing, stale, dirty, or mismatched release evidence', () => {
  const sha = 'a'.repeat(40);
  const manifest = { workingTreeDirty: false, releaseSha: sha };
  const data = { applications: [{ code: 'eng', releaseSha: sha }] };
  verifyReleaseRecord(manifest, data, sha);
  assert.throws(() => verifyReleaseRecord(manifest, { applications: [] }, sha));
  assert.throws(() => verifyReleaseRecord(manifest, { applications: [{ code: 'eng' }] }, sha));
  assert.throws(() => verifyReleaseRecord(manifest, data, 'b'.repeat(40)));
  assert.throws(() => verifyReleaseRecord({ ...manifest, workingTreeDirty: true }, data, sha));
});
