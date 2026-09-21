import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
import { CONTRACT_VERSIONS } from '../src/contracts.js';

const sourcePaths = ['index.html', 'src/main.js', 'src/styles.css', 'src/site-behavior.js', 'src/contracts.js', 'src/versions.json', 'public/humanoid-exploded.png', 'public/staticwebapp.config.json', 'package-lock.json', 'vite.config.js', 'scripts/artifact-contract.mjs'];
const digest = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
async function filesIn(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(directory, name));
    else files.push(name);
  }
  return files.sort();
}
async function hashes(root, files) {
  return Object.fromEntries(await Promise.all(files.map(async file => [file, await digest(path.join(root, file))])));
}

export async function recordArtifact(root = projectRoot, outDir = path.join(root, 'dist')) {
  const manifest = {
    versions: CONTRACT_VERSIONS,
    releaseSha: git(root, ['rev-parse', 'HEAD']),
    workingTreeDirty: Boolean(git(root, ['status', '--porcelain', '--untracked-files=normal'])),
    sources: await hashes(root, sourcePaths),
    files: await hashes(outDir, (await filesIn(outDir)).filter(file => file !== 'release-manifest.json')),
  };
  await writeFile(path.join(outDir, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

export async function verifyArtifact(root = projectRoot, outDir = path.join(root, 'dist')) {
  const manifest = JSON.parse(await readFile(path.join(outDir, 'release-manifest.json'), 'utf8'));
  assert.deepEqual(manifest.versions, CONTRACT_VERSIONS, 'Artifact contract versions differ');
  assert.match(manifest.releaseSha, /^[a-f0-9]{40}$/, 'Artifact requires a release SHA');
  assert.deepEqual(manifest.sources, await hashes(root, sourcePaths), 'Artifact source content is stale');
  const files = (await filesIn(outDir)).filter(file => file !== 'release-manifest.json');
  assert.deepEqual(manifest.files, await hashes(outDir, files), 'Artifact files differ from their recorded hashes');
  for (const file of files.filter(file => /\.(html|js|css)$/.test(file))) {
    assert.doesNotMatch(await readFile(path.join(outDir, file), 'utf8'), /\/src\/|localhost|127\.0\.0\.1/, `Unresolved development reference: ${file}`);
  }
  assert.equal(manifest.files['humanoid-exploded.png'], manifest.sources['public/humanoid-exploded.png']);
  assert.equal(manifest.files['staticwebapp.config.json'], manifest.sources['public/staticwebapp.config.json']);
  return manifest;
}

export function verifyReleaseIdentity(manifest, registry, expectedSha) {
  assert.match(expectedSha ?? '', /^[a-f0-9]{40}$/, 'A full release SHA is required');
  assert.equal(registry.applications.filter(app => app.code === 'eng').length, 1, 'Exactly one ENG record is required');
  assert.equal(manifest.workingTreeDirty, false, 'Release requires a clean source checkout at build time');
  assert.equal(manifest.releaseSha, expectedSha, 'Artifact must match the intended release SHA');
  assert.equal(registry.applications.find(app => app.code === 'eng')?.releaseSha, expectedSha,
    'ENG releaseSha must be recorded in living-system.json before publication');
}

export const verifyReleaseRecord = verifyReleaseIdentity;
