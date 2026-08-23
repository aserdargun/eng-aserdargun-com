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
