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

export { CONTRACT_VERSIONS } from './contracts.js';

export function initMenu(documentRef = document, windowRef = documentRef.defaultView) {
  const button = documentRef.querySelector('[data-menu-toggle]');
  const nav = documentRef.querySelector('[data-site-nav]');
  if (!button || !nav) return;

  const controls = {
    button, nav, documentElement: documentRef.documentElement,
    pageRegions: [...(documentRef.querySelectorAll?.('main, footer') ?? [])],
  };
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const links = () => [...(nav.querySelectorAll?.('a[href]') ?? [])];
  button.addEventListener('click', () => {
    const open = !isOpen();
    setMenuState(open, controls);
    if (open) links()[0]?.focus();
  });

  const navigate = (event) => {
    const link = event.target.closest?.('a');
    if (!link) return;
    const wasOpen = isOpen();
    setMenuState(false, controls);
    if (!link.hash) {
      if (wasOpen) button.focus?.();
      return;
    }
    // Move keyboard focus to the destination before native fragment scrolling.
    const destination = documentRef.getElementById?.(decodeURIComponent(link.hash.slice(1)));
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.classList.add('is-revealed');
      destination.focus({ preventScroll: true });
    }
  };
  nav.addEventListener('click', navigate);
  documentRef.querySelector('.wordmark')?.addEventListener('click', navigate);

  documentRef.addEventListener?.('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(false, controls);
      button.focus?.();
    } else if (event.key === 'Tab') {
      const items = [button, ...links()];
      const index = items.indexOf(documentRef.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        items.at(-1).focus();
      } else if (!event.shiftKey && (index === items.length - 1 || index === -1)) {
        event.preventDefault();
        button.focus();
      }
    }
  });

  // Track the breakpoint ourselves instead of trusting a single `change` event.
  // The event can be missed or can fire while the browser is already reflowing,
  // which used to strand keyboard focus on a link inside the now-collapsed nav.
  const query = windowRef?.matchMedia?.('(min-width: 981px)');
  if (!query) return;

  let wasDesktop = query.matches;
  const afterLayout = (fn) => {
    const raf = windowRef?.requestAnimationFrame;
    if (typeof raf !== 'function') { fn(); return; }
    // Two frames: the first lets the new breakpoint styles apply, the second
    // runs once the toggle is actually displayed. Focusing an element that is
    // still `display: none` is a silent no-op, which is what stranded focus.
    raf(() => raf(fn));
  };
  const applyBreakpoint = (isDesktop) => {
    if (isDesktop === wasDesktop) return;
    const activeElement = documentRef.activeElement;
    wasDesktop = isDesktop;
    setMenuState(false, controls);
    if (isDesktop) {
      if (activeElement === button) links()[0]?.focus();
      return;
    }
    // Focus may already have been dropped to the body by the reflow itself.
    const stranded = nav.contains?.(activeElement)
      || activeElement === button
      || !activeElement || activeElement === documentRef.body;
    if (stranded) afterLayout(() => button.focus?.());
  };

  query.addEventListener?.('change', ({ matches }) => applyBreakpoint(matches));
  windowRef?.addEventListener?.('resize', () => applyBreakpoint(query.matches));
}

export function initReveals(documentRef = document, windowRef = window) {
  const sections = [...documentRef.querySelectorAll('[data-reveal]')];
  if (sections.length === 0) return;

  const motion = windowRef.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reduceMotion = motion?.matches;
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
  documentRef.addEventListener?.('focusin', (event) => {
    const section = event.target.closest?.('[data-reveal]');
    if (section) {
      section.classList.add('is-revealed');
      observer.unobserve(section);
    }
  });
  motion?.addEventListener?.('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    sections.forEach((section) => section.classList.add('is-revealed'));
  });
}
