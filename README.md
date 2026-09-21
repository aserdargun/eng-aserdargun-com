# Open Humanoid Engineering

An English manifesto for a project-based, AI-native engineering education that builds intelligence from matter up.

The proposed four-year core follows a deliberate sequence:

**Chemistry → Materials → Mechanics → Electrical → Computer Science**

Biomechanics and neuroengineering remain a continuous human reference across every year. Every course is a team project, every claim is expected to carry evidence, and specialization begins only after the shared foundation.

The public website is the evolving expression of this idea: [github.com/aserdargun/eng-aserdargun-com](https://github.com/aserdargun/eng-aserdargun-com).

## The four-year spine

1. **Chemistry → Materials:** build an intelligent limb.
2. **Mechanics:** build a fixed-base upper body.
3. **Electrical:** build a walking full-body digital twin.
4. **Computer Science:** build an autonomous digital humanoid.

The fifth year becomes an intersectional research portfolio rather than another general year.

The Platform section connects the curriculum to [HEX — Humanoid Engineering Explorer](https://hex.aserdargun.com/), an English/Turkish 3D companion application. A knee exploration exercise links component inspection to ENG project questions while keeping educational geometry and illustrative motion distinct from validated physical behavior.

Revision 05 (21 September 2026) places ENG within the [aserdargun learning system](https://aserdargun.com/#learning): WFM and SWI are parallel research paths into ITL, which leads to the ENG horizon; HEX is ENG’s exploration companion. These are educational relationships between independent sites, with no shared runtime or experiment transfer. The site remains English-only; the parent portfolio carries Turkish and English descriptions.

The frontier ledger was reviewed on 21 September 2026 against the linked DeepMind and NVIDIA primary sources. Its curriculum responses are editorial interpretations. Project outputs, the AI lab pipeline, and production-candidate review remain proposals. Evidence should identify simulated, estimated, and measured results, while human reviewers retain publication and physical-testing decisions.

## Local lifecycle

Requirements: Node.js 22+ and npm.

### Setup

```sh
npm ci
npx playwright install chromium
```

### Run

```sh
npm run dev:codex
```

Open <http://127.0.0.1:4173>.

### Validate

```sh
npm run validate:codex
```

This runs unit and contract tests, produces the static artifact, verifies the artifact, and exercises desktop and mobile browser behavior.

### Stop

```sh
npm run stop:codex
```

The stop command is project-scoped and refuses to terminate a listener owned by another working directory.

## Technology

- Semantic HTML and modern CSS
- Minimal JavaScript for navigation behavior
- Vite for the static production build
- Node test runner and Playwright for verification
- Self-hosted Archivo and IBM Plex Mono fonts

## Project status

This is an evolving public manifesto and static website. It describes an educational direction; it is not an accredited degree program, enrollment offer, or claim that the proposed physical humanoid has already been built.

## License

[MIT](LICENSE)

## Evidence and release contract

The four-year spine, AI lab pipeline, and dated 2026 frontier sources in `index.html`
are the primary content authorities. The pipeline and jury are proposed architecture;
this static site does not execute experiments, assess learners, or authorize physical robots.

`src/versions.json` records behavior version 2.1.0 and artifact export schema version 2.0.0.
Export schema 2 uses `release-manifest.json`, replacing the previous `artifact-manifest.json` layout.
Experiment, world, simulation, and metric versions are explicitly `not-applicable`: these runtimes
are not implemented in ENG. The version contract is also exported by `src/site-behavior.js`.

Vite writes `dist/release-manifest.json` with source and artifact SHA-256 checksums,
the checkout commit, and whether the working tree is dirty. Local previews may be dirty.
Publication rejects dirty artifacts, changed content, and an ENG `releaseSha` that does
not match the intended commit in the canonical `aserdargun-com/data/living-system.json`.
Before an authorized deployment, record the intended ENG commit in that repository;
the workflow checks out this evidence and verifies it before uploading `dist/`.
Historical release dates and SHAs must never be replaced by local QA results.

Browser tests use the built `dist/` via Vite preview on an isolated loopback port.
Run `npm run build` before standalone `npm run test:e2e`. Stop tests allocate their own
ports and never require the developer preview port to be free. Browser diagnostics and
failure screenshots go to the operating system temporary directory.
