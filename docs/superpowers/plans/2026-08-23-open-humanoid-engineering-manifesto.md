# Open Humanoid Engineering Manifesto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished English static manifesto website for the Open Humanoid Engineering curriculum.

**Architecture:** Use Vite only as a static development/build tool around semantic `index.html`, a single design-system stylesheet, and a small progressive-enhancement script. Keep curriculum and manifesto copy in HTML for resilience and SEO; use Node contract tests plus Playwright browser tests for content, interaction, accessibility signals, and responsive behavior.

**Tech Stack:** HTML5, CSS, JavaScript, Vite, Node test runner, Playwright Chromium

**Spec:** `docs/superpowers/specs/2026-08-23-open-humanoid-engineering-manifesto-design.md`

## Global Constraints

- Repository: `aserdargun/eng-aserdargun-com`, public, default branch `main`.
- English-only static website; no backend, authentication, AI runtime, credentials, deployment, DNS, or physical-hardware claims.
- Visual direction: mineral white, near black, cobalt blue, safety lime, technical editorial rails, no generic rounded-card grid.
- Every claim about the curriculum is aspirational and the production gate caveat remains visible.
- Local URL is exactly `http://127.0.0.1:4173`.

---

### Task 1: Static project contract

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.codex/environments/environment.toml`
- Create: `scripts/stop-dev.mjs`
- Create: `tests/project-contract.test.mjs`

**Interfaces:**
- Produces scripts `dev:codex`, `build`, `test:unit`, `test:e2e`, `validate:codex`, and `stop:codex`.
- Serves Vite on `127.0.0.1:4173` and builds to `dist/`.

- [ ] Write `tests/project-contract.test.mjs` to require the exact script names, environment action order, loopback host, strict port, and checkout-scoped stop implementation.
- [ ] Run `node --test tests/project-contract.test.mjs` and confirm failure because the contract files do not exist.
- [ ] Add the minimal manifest, Vite config, environment TOML, and stop script needed by the assertions.
- [ ] Install locked dependencies with `npm install` and rerun the contract test until green.
- [ ] Commit the independently passing project contract.

### Task 2: Manifesto content and semantics

**Files:**
- Create: `index.html`
- Create: `tests/manifesto-content.test.mjs`
- Create: `public/humanoid-exploded.png`

**Interfaces:**
- Produces landmarks and anchors `manifesto`, `curriculum`, `platform`, `specializations`, and `production-gate`.
- Exposes the mobile menu button through `[data-menu-toggle]` and navigation through `[data-site-nav]`.

- [ ] Write content tests for the H1, five-discipline order, biomechanics rail, four yearly outputs, five AI-lab stages, seven specializations, open-portfolio language, and production-candidate caveat.
- [ ] Run the test and confirm it fails because `index.html` is missing.
- [ ] Implement semantic English HTML with skip link, header/nav, all five sections, accessible buttons/links, and footer.
- [ ] Copy the approved transparent humanoid production asset into `public/` with descriptive alt text in the markup.
- [ ] Rerun content and contract tests until green, then commit.

### Task 3: Visual design and progressive enhancement

**Files:**
- Create: `src/styles.css`
- Create: `src/main.js`
- Create: `tests/client-behavior.test.mjs`

**Interfaces:**
- `setMenuState(open: boolean)` synchronizes `aria-expanded`, the navigation state, and document scrolling.
- Hash navigation closes the mobile menu; section reveals are optional enhancement only.

- [ ] Write behavior tests for exported menu state, close-after-navigation, and reduced-motion-safe initialization.
- [ ] Run the behavior test and confirm it fails because `src/main.js` is missing.
- [ ] Implement the minimum menu/reveal behavior and connect it from `index.html`.
- [ ] Implement the extracted design tokens, desktop composition, black platform band, curriculum rails, specialization list, keyboard focus, reduced motion, and mobile layout.
- [ ] Rerun unit tests and build until green, then commit.

### Task 4: Browser and artifact validation

**Files:**
- Create: `playwright.config.js`
- Create: `e2e/manifesto.spec.js`
- Create: `tests/dist-artifact.test.mjs`

**Interfaces:**
- Browser base URL is `http://127.0.0.1:4173`.
- E2E covers desktop navigation, mobile menu, page identity, console health, and overflow.

- [ ] Write artifact and browser tests before wiring them into validation.
- [ ] Run them and confirm expected failure before the build/server contract exists.
- [ ] Configure Playwright webServer and implement artifact checks for HTML, image, and local references.
- [ ] Validate desktop 1440×1000 and mobile 390×844 interactions and visual structure.
- [ ] Add all checks to `validate:codex`, rerun the full validation, and commit.

### Task 5: Public repository handoff

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `.github/workflows/validate.yml`

**Interfaces:**
- CI runs the locked install, Chromium setup, and `npm run validate:codex` on pushes and pull requests.
- README documents Setup, Run, Validate, Stop, scope, curriculum, and non-deployment boundary.

- [ ] Add repository documentation, MIT license, and validation workflow.
- [ ] Run setup, Validate, Run, HTTP/browser probes, Stop, `git diff --check`, and status inspection from a clean branch.
- [ ] Compare the final desktop/mobile screenshots with the generated visual concepts and fix every material mismatch.
- [ ] Merge the verified feature branch into `main`, rerun validation, create the public GitHub repository, push `main`, and verify remote visibility and commit equality.

