import { AMegMen } from '../src/ts/index';

// Pattern 3 — explicit init with hover opening
const nav3 = document.getElementById('menu-3');
if (nav3) {
  new AMegMen(nav3, {
    openOnMouseover: true,
    openDelay: 150,
    closeDelay: 300,
    navigationLabel: 'Hover navigation',
    announceOpen: true,
    desktopBreakpoint: 768,
  });
}
