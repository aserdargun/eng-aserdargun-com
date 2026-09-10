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

export { SCHEMA_VERSIONS } from './site-contract.js';

export function initMenu(documentRef = document, windowRef = documentRef.defaultView) {
  const button = documentRef.querySelector('[data-menu-toggle]');
  const nav = documentRef.querySelector('[data-site-nav]');
  if (!button || !nav) return;

  const controls = {
    button,
    nav,
    documentElement: documentRef.documentElement,
    pageRegions: [...(documentRef.querySelectorAll?.('main, footer') ?? [])],
  };
  const mobile = windowRef?.matchMedia?.('(max-width: 980px)');
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const focusDestination = (link) => {
    if (!link.hash) return;
    const destination = documentRef.getElementById?.(link.hash.slice(1));
    destination?.setAttribute('tabindex', '-1');
    destination?.focus({ preventScroll: true });
  };
  button.addEventListener('click', () => {
    setMenuState(!isOpen(), controls);
  });

  nav.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (!link) return;
    const wasOpen = isOpen();
    setMenuState(false, controls);
    focusDestination(link);
    if (!link.hash && wasOpen) button.focus?.();
  });

  documentRef.querySelector('.wordmark')?.addEventListener('click', (event) => {
    setMenuState(false, controls);
    focusDestination(event.currentTarget);
  });

  mobile?.addEventListener('change', () => {
    const focusWasInNav = nav.contains?.(documentRef.activeElement);
    const focusWasToggle = documentRef.activeElement === button;
    setMenuState(false, controls);
    if (mobile.matches && focusWasInNav) button.focus();
    if (!mobile.matches && focusWasToggle) nav.querySelector('a')?.focus();
  });

  documentRef.addEventListener?.('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(false, controls);
      button.focus?.();
    } else if (event.key === 'Tab') {
      const links = [...documentRef.querySelectorAll('.site-header a, .site-header button')];
      const first = links[0];
      const last = links.at(-1);
      if (event.shiftKey && documentRef.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && documentRef.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
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
    { rootMargin: '0px 0px -24px 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}
