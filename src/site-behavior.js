export function setMenuState(open, { button, nav, documentElement, pageRegions = [] }) {
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.dataset.open = String(open);
  documentElement.classList.toggle('menu-open', open);

  const label = button.querySelector?.('[data-menu-label]');
  if (label) label.textContent = open ? 'Close' : 'Menu';

  pageRegions.forEach((region) => {
    region.inert = open;
  });
}

export function initMenu(documentRef = document) {
  const button = documentRef.querySelector('[data-menu-toggle]');
  const nav = documentRef.querySelector('[data-site-nav]');
  if (!button || !nav) return;

  const controls = {
    button,
    nav,
    documentElement: documentRef.documentElement,
    pageRegions: [...(documentRef.querySelectorAll?.('main, footer') ?? [])],
  };
  button.addEventListener('click', () => {
    setMenuState(button.getAttribute('aria-expanded') !== 'true', controls);
  });

  nav.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (link?.hash) setMenuState(false, controls);
  });

  documentRef.addEventListener?.('keydown', (event) => {
    if (event.key !== 'Escape' || button.getAttribute('aria-expanded') !== 'true') return;
    setMenuState(false, controls);
    button.focus?.();
  });
}

export function initReveals(documentRef = document, windowRef = window) {
  const sections = [...documentRef.querySelectorAll('[data-reveal]')];
  if (sections.length === 0) return;

  const reduceMotion = windowRef.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in windowRef)) {
    sections.forEach((section) => section.classList.add('is-revealed'));
    return;
  }

  const observer = new windowRef.IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );

  sections.forEach((section) => observer.observe(section));
}
