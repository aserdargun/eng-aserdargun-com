# Open Humanoid Engineering Manifesto Design

## Purpose

Build an English, public, static manifesto website for a future open engineering school. The site explains a four-year AI-native curriculum that progresses from chemistry to materials, mechanics, electrical engineering, and computer science, with biomechanics and neuroengineering running throughout. It must describe an ambition, not imply that the learning platform or a physical humanoid already exists.

## Information architecture

1. **Manifesto:** “Build intelligence from matter up.” Explain why AI-era engineering must reconnect computation to matter, energy, bodies, and verifiable evidence.
2. **Curriculum:** Four project years: intelligent limb; fixed-base upper body; walking full-body digital twin; autonomous digital humanoid.
3. **Platform:** All laboratories are digital and AI-generated. Teams reproduce, explain, extend, challenge, and publish labs with their own AI agents. Evaluation uses an AI jury plus open evidence-based appeals.
4. **Specializations:** Seven fifth-year interdisciplinary portfolios.
5. **Production gate:** A design that survives advanced digital testing becomes a production candidate, never an automatically validated physical product.

## Product boundaries

- Static presentation website only; no accounts, AI integration, laboratory runtime, credential engine, backend, cloud deployment, DNS, or physical robotics system.
- Public GitHub repository named `aserdargun/eng-aserdargun-com` on branch `main`.
- English-only content in this first release.
- Portfolio evidence replaces degree claims; the website must not use B.Eng. or M.Eng. labels.

## Visual system

- Radical engineering field manual combined with Swiss editorial design.
- True mineral-white background, near-black typography, electric cobalt blue, and safety-lime accents; a single near-black platform band.
- Large grotesk headlines, restrained monospace utility copy, technical rules and measurement marks.
- Open editorial bands and numbered rails instead of rounded card grids.
- A transparent exploded humanoid schematic is the only generated production image. Supporting diagrams use HTML/CSS/SVG.
- Responsive layout must preserve the hierarchy at 1440px desktop and 390px mobile without horizontal overflow.
- Respect reduced-motion preferences and provide strong keyboard focus, semantic landmarks, skip navigation, and sufficient contrast.

## Required interactions

- Sticky header links scroll to their corresponding sections.
- Mobile navigation opens and closes with an accessible button, closes after navigation, and restores a clear compact header state.
- The hero actions scroll to the manifesto and curriculum; GitHub actions point to the public repository.
- Progressive reveal motion may enhance sections but all content remains visible without JavaScript.

## Local project contract

- Plain semantic HTML, CSS, and JavaScript served and built with Vite.
- `npm run dev:codex` starts only on `127.0.0.1:4173` with strict port handling.
- `npm run validate:codex` runs content/contract tests, production build, artifact checks, browser tests, and whitespace validation.
- `npm run stop:codex` stops only a listener proven to belong to this checkout.
- Run, Validate, and Stop actions are exposed in `.codex/environments/environment.toml`.

## Acceptance criteria

- All approved manifesto claims, four years, platform stages, seven specializations, and production-candidate caveat are visible in English.
- The built `dist/` site contains the production image and has no broken local references.
- Desktop and mobile browser checks show meaningful content, no console warnings/errors, no framework overlay, no horizontal overflow, working navigation, and a functional mobile menu.
- Validation, Run, and Stop complete successfully and Stop leaves port 4173 free.
- Final `main` is clean and matches the pushed public GitHub branch.

