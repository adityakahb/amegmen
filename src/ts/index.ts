/**
 * @fileoverview AMegMen library entry point (ESM / CJS / UMD).
 *
 * Named exports:
 *   - {@link AMegMen}   — the main class
 *   - {@link autoInit}  — helper to batch-initialise via `[data-amegmen]` attributes
 *   - {@link MegaMenuOptions} — TypeScript option interface (type-only re-export)
 *
 * The module has a side-effect on load: it auto-initialises all
 * `[data-amegmen]` elements already in the document, or registers a
 * `DOMContentLoaded` listener if the DOM is still loading.
 *
 * To suppress the auto-init side-effect, import only from the class file:
 * ```ts
 * import { AMegMen } from 'amegmen/dist/scripts/amegmen.esm.js';
 * ```
 */

import { AMegMen } from './amegmen';
import type { MegaMenuOptions } from './types';

export { AMegMen };
export type { MegaMenuOptions };

// ─── Data-attribute option parser ─────────────────────────────────────────────

/**
 * Reads `data-amegmen-*` attributes from `el` and returns them as a partial
 * `MegaMenuOptions` object.
 *
 * Conversion rules:
 *  - Attribute names are converted from `kebab-case` to `camelCase`.
 *  - String `"true"` / `"false"` values are coerced to booleans.
 *  - Numeric strings (e.g. `"1280"`) are coerced to numbers.
 *  - All other values are kept as strings.
 *  - Keys that do not exist in `AMegMen.defaults` are silently ignored,
 *    preventing prototype pollution.
 *
 * @param el - The element whose `data-amegmen-*` attributes to read.
 * @returns A partial options object ready to spread into constructor options.
 *
 * @example
 * ```html
 * <nav data-amegmen data-amegmen-open-on-mouseover="true" data-amegmen-desktop-breakpoint="1024">
 * ```
 * produces `{ openOnMouseover: true, desktopBreakpoint: 1024 }`
 */
function parseDataOptions(el: HTMLElement): Partial<MegaMenuOptions> {
  const opts: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    if (!attr.name.startsWith('data-amegmen-')) continue;
    const key = attr.name
      .slice('data-amegmen-'.length)
      .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    if (!(key in AMegMen.defaults)) continue;
    const raw = attr.value;
    if (raw === 'true') opts[key] = true;
    else if (raw === 'false') opts[key] = false;
    else if (raw !== '' && !Number.isNaN(Number(raw))) opts[key] = Number(raw);
    else opts[key] = raw;
  }
  // The cast is needed: opts is Record<string,unknown> which is not structurally
  // assignable to Partial<MegaMenuOptions> without it.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return opts as Partial<MegaMenuOptions>;
}

// ─── Explicit-init helper ─────────────────────────────────────────────────────

/**
 * Initialises all elements matching `selector` as accessible mega menus.
 *
 * Each matching element's `data-amegmen-*` attributes are parsed as options;
 * the programmatic `options` argument overrides those values.
 *
 * @param selector - CSS selector for nav elements to initialise.
 *   Defaults to `'[data-amegmen]'`.
 * @param options - Options that override data-attribute values for every matched element.
 * @returns An array of the created {@link AMegMen} instances.
 *
 * @example
 * ```ts
 * import { autoInit } from 'amegmen';
 *
 * const menus = autoInit('[data-mega-nav]', { openOnMouseover: true });
 * menus[0].openPanelAt(0);
 * ```
 */
export function autoInit(
  selector = '[data-amegmen]',
  options: Partial<MegaMenuOptions> = {}
): AMegMen[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
    (el) => new AMegMen(el, { ...parseDataOptions(el), ...options })
  );
}

// ─── Auto-init side-effect ────────────────────────────────────────────────────

/**
 * Runs on module load. Initialises all `[data-amegmen]` elements already
 * present in the document, or defers to `DOMContentLoaded` if the document
 * is still being parsed.
 *
 * This side-effect is intentional for CDN / plain `<script>` usage where the
 * developer does not call `autoInit()` manually.
 */
if (typeof document !== 'undefined') {
  const run = (): void => {
    document.querySelectorAll<HTMLElement>('[data-amegmen]').forEach((el) => {
      new AMegMen(el, parseDataOptions(el));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
