import { describe, it, expect, afterEach } from 'vitest';
import AMegMenDefault from '../src/ts/cdn';
import { AMegMen } from '../src/ts/index';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal, valid [data-amegmen] nav and attach it to the body. */
function makeNav(): HTMLElement {
  const nav = document.createElement('nav');
  nav.setAttribute('data-amegmen', '');
  nav.innerHTML = '<ul><li><a href="#x">X</a></li></ul>';
  document.body.appendChild(nav);
  return nav;
}

// The CDN entry attaches autoInit as a static method. Narrow the type so the
// test can call it without `any`.
type CdnAMegMen = typeof AMegMen & {
  autoInit: (selector?: string) => AMegMen[];
};

// ─── Test suite ────────────────────────────────────────────────────────────────

describe('cdn entry', () => {
  const created: AMegMen[] = [];
  const navs: HTMLElement[] = [];

  afterEach(() => {
    for (const inst of created.splice(0)) {
      try {
        inst.destroy();
      } catch {
        /* already destroyed */
      }
    }
    for (const nav of navs.splice(0)) nav.remove();
  });

  it('default-exports the AMegMen class', () => {
    // The CDN build exposes the class directly as `window.AMegMen`, so the
    // default export must be the same class as the named export from index.
    expect(AMegMenDefault).toBe(AMegMen);
  });

  it('attaches autoInit as a static method on the class', () => {
    expect(typeof (AMegMenDefault as CdnAMegMen).autoInit).toBe('function');
  });

  it('static autoInit initialises matching elements', () => {
    const nav = makeNav();
    navs.push(nav);

    const result = (AMegMenDefault as CdnAMegMen).autoInit('[data-amegmen]');
    result.forEach((inst) => created.push(inst));

    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toBeInstanceOf(AMegMen);
  });
});
