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

## Revision 04 verification and publication

The site remains an English-only proposal. The four-year spine, AI lab pipeline,
seven specializations, dated frontier sources, and production gate stay in `index.html`.
The frontier's curriculum responses are editorial interpretations, and the proposed
lab architecture is distinguished from the working HEX companion.

Browser tests exercise the prebuilt `dist/` on a separate strict loopback port
(default `43181`, overridable with `ENG_TEST_PORT`). Build first when running
`npm run test:e2e` on its own. Test screenshots and traces go to `/tmp/eng-audit-43179-playwright`
(or `ENG_TEST_OUTPUT`). Stop-command tests use OS-assigned ports and do not touch
an existing development listener.

`src/site-contract.js` records behavior version 2 and artifact export schema 1.
Experiment, world, simulation, and metric schema versions are explicitly `null`:
this website implements none of those executable systems. UI observations never
change the curriculum or its evidence.

Each Vite build produces `dist/artifact-manifest.json`, recording the source commit,
working-tree state, source hashes, and hashes for all emitted assets. Local builds
may be dirty; they are not release evidence. Before deployment, the workflow reads
`aserdargun/aserdargun-com/data/living-system.json` and requires its ENG `releaseSha`
to equal the clean build's commit:

```sh
node scripts/verify-release.mjs /path/to/aserdargun-com/data/living-system.json
```

Record the intended commit in the canonical registry before publishing. Do not
advance `lastReleased` or claim a live deployment based on local validation alone.
The gate deliberately rejects stale registry records, modified sources, and changed
artifacts. No publication is performed by the local validation command.
