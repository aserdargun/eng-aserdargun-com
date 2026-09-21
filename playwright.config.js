import { defineConfig } from '@playwright/test';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';

// Isolate verification from developer previews and other checkouts.
// Workers reload this module: inherit the runner's port instead of allocating another.
const port = Number(process.env.ENG_E2E_PORT) || await new Promise((resolve, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const assigned = server.address().port;
    server.close(() => resolve(assigned));
  });
});
process.env.ENG_E2E_PORT = String(port);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  outputDir: path.join(os.tmpdir(), `eng-playwright-${port}`),
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
