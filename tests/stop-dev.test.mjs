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
  http.createServer((_request, response) => response.end('ok')).listen(4173, '127.0.0.1');
`;

async function waitForListener(expectedPid) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (listenerPids(4173).includes(expectedPid)) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Listener ${expectedPid} did not become ready.`);
}

function waitForExit(child) {
  if (child.exitCode !== null) return Promise.resolve();
  return new Promise((resolve) => child.once('exit', resolve));
}

test('Stop terminates a listener owned by this checkout', { concurrency: false }, async () => {
  assert.deepEqual(listenerPids(4173), []);
  const child = spawn(process.execPath, ['-e', serverSource], { cwd: root, stdio: 'ignore' });
  await waitForListener(child.pid);

  const result = await stopProjectServer({ root });
  await waitForExit(child);

  assert.deepEqual(result.stopped, [child.pid]);
  assert.deepEqual(listenerPids(4173), []);
});

test('Stop refuses a listener owned by another working directory', { concurrency: false }, async () => {
  assert.deepEqual(listenerPids(4173), []);
  const foreignRoot = await mkdtemp(path.join(os.tmpdir(), 'eng-stop-foreign-'));
  const child = spawn(process.execPath, ['-e', serverSource], {
    cwd: foreignRoot,
    stdio: 'ignore',
  });

  try {
    await waitForListener(child.pid);
    await assert.rejects(
      stopProjectServer({ root }),
      /listener working directory is outside this checkout/i,
    );
    assert.equal(listenerPids(4173).includes(child.pid), true);
  } finally {
    child.kill('SIGTERM');
    await waitForExit(child);
    await rm(foreignRoot, { recursive: true });
  }
});

