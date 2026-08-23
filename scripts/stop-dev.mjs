import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PORT = 4173;
const PROJECT_ROOT = realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

function runLsof(args) {
  try {
    return execFileSync('lsof', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

export function listenerPids(port = PORT) {
  const output = runLsof(['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']);
  return output ? [...new Set(output.split(/\s+/).map(Number).filter(Number.isInteger))] : [];
}

export function listenerCwd(pid) {
  const output = runLsof(['-a', '-p', String(pid), '-d', 'cwd', '-Fn']);
  const cwdLine = output.split('\n').find((line) => line.startsWith('n'));
  if (!cwdLine) return null;

  try {
    return realpathSync(cwdLine.slice(1));
  } catch {
    return null;
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function stopProjectServer({ port = PORT, root = PROJECT_ROOT } = {}) {
  const pids = listenerPids(port);
  if (pids.length === 0) {
    console.log(`Port ${port} is already free.`);
    return { stopped: [] };
  }

  const foreign = pids.filter((pid) => listenerCwd(pid) !== root);
  if (foreign.length > 0) {
    const details = foreign.map((pid) => `${pid}:${listenerCwd(pid) ?? 'unknown'}`).join(', ');
    throw new Error(`Refusing to stop port ${port}: listener working directory is outside this checkout (${details}).`);
  }

  for (const pid of pids) process.kill(pid, 'SIGTERM');

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (!pids.some((pid) => listenerPids(port).includes(pid))) {
      console.log(`Stopped project listener on port ${port}.`);
      return { stopped: pids };
    }
    await wait(100);
  }

  for (const pid of pids) {
    if (listenerPids(port).includes(pid) && listenerCwd(pid) === root) {
      process.kill(pid, 'SIGKILL');
    }
  }

  await wait(100);
  if (pids.some((pid) => listenerPids(port).includes(pid))) {
    throw new Error(`Unable to stop the verified project listener on port ${port}.`);
  }

  console.log(`Force-stopped project listener on port ${port}.`);
  return { stopped: pids };
}

const invokedDirectly = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  stopProjectServer().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
