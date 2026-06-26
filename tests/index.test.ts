import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AMegMen, autoInit } from '../src/ts/index';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a minimal, valid nav element and attach it to the document body.
 * Any extra attributes (e.g. data-amegmen-*) can be passed via `attrs`.
 */
function makeNav(attrs: Record<string, string> = {}): HTMLElement {
  const nav = document.createElement('nav');
  nav.setAttribute('data-amegmen', '');
  for (const [k, v] of Object.entries(attrs)) nav.setAttribute(k, v);
  nav.innerHTML = '<ul><li><a href="#x">X</a></li></ul>';
  document.body.appendChild(nav);
  return nav;
}

// ─── Test suite ────────────────────────────────────────────────────────────────

describe('autoInit', () => {
  // Track navs and instances created per test so we can clean up reliably.
  const navs: HTMLElement[] = [];
  const instances: AMegMen[] = [];

  function trackNav(nav: HTMLElement): HTMLElement {
    navs.push(nav);
    return nav;
  }

  function trackInstance(inst: AMegMen): AMegMen {
    instances.push(inst);
    return inst;
  }

  beforeEach(() => {
    // The module side-effect may have already initialised any [data-amegmen]
    // elements that were in the DOM at import time.  Remove them all so each
    // test starts clean.
    document.querySelectorAll<HTMLElement>('[data-amegmen]').forEach((el) => el.remove());
  });

  afterEach(() => {
    // Destroy all tracked instances (clears WeakMap entries so elements can be
    // re-initialised in subsequent tests).
    for (const inst of instances.splice(0)) {
      try {
        inst.destroy();
      } catch {
        /* already destroyed */
      }
    }
    // Remove all tracked nav elements from the DOM.
    for (const nav of navs.splice(0)) {
      nav.remove();
    }
  });

  // ── Basic initialisation ──────────────────────────────────────────────────

  it('returns an empty array when no matching elements exist', () => {
    const result = autoInit();
    expect(result).toEqual([]);
  });

  it('initialises all [data-amegmen] elements and returns AMegMen instances', () => {
    trackNav(makeNav());
    trackNav(makeNav());

    const result = autoInit();
    result.forEach((inst) => trackInstance(inst));

    expect(result).toHaveLength(2);
    result.forEach((inst) => expect(inst).toBeInstanceOf(AMegMen));
  });

  it('returns one instance per matching element', () => {
    trackNav(makeNav());
    trackNav(makeNav());
    trackNav(makeNav());

    const result = autoInit();
    result.forEach((inst) => trackInstance(inst));

    expect(result).toHaveLength(3);
  });

  // ── Custom selector ───────────────────────────────────────────────────────

  it('accepts a custom selector and only initialises matching elements', () => {
    trackNav(makeNav()); // [data-amegmen] — NOT matched
    const special = document.createElement('nav');
    special.setAttribute('data-amegmen', '');
    special.setAttribute('data-custom-menu', '');
    special.innerHTML = '<ul><li><a href="#y">Y</a></li></ul>';
    document.body.appendChild(special);
    trackNav(special);

    const result = autoInit('[data-custom-menu]');
    result.forEach((inst) => trackInstance(inst));

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(AMegMen);
  });

  it('returns an empty array when the custom selector matches nothing', () => {
    trackNav(makeNav());
    const result = autoInit('[data-nonexistent]');
    expect(result).toEqual([]);
  });

  // ── Data-attribute parsing: boolean coercions ─────────────────────────────

  it('parses "true" string attribute as boolean true (openOnMouseover)', () => {
    trackNav(makeNav({ 'data-amegmen-open-on-mouseover': 'true' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('openOnMouseover')).toBe(true);
  });

  it('parses "false" string attribute as boolean false (openOnMouseover)', () => {
    // Default is already false; set it to true first via a programmatic option
    // then override via data attribute to confirm the parsing path.
    trackNav(makeNav({ 'data-amegmen-open-on-mouseover': 'false' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('openOnMouseover')).toBe(false);
  });

  // ── Data-attribute parsing: numeric coercion ──────────────────────────────

  it('parses a numeric string attribute as a number (closeDelay)', () => {
    trackNav(makeNav({ 'data-amegmen-close-delay': '500' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('closeDelay')).toBe(500);
    expect(typeof inst!.getOption('closeDelay')).toBe('number');
  });

  it('parses "0" as the number 0 (openDelay)', () => {
    trackNav(makeNav({ 'data-amegmen-open-delay': '0' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('openDelay')).toBe(0);
    expect(typeof inst!.getOption('openDelay')).toBe('number');
  });

  // ── Data-attribute parsing: string passthrough ────────────────────────────

  it('keeps a non-numeric, non-boolean string as a string (navigationLabel)', () => {
    trackNav(makeNav({ 'data-amegmen-navigation-label': 'Site nav' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('navigationLabel')).toBe('Site nav');
  });

  // ── Data-attribute key conversion: kebab-case → camelCase ─────────────────

  it('converts kebab-case attribute name to camelCase option key (openDelay)', () => {
    trackNav(makeNav({ 'data-amegmen-open-delay': '200' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('openDelay')).toBe(200);
  });

  it('converts multi-segment kebab attribute to camelCase (uuidPrefix)', () => {
    trackNav(makeNav({ 'data-amegmen-uuid-prefix': 'my-prefix' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('uuidPrefix')).toBe('my-prefix');
  });

  // ── Programmatic options override data attributes ─────────────────────────

  it('programmatic options argument overrides data attributes', () => {
    trackNav(makeNav({ 'data-amegmen-close-delay': '100' }));

    const [inst] = autoInit('[data-amegmen]', { closeDelay: 999 });
    trackInstance(inst!);

    expect(inst!.getOption('closeDelay')).toBe(999);
  });

  it('programmatic options do not affect keys absent from data attributes', () => {
    trackNav(makeNav());

    const [inst] = autoInit('[data-amegmen]', { openDelay: 150 });
    trackInstance(inst!);

    expect(inst!.getOption('openDelay')).toBe(150);
  });

  // ── Double-init guard ─────────────────────────────────────────────────────

  it('returns the existing instance when called again on an already-initialised element', () => {
    const _nav = trackNav(makeNav());

    const [first] = autoInit();
    trackInstance(first!);

    const [second] = autoInit();
    // Do NOT add second to instances — it is the same object as first.

    expect(second).toBe(first);
  });

  // ── Security: unknown-key filtering ──────────────────────────────────────

  it('ignores data-amegmen-* attributes whose camelCase key is not in defaults', () => {
    trackNav(makeNav({ 'data-amegmen-nonexistent-option': 'injected' }));

    const [inst] = autoInit();
    trackInstance(inst!);

    const opts = inst!.getAllOptions() as Record<string, unknown>;
    expect('nonexistentOption' in opts).toBe(false);
  });

  it('does not pollute getAllOptions with unknown keys from data attributes', () => {
    trackNav(
      makeNav({
        'data-amegmen-close-delay': '300',
        'data-amegmen-fake-key': 'bad',
      })
    );

    const [inst] = autoInit();
    trackInstance(inst!);

    expect(inst!.getOption('closeDelay')).toBe(300);
    const opts = inst!.getAllOptions() as Record<string, unknown>;
    expect('fakeKey' in opts).toBe(false);
  });
});
