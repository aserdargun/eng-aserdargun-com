import assert from 'node:assert/strict';
import test from 'node:test';

import { initMenu, initReveals, setMenuState } from '../src/site-behavior.js';

function createClassList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    toggle: (name, force) => {
      if (force) values.add(name);
      else values.delete(name);
    },
    contains: (name) => values.has(name),
  };
}

function createTarget() {
  const listeners = new Map();
  return {
    attributes: new Map(),
    classList: createClassList(),
    dataset: {},
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    dispatch(type, event = {}) {
      listeners.get(type)?.(event);
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    getAttribute(name) {
      return this.attributes.get(name);
    },
  };
}

test('setMenuState keeps button, navigation, and document state synchronized', () => {
  const button = createTarget();
  const nav = createTarget();
  const documentElement = { classList: createClassList() };
  const pageRegions = [{ inert: false }, { inert: false }];

  setMenuState(true, { button, nav, documentElement, pageRegions });
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.equal(button.getAttribute('aria-label'), 'Close navigation');
  assert.equal(nav.dataset.open, 'true');
  assert.equal(documentElement.classList.contains('menu-open'), true);
  assert.equal(pageRegions.every((region) => region.inert), true);

  setMenuState(false, { button, nav, documentElement, pageRegions });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(button.getAttribute('aria-label'), 'Open navigation');
  assert.equal(nav.dataset.open, 'false');
  assert.equal(documentElement.classList.contains('menu-open'), false);
  assert.equal(pageRegions.every((region) => !region.inert), true);
});

test('initMenu toggles from the button and closes after hash navigation', () => {
  const button = createTarget();
  button.setAttribute('aria-expanded', 'false');
  const nav = createTarget();
  const documentElement = { classList: createClassList() };
  const documentRef = {
    documentElement,
    querySelector(selector) {
      if (selector === '[data-menu-toggle]') return button;
      if (selector === '[data-site-nav]') return nav;
      return null;
    },
  };

  initMenu(documentRef);
  button.dispatch('click');
  assert.equal(button.getAttribute('aria-expanded'), 'true');

  nav.dispatch('click', { target: { closest: () => ({ hash: '#curriculum' }) } });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
});

test('initReveals reveals everything immediately when reduced motion is requested', () => {
  const sections = [createTarget(), createTarget()];
  const documentRef = {
    querySelectorAll: () => sections,
  };
  const windowRef = {
    matchMedia: () => ({ matches: true }),
  };

  initReveals(documentRef, windowRef);
  assert.equal(sections.every((section) => section.classList.contains('is-revealed')), true);
});
