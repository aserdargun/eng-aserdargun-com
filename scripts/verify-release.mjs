import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { sha256 } from './artifact-contract.mjs';
import { SCHEMA_VERSIONS } from '../src/site-contract.js';

const registryPath = process.argv[2];
assert.ok(registryPath, 'Provide the canonical living-system.json path.');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const eng = registry.applications.find((app) => app.code === 'eng');
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
assert.equal(eng?.releaseSha, revision, 'Canonical ENG releaseSha must match this release commit.');
const manifest = JSON.parse(await readFile('dist/artifact-manifest.json', 'utf8'));
assert.deepEqual(manifest.schemaVersions, SCHEMA_VERSIONS);
assert.equal(manifest.sourceRevision, revision);
assert.equal(manifest.workingTreeDirty, false, 'Rebuild from a clean, recorded commit before publication.');
for (const file of ['index.html', 'humanoid-exploded.png', 'staticwebapp.config.json']) {
  assert.match(manifest.files?.[file] ?? '', /^[a-f0-9]{64}$/, `Missing artifact fingerprint: ${file}`);
}
for (const file of ['index.html', 'public/humanoid-exploded.png', 'public/staticwebapp.config.json']) {
  assert.match(manifest.sources?.[file] ?? '', /^[a-f0-9]{64}$/, `Missing source fingerprint: ${file}`);
}
for (const [file, hash] of Object.entries(manifest.files)) {
  assert.equal(sha256(await readFile(`dist/${file}`)), hash, `Artifact drift: ${file}`);
}
for (const [file, hash] of Object.entries(manifest.sources)) {
  assert.equal(sha256(await readFile(file)), hash, `Source drift: ${file}`);
}
assert.doesNotMatch(await readFile('dist/index.html', 'utf8'), /\/src\/|localhost|127\.0\.0\.1/);
console.log(`Release artifact and canonical ENG record agree: ${revision}`);
