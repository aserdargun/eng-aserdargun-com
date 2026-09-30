import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('README documents the manifesto and complete local lifecycle', async () => {
  const readme = await read('README.md');

  assert.match(readme, /Open Humanoid Engineering/i);
  assert.match(readme, /npm ci/);
  assert.match(readme, /npm run dev:codex/);
  assert.match(readme, /npm run validate:codex/);
  assert.match(readme, /npm run stop:codex/);
  assert.match(readme, /https:\/\/github\.com\/aserdargun\/eng-aserdargun-com/);
});

test('repository carries an MIT license', async () => {
  const license = await read('LICENSE');

  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026/);
});

test('continuous validation runs the same local contract', async () => {
  const workflow = await read('.github/workflows/validate.yml');

  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /playwright install --with-deps chromium/);
  assert.match(workflow, /npm run validate:codex/);
});

test('Azure deployment workflow publishes only the verified static artifact', async () => {
  const workflow = await read('.github/workflows/deploy-swa-eng-aserdargun-com.yml');

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /group: swa-eng-aserdargun-com-production/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(workflow, /Azure\/static-web-apps-deploy@4d27395796ac319302594769cfe812bd207490b1/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run validate:codex/);
  assert.match(workflow, /azure_static_web_apps_api_token: \$\{\{ secrets\.AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_ENG_ASERDARGUN_COM \}\}/);
  assert.match(workflow, /app_location: dist/);
  assert.match(workflow, /skip_app_build: true/);
  assert.match(workflow, /output_location: ""/);
});
