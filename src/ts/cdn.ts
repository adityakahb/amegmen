/**
 * @fileoverview CDN entry point for AMegMen.
 *
 * Exposes `AMegMen` as `window.AMegMen` when loaded via a plain `<script>` tag.
 * Attaches `autoInit` as a static method so CDN users can call
 * `AMegMen.autoInit('[data-amegmen]')` without a separate import.
 *
 * The `DOMContentLoaded` auto-init side-effect from `index.ts` still runs,
 * so placing `<script src="amegmen.cdn.js"></script>` in the page head is
 * sufficient to initialise all `[data-amegmen]` elements automatically.
 *
 * @example
 * ```html
 * <!-- Automatic init (data-amegmen attribute) -->
 * <nav data-amegmen data-amegmen-navigation-label="Main">…</nav>
 * <script src="amegmen.cdn.min.js"></script>
 *
 * <!-- Manual init -->
 * <script src="amegmen.cdn.min.js"></script>
 * <script>
 *   const menu = new AMegMen(document.querySelector('nav'));
 *   // or:
 *   AMegMen.autoInit('[data-mega-nav]', { openOnMouseover: true });
 * </script>
 * ```
 */

import { AMegMen, autoInit } from './index';

// Attach autoInit as a static convenience method so CDN users do not need a
// separate import. Cast is required because TypeScript does not allow adding
// arbitrary properties to a class type after declaration.
(AMegMen as unknown as Record<string, unknown>).autoInit = autoInit;

export default AMegMen;
