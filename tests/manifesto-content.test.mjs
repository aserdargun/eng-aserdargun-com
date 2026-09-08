import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('document identity and manifesto thesis are explicit', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>ENG - Humanoid Engineering<\/title>/);
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/eng\.aserdargun\.com\/" \/>/);
  assert.match(html, /<h1[^>]*>\s*Build intelligence\s*<span>from matter up\.<\/span>\s*<\/h1>/);
  assert.match(html, /Engineering has to become whole again\./);
  assert.match(html, /open, AI-native curriculum/i);
  assert.match(html, /Revision 03 · September 2026/);
});

test('the foundational sequence and continuous human reference are preserved', () => {
  const sequence = [
    'Chemistry',
    'Materials',
    'Mechanics',
    'Electrical',
    'Computer Science',
  ];
  let cursor = -1;

  for (const discipline of sequence) {
    const next = html.indexOf(`>${discipline}<`, cursor + 1);
    assert.ok(next > cursor, `${discipline} must follow the preceding discipline`);
    cursor = next;
  }

  assert.match(html, /Biomechanics \+ Neuroengineering/);
  assert.match(html, /AI from day one/i);
  assert.match(html, /teamwork in every studio/i);
});

test('the curriculum defines four project years and their outputs', () => {
  assert.equal((html.match(/data-year="[1-4]"/g) ?? []).length, 4);
  for (const output of [
    'Intelligent limb',
    'Fixed-base upper body',
    'Walking full-body twin',
    'Autonomous digital humanoid',
  ]) {
    assert.match(html, new RegExp(output, 'i'));
  }
});

test('the AI laboratory pipeline is ordered and evidence based', () => {
  const stages = ['Reproduce', 'Explain', 'Extend', 'Challenge', 'Publish'];
  let cursor = html.indexOf('data-lab-pipeline');

  for (const stage of stages) {
    const next = html.indexOf(`>${stage}<`, cursor + 1);
    assert.ok(next > cursor, `${stage} must follow the preceding laboratory stage`);
    cursor = next;
  }

  for (const surface of [
    'AI Lab Package',
    'Project Workspace',
    'Evidence Graph',
    'AI Jury Report',
    'Open Appeal',
  ]) {
    assert.match(html, new RegExp(surface));
  }
});

test('the 2026 frontier makes current physical AI shifts explicit and sourced', () => {
  for (const signal of [
    'Embodied reasoning',
    'Multi-embodiment policies',
    'Diagnostic simulation',
    'On-device autonomy',
    'Human-centered safety cases',
  ]) {
    assert.match(html, new RegExp(signal, 'i'));
  }

  assert.match(html, /deepmind\.google\/blog\/gemini-robotics-2/);
  assert.match(html, /Isaac GR00T 1\.7/);
  assert.match(html, /how-to-evaluate-general-purpose-robot-policies/);
  assert.match(html, /www\.w3\.org\/TR\/WCAG22/);
});

test('seven specializations and open portfolio outcomes are listed without degree claims', () => {
  assert.equal((html.match(/class="specialization-item"/g) ?? []).length, 7);
  assert.match(html, /Integrated Humanoid Engineering Portfolio/);
  assert.match(html, /Advanced Open Engineering Portfolio/);
  assert.doesNotMatch(html, /B\.Eng\.|M\.Eng\./);
});

test('production candidacy is clearly separated from physical validation', () => {
  assert.match(html, /Production Candidate/);
  assert.match(html, /does not certify a physical robot/i);
  assert.match(html, /independent physical validation/i);
});

test('navigation and public repository links expose the complete static surface', () => {
  for (const id of [
    'manifesto',
    'frontier',
    'curriculum',
    'platform',
    'specializations',
    'production-gate',
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /data-menu-toggle/);
  assert.match(html, /data-site-nav/);
  assert.match(html, /href="#specializations">Specializations<\/a>/);
  assert.match(html, /https:\/\/github\.com\/aserdargun\/eng-aserdargun-com/);
});
