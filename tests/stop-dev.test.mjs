import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, realpath, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { listenerPids, stopProjectServer } from '../scripts/stop-dev.mjs';

const root = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const serverSource = `
  const http = require('node:http');
  const server = http.createServer((_request, response) => response.end('ok'));
  server.listen(0, '127.0.0.1', () => process.send(server.address().port));
`;

async function startListener(cwd) {
  const child = spawn(process.execPath, ['-e', serverSource], {
    cwd, stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });
  const port = await new Promise((resolve, reject) => {
    child.once('message', resolve);
    child.once('error', reject);
    child.once('exit', () => reject(new Error('Test listener exited before readiness.')));
  });
  return { child, port };
}

function waitForExit(child) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => child.once('exit', resolve));
}

test('Stop terminates a listener owned by this checkout', { concurrency: false }, async () => {
  const { child, port } = await startListener(root);
  try {
    const result = await stopProjectServer({ root, port });
    await waitForExit(child);
    assert.deepEqual(result.stopped, [child.pid]);
    assert.deepEqual(listenerPids(port), []);
  } finally {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    await waitForExit(child);
  }
});

test('Stop refuses a listener owned by another working directory', { concurrency: false }, async () => {
  const foreignRoot = await mkdtemp(path.join(os.tmpdir(), 'eng-stop-foreign-'));
  const { child, port } = await startListener(foreignRoot);

  try {
    await assert.rejects(
      stopProjectServer({ root, port }),
      /listener working directory is outside this checkout/i,
    );
    assert.equal(listenerPids(port).includes(child.pid), true);
  } finally {
    child.kill('SIGTERM');
    await waitForExit(child);
    await rm(foreignRoot, { recursive: true });
  }
});
