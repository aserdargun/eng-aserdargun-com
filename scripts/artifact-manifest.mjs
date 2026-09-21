import path from 'node:path';
import { recordArtifact } from './artifact-contract.mjs';

export function artifactManifest() {
  let root;
  let output;
  return {
    name: 'eng-artifact-manifest',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      output = path.resolve(root, config.build.outDir);
    },
    closeBundle() { return recordArtifact(root, output); },
  };
}
