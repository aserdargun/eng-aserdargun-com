import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { verifyArtifact, verifyReleaseIdentity } from './artifact-contract.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const registryFile = process.argv[2] || path.resolve(root, '../aserdargun-com/data/living-system.json');
try {
  const manifest = await verifyArtifact(root, path.join(root, 'dist'));
  const expectedSha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  verifyReleaseIdentity(manifest, JSON.parse(await readFile(registryFile, 'utf8')), expectedSha);
  console.log(`Release identity and artifact verified: ${expectedSha}`);
} catch (error) {
  console.error(`Release rejected: ${error.message}`);
  process.exitCode = 1;
}
