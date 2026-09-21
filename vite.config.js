import { defineConfig } from 'vite';
import { artifactManifest } from './scripts/artifact-manifest.mjs';

export default defineConfig({
  plugins: [artifactManifest()],
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
});
