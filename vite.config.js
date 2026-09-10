import { defineConfig } from 'vite';
import { artifactContract } from './scripts/artifact-contract.mjs';

export default defineConfig({
  plugins: [artifactContract()],
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

