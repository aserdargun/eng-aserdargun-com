# Open Humanoid Engineering — Design Refresh Audit

Date: 2026-08-29

## Audit scope

Combined UX, visual design, responsive, and screenshot-based accessibility review of the public manifesto, curriculum, frontier, platform, and mobile navigation.

User goal: understand the thesis quickly, see how current physical-AI developments change the curriculum, and identify the concrete team evidence produced at each stage.

Accessibility target: strong semantic structure, visible focus, WCAG 2.2-sized controls, reduced-motion support, responsive reflow, and a mobile menu that does not expose background content to interaction.

## Overall verdict

The original direction was distinctive and credible, but it read as a long editorial manifesto with limited orientation and very small evidence detail. Revision 02 keeps the field-manual identity while introducing a clearer information hierarchy, a sourced 2026 frontier layer, explicit team evidence, stronger CTA priority, and a true mobile navigation surface.

## Captured steps

1. `01-current-desktop-overview.png` — Original desktop entry — Healthy visual identity; weak program orientation and equal CTA priority.
2. `02-current-curriculum.png` — Original curriculum — Strong four-year story; evidence details and technical labels were too small.
3. `03-current-mobile-start.png` — Original mobile entry — Clear thesis; tall first screen and low prioritization between actions.
4. `04-current-mobile-menu.png` — Original mobile navigation — Functional; background content remained visually and semantically present.
5. `05-updated-desktop-start.png` — Revision 02 desktop entry — Healthy; clearer hierarchy, revision status, metrics, and primary action.
6. `06-updated-frontier.png` — Revision 02 frontier — Healthy; current technology shifts are translated into curriculum responses and linked to primary sources.
7. `07-updated-curriculum.png` — Revision 02 curriculum — Healthy; each year now exposes frontier topics and a concrete team evidence contract.
8. `08-updated-mobile-start.png` — Revision 02 mobile entry — Healthy; no horizontal overflow and a stronger action hierarchy.
9. `09-updated-mobile-menu.png` — Revision 02 mobile navigation — Healthy; full-screen, 44px+ targets, visible focus, and inert background regions.
10. `10-updated-mobile-platform.png` — Revision 02 mobile platform journey — Healthy; the five-stage evidence loop reflows into a readable linear sequence.

## Highest-impact changes

- Added a sourced Frontier 2026 section covering embodied reasoning, multi-embodiment VLA systems, open physics and synthetic data, on-device autonomy, and human-centered safety cases.
- Reframed every curriculum year around a public team evidence deliverable.
- Rebuilt the hero as a program control surface with revision status, metrics, a single primary CTA, and a preserved real humanoid asset.
- Replaced decorative CSS diagrams with typography-led evidence modules.
- Upgraded mobile navigation to a full-screen layer with dynamic accessible naming and inert page regions.
- Increased interactive target sizes, preserved high-visibility focus, and retained reduced-motion behavior.

## Evidence limits

The audit includes current-run screenshots, DOM inspection, console checks, interaction checks, responsive overflow checks, unit tests, and a production build. It is not a screen-reader certification or a complete WCAG conformance claim; manual assistive-technology, zoom, and contrast-tool testing remain separate checks.

## Current references

- Google DeepMind, Gemini Robotics 2: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/
- NVIDIA, Newton Physics Engine and Isaac GR00T N1.6: https://nvidianews.nvidia.com/_gallery/download_pdf/68da9f263d6332a3dba5f16c/
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
