import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { SCHEMA_VERSIONS } from '../src/site-contract.js';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function filesUnder(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files.sort();
}

export function artifactContract() {
  let root;
  let outDir;
  return {
    name: 'eng-artifact-contract',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(root, config.build.outDir);
    },
    async closeBundle() {
      const files = {};
      for (const file of await filesUnder(outDir)) {
        if (file !== 'artifact-manifest.json') files[file] = sha256(await readFile(path.join(outDir, file)));
      }
      const sourceFiles = ['index.html', 'src/main.js', 'src/styles.css', 'src/site-behavior.js', 'src/site-contract.js', 'public/humanoid-exploded.png', 'public/staticwebapp.config.json'];
      const sources = {};
      for (const file of sourceFiles) sources[file] = sha256(await readFile(path.join(root, file)));
      const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
      const dirty = Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: root, encoding: 'utf8' }).trim());
      await writeFile(path.join(outDir, 'artifact-manifest.json'), JSON.stringify({
        schemaVersions: SCHEMA_VERSIONS, sourceRevision: revision, workingTreeDirty: dirty, sources, files,
      }, null, 2) + '\n');
    },
  };
}
