# ENG working contract

- Build ENG — the live, public manifesto for project-based, AI-native humanoid engineering education (the embodied horizon the aserdargun learning system serves).
- Keep manifesto truth in `index.html` and behavior in `src/site-behavior.js`; never invent degree claims, never claim a physical humanoid is built, never add backend, live data fetches, persistent state, or non-Vite build paths. The four-year spine (Chemistry → Materials → Mechanics → Electrical → Computer Science) and the seven specializations are the curriculum's primary source of truth.
- Decision inputs are the manifesto content in `index.html` (the four-year spine, AI lab pipeline, 2026 frontier signals, specialization list, production-gate language) and the dated evidence in `aserdargun-com/data/living-system.json`. Rendered DOM, menu state, reveal state, console diagnostics, scroll overflow, and e2e test results are observer outputs and never feed back into the manifesto.
- Behavior, experiment, world, simulation, metric, and export schema versions are explicit. Update affected versions when semantics change.
- Every release ships a prebuilt `dist/` artifact whose `index.html` and `humanoid-exploded.png` match the recorded content; reject artifacts that still reference `/src/`, `localhost`, or `127.0.0.1`, and reject releases whose `releaseSha` is missing from `living-system.json`.
- Keep Turkish and English metadata in `aserdargun-com/data/living-system.json` (statusLabel, summary, tags) aligned with the English-only manifesto site; label the four-year spine, the AI lab pipeline, and the 2026 frontier signals as primary sources of truth.
- Verify `npm run validate:codex` and review `git diff --check` before handoff.
- Local work only unless the user authorizes external publication. Preserve unrelated work and processes.
