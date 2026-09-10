import { defineConfig } from '@playwright/test';

const port = Number(process.env.ENG_TEST_PORT ?? 43181);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid ENG_TEST_PORT');
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  outputDir: process.env.ENG_TEST_OUTPUT ?? '/tmp/eng-audit-43179-playwright',
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
