import '@fontsource-variable/archivo/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';

import { initMenu, initReveals } from './site-behavior.js';

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('js');
  initMenu(document);
  initReveals(document, window);
}
