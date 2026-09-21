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
  const server = require('node:http').createServer((_request, response) => response.end('ok'));
  server.listen(0, '127.0.0.1', () => process.send(server.address().port));
`;

async function startListener(cwd) {
  const child = spawn(process.execPath, ['-e', serverSource], { cwd, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Test listener timed out')), 5000);
      child.once('message', (value) => { clearTimeout(timer); resolve(value); });
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Test listener exited before readiness')); });
    });
    return { child, port };
  } catch (error) {
    child.kill('SIGTERM');
    throw error;
  }
}

async function cleanup(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill('SIGTERM');
  await exited;
}

test('Stop terminates a listener owned by this checkout', async () => {
  const { child, port } = await startListener(root);
  try {
    const result = await stopProjectServer({ root, port });
    assert.deepEqual(result.stopped, [child.pid]);
    assert.deepEqual(listenerPids(port), []);
  } finally { await cleanup(child); }
});

test('Stop refuses a listener owned by another working directory', async () => {
  const foreignRoot = await mkdtemp(path.join(os.tmpdir(), 'eng-stop-foreign-'));
  let child;
  try {
    const listener = await startListener(foreignRoot);
    child = listener.child;
    await assert.rejects(stopProjectServer({ root, port: listener.port }), /listener working directory is outside this checkout/i);
    assert.equal(listenerPids(listener.port).includes(child.pid), true);
  } finally {
    if (child) await cleanup(child);
    await rm(foreignRoot, { recursive: true });
  }
});
