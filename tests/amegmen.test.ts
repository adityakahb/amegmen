import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AMegMen } from '../src/ts/amegmen';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildNav(inner = ''): HTMLElement {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <button class="amegmen-toggle"></button>
    <ul>
      <li>
        <a href="#movies">Movies</a>
        <div class="amegmen-panel">
          <ul class="amegmen-panel-group">
            <li><a href="#action">Action</a></li>
            <li><a href="#drama">Drama</a></li>
          </ul>
        </div>
      </li>
      <li>
        <a href="#tv">TV Shows</a>
        <div class="amegmen-panel">
          <ul class="amegmen-panel-group">
            <li><a href="#crime-tv">Crime TV</a></li>
          </ul>
        </div>
      </li>
      <li><a href="#music">Music</a></li>
    </ul>
    ${inner}
  `;
  document.body.appendChild(nav);
  return nav;
}

function getMenu(nav: HTMLElement): HTMLElement {
  return nav.querySelector('ul')!;
}

function getTriggers(nav: HTMLElement): HTMLAnchorElement[] {
  // After init the <a> elements are wrapped in <h2> by AMegMen
  return Array.from(nav.querySelectorAll<HTMLAnchorElement>('ul > li > h2 > a'));
}

function getPanels(nav: HTMLElement): HTMLElement[] {
  return Array.from(nav.querySelectorAll('.amegmen-panel'));
}

function fireKey(el: Element, key: string, shiftKey = false): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AMegMen', () => {
  let nav: HTMLElement;
  let menu: AMegMen;

  beforeEach(() => {
    nav = buildNav();
    menu = new AMegMen(nav);
  });

  afterEach(() => {
    menu.destroy();
    nav.remove();
  });

  // ── Constructor ──────────────────────────────────────────────────────────

  it('prevents double-instantiation on the same element', () => {
    const second = new AMegMen(nav);
    expect(second).toBe(menu);
  });

  it('throws if no list is found', () => {
    const bare = document.createElement('nav');
    document.body.appendChild(bare);
    expect(() => new AMegMen(bare)).toThrow();
    bare.remove();
  });

  // ── ARIA setup ───────────────────────────────────────────────────────────

  it('sets aria-label on the nav', () => {
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('adds menuClass to the list', () => {
    expect(getMenu(nav).classList.contains('amegmen')).toBe(true);
  });

  it('adds js-menuClass to the list', () => {
    expect(getMenu(nav).classList.contains('js-amegmen')).toBe(true);
  });

  it('assigns unique ids to triggers', () => {
    const triggers = getTriggers(nav);
    const ids = triggers.map((t) => t.id).filter(Boolean);
    // triggers with panels get ids
    expect(ids.length).toBeGreaterThanOrEqual(2);
    expect(new Set(ids).size).toBe(ids.length); // all unique
  });

  it('sets role="button" on link-based triggers with panels', () => {
    const [movies] = getTriggers(nav);
    expect(movies?.getAttribute('role')).toBe('button');
  });

  it('sets aria-expanded="false" on triggers', () => {
    getTriggers(nav)
      .filter((t) => t.getAttribute('aria-controls'))
      .forEach((t) => {
        expect(t.getAttribute('aria-expanded')).toBe('false');
      });
  });

  it('sets aria-haspopup="true" on triggers with panels', () => {
    const [movies] = getTriggers(nav);
    expect(movies?.getAttribute('aria-haspopup')).toBe('true');
  });

  it('sets role="region" on panels', () => {
    getPanels(nav).forEach((p) => {
      expect(p.getAttribute('role')).toBe('region');
    });
  });

  it('sets aria-hidden="true" on panels initially', () => {
    getPanels(nav).forEach((p) => {
      expect(p.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('wires aria-labelledby from panel to its trigger id', () => {
    const [movies] = getTriggers(nav);
    const panel = nav.querySelector<HTMLElement>('.amegmen-panel');
    expect(panel?.getAttribute('aria-labelledby')).toBe(movies?.id);
  });

  it('wires aria-controls from trigger to panel id', () => {
    const [movies] = getTriggers(nav);
    const panel = nav.querySelector<HTMLElement>('.amegmen-panel');
    expect(movies?.getAttribute('aria-controls')).toBe(panel?.id);
  });

  it('configures the toggle button', () => {
    const btn = nav.querySelector<HTMLButtonElement>('.amegmen-toggle');
    expect(btn?.getAttribute('aria-expanded')).toBe('false');
    expect(btn?.getAttribute('aria-controls')).toBe(getMenu(nav).id);
  });

  // ── Public API ───────────────────────────────────────────────────────────

  it('getVersion returns a semver string matching package.json', () => {
    expect(AMegMen.getVersion()).toMatch(/^\d+\.\d+\.\d+/);
    expect(AMegMen.version).toBe(AMegMen.getVersion());
  });

  it('getDefaults returns the static defaults', () => {
    expect(menu.getDefaults()).toBe(AMegMen.defaults);
  });

  it('getOption returns the correct value', () => {
    expect(menu.getOption('openOnMouseover')).toBe(false);
  });

  it('getAllOptions returns a copy of settings', () => {
    const opts = menu.getAllOptions();
    expect(opts.uuidPrefix).toBe('amegmen');
    expect(opts).not.toBe((menu as unknown as { settings: object }).settings);
  });

  it('setOption updates the setting', () => {
    menu.setOption('closeDelay', 500);
    expect(menu.getOption('closeDelay')).toBe(500);
  });

  it('setOption with reinitialize re-runs init', () => {
    const spy = vi.spyOn(menu as unknown as { init(): void }, 'init');
    menu.setOption('openDelay', 100, true);
    expect(spy).toHaveBeenCalledOnce();
  });

  // ── destroy ──────────────────────────────────────────────────────────────

  it('destroy removes js-menuClass from the list', () => {
    menu.destroy();
    expect(getMenu(nav).classList.contains('js-amegmen')).toBe(false);
  });

  it('destroy allows re-instantiation', () => {
    menu.destroy();
    const fresh = new AMegMen(nav);
    expect(fresh).not.toBe(menu);
    fresh.destroy();
  });

  // ── openMenu / closeMenu ─────────────────────────────────────────────────

  it('openMenu opens the offcanvas drawer', () => {
    const toggle = nav.querySelector<HTMLButtonElement>('.amegmen-toggle')!;
    const menuEl = getMenu(nav);
    menu.openMenu();
    expect(menuEl.classList.contains('amegmen-open')).toBe(true);
    expect(nav.classList.contains('amegmen-offcanvas-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('openMenu is a no-op when already open', () => {
    menu.openMenu();
    const toggle = nav.querySelector<HTMLButtonElement>('.amegmen-toggle')!;
    // Force aria-expanded to some other value to confirm it wasn't reset
    toggle.setAttribute('aria-expanded', 'true');
    menu.openMenu(); // second call — should not toggle closed
    expect(getMenu(nav).classList.contains('amegmen-open')).toBe(true);
  });

  it('closeMenu closes the offcanvas drawer', () => {
    menu.openMenu();
    menu.closeMenu();
    const toggle = nav.querySelector<HTMLButtonElement>('.amegmen-toggle')!;
    const menuEl = getMenu(nav);
    expect(menuEl.classList.contains('amegmen-open')).toBe(false);
    expect(nav.classList.contains('amegmen-offcanvas-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closeMenu is a no-op when already closed', () => {
    // drawer starts closed — closeMenu should not throw or toggle anything
    expect(() => menu.closeMenu()).not.toThrow();
    expect(getMenu(nav).classList.contains('amegmen-open')).toBe(false);
  });

  it('openMenu collapses any open accordion panels', () => {
    const [movies] = getTriggers(nav);
    const panel = getPanels(nav)[0]!;
    // Manually open a panel first
    movies!.setAttribute('aria-expanded', 'true');
    movies!.classList.add('amegmen-open');
    panel.classList.add('amegmen-open');
    panel.setAttribute('aria-hidden', 'false');

    menu.openMenu();
    expect(panel.classList.contains('amegmen-open')).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  // ── slideDown / slideUp / slideToggle ────────────────────────────────────

  it('slideDown sets display:block on a hidden element', () => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    menu.slideDown(el);
    expect(el.style.display).toBe('block');
    el.remove();
  });

  it('slideDown is a no-op when the element is already visible', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.display = 'block';
    menu.slideDown(el);
    // height should NOT have been touched (no slide started)
    expect(el.style.height).toBe('');
    el.remove();
  });

  it('slideUp sets display:none on a visible element after transitionend', () => {
    const el = document.createElement('div');
    el.style.display = 'block';
    document.body.appendChild(el);
    menu.slideUp(el);
    // jsdom does not fire transitionend — but height should be '0px' mid-animation
    expect(el.style.height).toBe('0px');
    // Simulate transitionend so cleanup runs
    el.dispatchEvent(new Event('transitionend'));
    expect(el.style.display).toBe('none');
    expect(el.style.height).toBe('');
    expect(el.style.overflow).toBe('');
    expect(el.style.transition).toBe('');
    el.remove();
  });

  it('slideUp is a no-op when the element is already hidden', () => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    menu.slideUp(el);
    expect(el.style.height).toBe('');
    el.remove();
  });

  it('slideToggle slides down a hidden element', () => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    menu.slideToggle(el);
    expect(el.style.display).toBe('block');
    el.remove();
  });

  it('slideToggle slides up a visible element', () => {
    const el = document.createElement('div');
    el.style.display = 'block';
    document.body.appendChild(el);
    menu.slideToggle(el);
    expect(el.style.height).toBe('0px'); // mid-slide-up
    el.remove();
  });

  // ── Keyboard: Escape ─────────────────────────────────────────────────────

  it('Escape closes an open panel', () => {
    const [movies] = getTriggers(nav);
    const panel = getPanels(nav)[0]!;

    // Manually open
    movies!.setAttribute('aria-expanded', 'true');
    movies!.classList.add('amegmen-open');
    panel.classList.add('amegmen-open');
    panel.setAttribute('aria-hidden', 'false');

    fireKey(movies!, 'Escape');

    expect(movies!.getAttribute('aria-expanded')).toBe('false');
    expect(panel.classList.contains('amegmen-open')).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });

  // ── Keyboard: Enter opens a panel ────────────────────────────────────────

  it('Enter on a closed top-level trigger opens its panel', () => {
    const [movies] = getTriggers(nav);
    const panel = getPanels(nav)[0]!;

    expect(panel.classList.contains('amegmen-open')).toBe(false);
    fireKey(movies!, 'Enter');
    expect(panel.classList.contains('amegmen-open')).toBe(true);
    expect(movies!.getAttribute('aria-expanded')).toBe('true');
  });

  // ── Keyboard: Space opens a panel ────────────────────────────────────────

  it('Space on a closed top-level trigger opens its panel', () => {
    const [movies] = getTriggers(nav);
    const panel = getPanels(nav)[0]!;

    fireKey(movies!, ' ');
    expect(panel.classList.contains('amegmen-open')).toBe(true);
  });

  // ── Custom options ────────────────────────────────────────────────────────

  it('respects custom navigationLabel', () => {
    const nav2 = buildNav();
    const m2 = new AMegMen(nav2, { navigationLabel: 'Site navigation' });
    expect(nav2.getAttribute('aria-label')).toBe('Site navigation');
    m2.destroy();
    nav2.remove();
  });

  it('creates a live region when announceOpen is true', () => {
    const nav3 = buildNav();
    const m3 = new AMegMen(nav3, { announceOpen: true });
    expect(nav3.querySelector('.amegmen-sr-only[aria-live]')).not.toBeNull();
    m3.destroy();
    nav3.remove();
  });

  // ── Keyboard: top-level arrow navigation ─────────────────────────────────

  describe('Keyboard: top-level navigation', () => {
    it('ArrowDown opens the panel and focuses its first tabbable item', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = nav.querySelector<HTMLElement>('.amegmen-panel')!;
      const first = nav.querySelector<HTMLElement>('a[href="#action"]')!;

      fireKey(trigger, 'ArrowDown');

      expect(panel.classList.contains('amegmen-open')).toBe(true);
      expect(document.activeElement).toBe(first);
    });

    it('ArrowRight moves focus to the next top-level trigger', () => {
      const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const tv = nav.querySelector<HTMLElement>('a[href="#tv"]')!;

      fireKey(movies, 'ArrowRight');

      expect(document.activeElement).toBe(tv);
    });

    it('ArrowLeft moves focus to the previous top-level trigger', () => {
      const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const tv = nav.querySelector<HTMLElement>('a[href="#tv"]')!;

      fireKey(tv, 'ArrowLeft');

      expect(document.activeElement).toBe(movies);
    });

    it('Home moves focus to the first top-level trigger', () => {
      const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const music = nav.querySelector<HTMLElement>('a[href="#music"]')!;

      fireKey(music, 'Home');

      expect(document.activeElement).toBe(movies);
    });

    it('End moves focus to the last top-level trigger', () => {
      const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const music = nav.querySelector<HTMLElement>('a[href="#music"]')!;

      fireKey(movies, 'End');

      expect(document.activeElement).toBe(music);
    });

    it('Enter on an open trigger closes its panel', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = nav.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('type-ahead focuses the next matching top-level trigger', () => {
      const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const tv = nav.querySelector<HTMLElement>('a[href="#tv"]')!;

      fireKey(movies, 't'); // 't' matches 'TV Shows'

      expect(document.activeElement).toBe(tv);
    });
  });

  // ── Keyboard: inside-panel navigation ────────────────────────────────────

  describe('Keyboard: inside-panel navigation', () => {
    it('ArrowDown moves to the next tabbable item', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;

      fireKey(trigger, 'Enter'); // open panel
      fireKey(action, 'ArrowDown');

      expect(document.activeElement).toBe(drama);
    });

    it('ArrowUp moves to the previous tabbable item', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;

      fireKey(trigger, 'Enter'); // open panel
      fireKey(drama, 'ArrowUp');

      expect(document.activeElement).toBe(action);
    });

    it('Home focuses the first item in the current panel group', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;

      fireKey(trigger, 'Enter');
      fireKey(drama, 'Home');

      expect(document.activeElement).toBe(action);
    });

    it('End focuses the last item in the current panel group', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;

      fireKey(trigger, 'Enter');
      fireKey(action, 'End');

      expect(document.activeElement).toBe(drama);
    });

    it('ArrowRight with no next group moves focus back to the top-level trigger', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;

      fireKey(trigger, 'Enter');
      fireKey(action, 'ArrowRight');

      expect(document.activeElement).toBe(trigger);
    });

    it('ArrowLeft with no previous group moves focus back to the top-level trigger', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;

      fireKey(trigger, 'Enter');
      fireKey(action, 'ArrowLeft');

      expect(document.activeElement).toBe(trigger);
    });

    it('Tab moves focus to the next tabbable element in the menu', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const action = nav.querySelector<HTMLElement>('a[href="#action"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;

      fireKey(trigger, 'Enter');
      fireKey(action, 'Tab');

      expect(document.activeElement).toBe(drama);
    });

    it('Escape closes the panel and returns focus to the trigger', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = nav.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      fireKey(trigger, 'Escape');
      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });
  });

  // ── Keyboard: Shift+Tab on open top-level item ────────────────────────────

  describe('Keyboard: Shift+Tab', () => {
    it('on an open top-level trigger opens the previous panel and focuses its last item', () => {
      const tvTrigger = nav.querySelector<HTMLElement>('a[href="#tv"]')!;
      const drama = nav.querySelector<HTMLElement>('a[href="#drama"]')!;
      const panels = nav.querySelectorAll<HTMLElement>('.amegmen-panel');
      const moviesPanel = panels[0]!;
      const tvPanel = panels[1]!;

      fireKey(tvTrigger, 'Enter'); // open TV Shows
      expect(tvPanel.classList.contains('amegmen-open')).toBe(true);

      fireKey(tvTrigger, 'Tab', true); // Shift+Tab on open trigger

      expect(tvPanel.classList.contains('amegmen-open')).toBe(false);
      expect(moviesPanel.classList.contains('amegmen-open')).toBe(true);
      expect(document.activeElement).toBe(drama);
    });
  });

  // ── Panel behaviour ───────────────────────────────────────────────────────

  describe('Panel behaviour', () => {
    it('forceCloseAllPanels cancels an in-flight deferred panel-open timeout', () => {
      vi.useFakeTimers();
      try {
        const navFc = buildNav();
        const menuFc = new AMegMen(navFc, { panelCloseDuration: 200 });
        const movies = navFc.querySelector<HTMLElement>('a[href="#movies"]')!;
        const tv = navFc.querySelector<HTMLElement>('a[href="#tv"]')!;
        const panels = navFc.querySelectorAll<HTMLElement>('.amegmen-panel');

        fireKey(movies, 'Enter');
        expect(panels[0]!.classList.contains('amegmen-open')).toBe(true);

        // Switch to panel 2 — this starts a deferred open timer (200 ms)
        fireKey(tv, 'Enter');
        expect(panels[1]!.classList.contains('amegmen-open')).toBe(false);

        // Force-close before the timer fires — should cancel the deferred open
        menuFc.closePanels();
        vi.advanceTimersByTime(300);

        // Panel 2 must NOT have opened
        expect(panels[1]!.classList.contains('amegmen-open')).toBe(false);

        menuFc.destroy();
        navFc.remove();
      } finally {
        vi.useRealTimers();
      }
    });

    it('opening a second panel closes the first', () => {
      vi.useFakeTimers();
      try {
        const movies = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
        const tv = nav.querySelector<HTMLElement>('a[href="#tv"]')!;
        const panels = nav.querySelectorAll<HTMLElement>('.amegmen-panel');

        fireKey(movies, 'Enter');
        expect(panels[0]!.classList.contains('amegmen-open')).toBe(true);

        // Switching panels: first panel closes synchronously; second panel open
        // is deferred by panelCloseDuration + panelSwitchGap (default 250 + 0 ms).
        fireKey(tv, 'Enter');
        expect(panels[0]!.classList.contains('amegmen-open')).toBe(false); // closed immediately
        expect(panels[1]!.classList.contains('amegmen-open')).toBe(false); // not open yet

        vi.advanceTimersByTime(250); // let the deferred open fire
        expect(panels[1]!.classList.contains('amegmen-open')).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('gives role="separator" to hr elements inside the menu', () => {
      const navHr = document.createElement('nav');
      navHr.innerHTML = '<ul><li><a href="#a">A</a></li><hr /><li><a href="#b">B</a></li></ul>';
      document.body.appendChild(navHr);
      const m = new AMegMen(navHr);
      expect(navHr.querySelector('hr')?.getAttribute('role')).toBe('separator');
      m.destroy();
      navHr.remove();
    });
  });

  // ── Toggle button ─────────────────────────────────────────────────────────

  describe('Toggle button', () => {
    it('click toggles aria-expanded between false and true', () => {
      const btn = nav.querySelector<HTMLButtonElement>('.amegmen-toggle')!;
      expect(btn.getAttribute('aria-expanded')).toBe('false');

      btn.click();
      expect(btn.getAttribute('aria-expanded')).toBe('true');

      btn.click();
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  // ── Live region ───────────────────────────────────────────────────────────

  describe('Live region (announceOpen: true)', () => {
    let navLr: HTMLElement;
    let menuLr: AMegMen;

    beforeEach(() => {
      navLr = buildNav();
      menuLr = new AMegMen(navLr, { announceOpen: true });
    });

    afterEach(() => {
      menuLr.destroy();
      navLr.remove();
    });

    it('announces the panel label when the panel opens', () => {
      const trigger = navLr.querySelector<HTMLElement>('a[href="#movies"]')!;
      const region = navLr.querySelector<HTMLElement>('[aria-live]')!;

      fireKey(trigger, 'Enter');

      expect(region.textContent).toMatch(/expanded/i);
    });

    it('clears the live region when the panel closes', () => {
      const trigger = navLr.querySelector<HTMLElement>('a[href="#movies"]')!;
      const region = navLr.querySelector<HTMLElement>('[aria-live]')!;

      fireKey(trigger, 'Enter');
      expect(region.textContent).not.toBe('');

      fireKey(trigger, 'Escape');
      expect(region.textContent).toBe('');
    });
  });

  // ── Pattern 2: separate disclosure button ────────────────────────────────

  describe('Pattern 2 — disclosure button trigger', () => {
    let nav2: HTMLElement;
    let menu2: AMegMen;

    beforeEach(() => {
      nav2 = document.createElement('nav');
      nav2.innerHTML = `
        <button class="amegmen-toggle"></button>
        <ul>
          <li>
            <a href="/products">Products</a>
            <button type="button">Products submenu</button>
            <div class="amegmen-panel">
              <ul class="amegmen-panel-group">
                <li><a href="/design">Design</a></li>
              </ul>
            </div>
          </li>
        </ul>
      `;
      document.body.appendChild(nav2);
      menu2 = new AMegMen(nav2);
    });

    afterEach(() => {
      menu2.destroy();
      nav2.remove();
    });

    it('wires ARIA onto the button, not the link', () => {
      // The button inside <li> (not the toggle) is the disclosure trigger
      const btn = nav2.querySelector<HTMLButtonElement>('li button[aria-expanded]')!;
      expect(btn).not.toBeNull();
      expect(btn.getAttribute('aria-haspopup')).toBe('true');
      expect(btn.getAttribute('aria-controls')).not.toBeNull();
    });

    it('does not add role="button" to the adjacent link', () => {
      const link = nav2.querySelector<HTMLAnchorElement>('a[href="/products"]')!;
      expect(link.getAttribute('role')).toBeNull();
    });

    it('Enter on the button trigger opens its panel', () => {
      const btn = nav2.querySelector<HTMLButtonElement>('li button[aria-expanded]')!;
      const panel = nav2.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(btn, 'Enter');

      expect(panel.classList.contains('amegmen-open')).toBe(true);
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });

    it('click on the nav link does not open the panel', () => {
      const link = nav2.querySelector<HTMLAnchorElement>('a[href="/products"]')!;
      const panel = nav2.querySelector<HTMLElement>('.amegmen-panel')!;

      link.click();

      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });

    it('Enter on the nav link does not open the panel', () => {
      const link = nav2.querySelector<HTMLAnchorElement>('a[href="/products"]')!;
      const panel = nav2.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(link, 'Enter');

      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });

    it('Space on the nav link does not open the panel', () => {
      const link = nav2.querySelector<HTMLAnchorElement>('a[href="/products"]')!;
      const panel = nav2.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(link, ' ');

      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });
  });

  // ── Column navigation (two-column panel) ─────────────────────────────────

  describe('Column navigation', () => {
    let navCol: HTMLElement;
    let menuCol: AMegMen;

    beforeEach(() => {
      navCol = document.createElement('nav');
      navCol.innerHTML = `
        <button class="amegmen-toggle"></button>
        <ul>
          <li>
            <a href="#products">Products</a>
            <div class="amegmen-panel">
              <div class="container">
                <div class="row">
                  <div class="col amegmen-panel-group">
                    <ul><li><a href="#col1">Col 1</a></li></ul>
                  </div>
                  <div class="col amegmen-panel-group">
                    <ul><li><a href="#col2">Col 2</a></li></ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      `;
      document.body.appendChild(navCol);
      menuCol = new AMegMen(navCol);
    });

    afterEach(() => {
      menuCol.destroy();
      navCol.remove();
    });

    it('ArrowRight moves from the first group to the first item of the next group', () => {
      const trigger = navCol.querySelector<HTMLElement>('a[href="#products"]')!;
      const col1 = navCol.querySelector<HTMLElement>('a[href="#col1"]')!;
      const col2 = navCol.querySelector<HTMLElement>('a[href="#col2"]')!;

      fireKey(trigger, 'Enter'); // open panel
      fireKey(col1, 'ArrowRight');

      expect(document.activeElement).toBe(col2);
    });

    it('ArrowLeft moves from the second group to the first item of the previous group', () => {
      const trigger = navCol.querySelector<HTMLElement>('a[href="#products"]')!;
      const col1 = navCol.querySelector<HTMLElement>('a[href="#col1"]')!;
      const col2 = navCol.querySelector<HTMLElement>('a[href="#col2"]')!;

      fireKey(trigger, 'Enter'); // open panel
      fireKey(col2, 'ArrowLeft');

      expect(document.activeElement).toBe(col1);
    });

    it('ArrowRight on the last group moves focus back to the top-level trigger', () => {
      const trigger = navCol.querySelector<HTMLElement>('a[href="#products"]')!;
      const col2 = navCol.querySelector<HTMLElement>('a[href="#col2"]')!;

      fireKey(trigger, 'Enter'); // open panel
      fireKey(col2, 'ArrowRight');

      expect(document.activeElement).toBe(trigger);
    });
  });

  // ── Pointer: hover mode ───────────────────────────────────────────────────

  describe('Pointer: hover mode (openOnMouseover: true)', () => {
    let navHov: HTMLElement;
    let menuHov: AMegMen;

    beforeEach(() => {
      vi.useFakeTimers();
      navHov = buildNav();
      menuHov = new AMegMen(navHov, { openOnMouseover: true, openDelay: 200, closeDelay: 400 });
      // Hover mode is desktop-only; simulate desktop viewport
      navHov.classList.add('amegmen-desktop');
    });

    afterEach(() => {
      menuHov.destroy();
      navHov.remove();
      vi.useRealTimers();
    });

    it('pointerover opens the panel after openDelay ms', () => {
      const trigger = navHov.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navHov.querySelector<HTMLElement>('.amegmen-panel')!;

      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      expect(panel.classList.contains('amegmen-open')).toBe(false);

      vi.advanceTimersByTime(200);
      expect(panel.classList.contains('amegmen-open')).toBe(true);
    });

    it('pointerout closes the panel after closeDelay ms', () => {
      const trigger = navHov.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navHov.querySelector<HTMLElement>('.amegmen-panel')!;

      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      vi.advanceTimersByTime(200);
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      trigger.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
      vi.advanceTimersByTime(399);
      expect(panel.classList.contains('amegmen-open')).toBe(true); // not yet

      vi.advanceTimersByTime(1);
      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });

    it('pointerover cancels a pending close', () => {
      const trigger = navHov.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navHov.querySelector<HTMLElement>('.amegmen-panel')!;

      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      vi.advanceTimersByTime(200); // open

      trigger.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
      vi.advanceTimersByTime(200); // halfway through close delay

      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true })); // re-enter — cancels close
      vi.advanceTimersByTime(600); // past the original close deadline

      expect(panel.classList.contains('amegmen-open')).toBe(true);
    });

    it('mouse click on an open trigger in hover mode does NOT close the panel', () => {
      const trigger = navHov.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navHov.querySelector<HTMLElement>('.amegmen-panel')!;

      // Open via hover
      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      vi.advanceTimersByTime(200);
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      // Mouse click on the open trigger while openOnMouseover=true → link navigates naturally,
      // panel stays open (the code takes the no-op branch for mouse + hover mode)
      trigger.dispatchEvent(new PointerEvent('click', { bubbles: true, pointerType: 'mouse' }));
      expect(panel.classList.contains('amegmen-open')).toBe(true);
    });
  });

  // ── Pointer: touch click on open trigger ─────────────────────────────────

  describe('Pointer: touch click', () => {
    it('a touch-type click on an open trigger closes its panel', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = nav.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter'); // open
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      // PointerEvent with pointerType='touch' dispatched as a 'click'
      trigger.dispatchEvent(new PointerEvent('click', { bubbles: true, pointerType: 'touch' }));

      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });
  });

  // ── Keyboard: Enter on a plain link (no panel) ────────────────────────────

  describe('Keyboard: Enter on plain link', () => {
    it('navigates to the link href when Enter is pressed on a link with no panel', () => {
      const musicLink = nav.querySelector<HTMLElement>('a[href="#music"]')!;
      const before = window.location.href;

      fireKey(musicLink, 'Enter');

      expect(window.location.href).not.toBe(before);
      expect(window.location.hash).toBe('#music');
    });
  });

  // ── Pointer: click outside ────────────────────────────────────────────────

  describe('Pointer: click outside', () => {
    it('a pointerup event outside the menu closes open panels', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = nav.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      const outside = document.createElement('div');
      document.body.appendChild(outside);
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      outside.remove();

      expect(panel.classList.contains('amegmen-open')).toBe(false);
    });

    it('closeOnOutsideClick: false keeps the panel open on outside pointerup', () => {
      const navOoc = buildNav();
      const menuOoc = new AMegMen(navOoc, { closeOnOutsideClick: false });
      const trigger = navOoc.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navOoc.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      const outside = document.createElement('div');
      document.body.appendChild(outside);
      outside.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      outside.remove();

      expect(panel.classList.contains('amegmen-open')).toBe(true);
      menuOoc.destroy();
      navOoc.remove();
    });
  });

  // ── openPanelAt / closePanels ─────────────────────────────────────────────

  describe('openPanelAt / closePanels', () => {
    it('openPanelAt(0) opens the first panel', () => {
      const panel = getPanels(nav)[0]!;
      menu.openPanelAt(0);
      expect(panel.classList.contains('amegmen-open')).toBe(true);
      expect(panel.getAttribute('aria-hidden')).toBe('false');
    });

    it('openPanelAt(1) opens the second panel', () => {
      const panels = getPanels(nav);
      menu.openPanelAt(1);
      expect(panels[1]!.classList.contains('amegmen-open')).toBe(true);
    });

    it('openPanelAt closes any previously open panel', () => {
      const panels = getPanels(nav);
      menu.openPanelAt(0);
      expect(panels[0]!.classList.contains('amegmen-open')).toBe(true);
      menu.openPanelAt(1);
      expect(panels[0]!.classList.contains('amegmen-open')).toBe(false);
      expect(panels[1]!.classList.contains('amegmen-open')).toBe(true);
    });

    it('openPanelAt out-of-range index is a no-op', () => {
      expect(() => menu.openPanelAt(99)).not.toThrow();
      expect(nav.querySelector('.amegmen-open')).toBeNull();
    });

    it('closePanels closes all open panels', () => {
      menu.openPanelAt(0);
      expect(getPanels(nav)[0]!.classList.contains('amegmen-open')).toBe(true);
      menu.closePanels();
      expect(getPanels(nav)[0]!.classList.contains('amegmen-open')).toBe(false);
    });
  });

  // ── onOpen / onClose callbacks ────────────────────────────────────────────

  describe('onOpen / onClose callbacks', () => {
    it('onOpen is called when a panel opens via keyboard', () => {
      const onOpen = vi.fn();
      const navCb = buildNav();
      const menuCb = new AMegMen(navCb, { onOpen });
      const trigger = navCb.querySelector<HTMLElement>('a[href="#movies"]')!;

      fireKey(trigger, 'Enter');

      expect(onOpen).toHaveBeenCalledOnce();
      const [panelArg, triggerArg] = onOpen.mock.calls[0]!;
      expect(panelArg).toBe(navCb.querySelector('.amegmen-panel'));
      expect(triggerArg).toBe(trigger);

      menuCb.destroy();
      navCb.remove();
    });

    it('onOpen is called when a panel opens via openPanelAt', () => {
      const onOpen = vi.fn();
      const navCb = buildNav();
      const menuCb = new AMegMen(navCb, { onOpen });

      menuCb.openPanelAt(0);

      expect(onOpen).toHaveBeenCalledOnce();
      menuCb.destroy();
      navCb.remove();
    });

    it('onClose is called when a panel closes via Escape', () => {
      const onClose = vi.fn();
      const navCb = buildNav();
      const menuCb = new AMegMen(navCb, { onClose });
      const trigger = navCb.querySelector<HTMLElement>('a[href="#movies"]')!;

      fireKey(trigger, 'Enter');
      fireKey(trigger, 'Escape');

      expect(onClose).toHaveBeenCalledOnce();
      menuCb.destroy();
      navCb.remove();
    });

    it('onClose is called when a panel closes via closePanels()', () => {
      const onClose = vi.fn();
      const navCb = buildNav();
      const menuCb = new AMegMen(navCb, { onClose });

      menuCb.openPanelAt(0);
      menuCb.closePanels();

      expect(onClose).toHaveBeenCalledOnce();
      menuCb.destroy();
      navCb.remove();
    });

    it('onClose is NOT called during destroy()', () => {
      const onClose = vi.fn();
      const navCb = buildNav();
      const menuCb = new AMegMen(navCb, { onClose });

      menuCb.openPanelAt(0);
      menuCb.destroy();

      expect(onClose).not.toHaveBeenCalled();
      navCb.remove();
    });

    it('onOpen fires when ArrowUp opens the previous panel via openAndFocusLast', () => {
      const onOpen = vi.fn();
      const navOfl = buildNav();
      const menuOfl = new AMegMen(navOfl, { onOpen });
      const tv = navOfl.querySelector<HTMLElement>('a[href="#tv"]')!;
      const moviesPanel = navOfl.querySelectorAll<HTMLElement>('.amegmen-panel')[0]!;

      // Open TV Shows (panel index 1)
      fireKey(tv, 'Enter');
      onOpen.mockClear();

      // ArrowUp on the open TV trigger → calls openAndFocusLast for Movies
      fireKey(tv, 'ArrowUp');

      expect(onOpen).toHaveBeenCalledOnce();
      const [panelArg] = onOpen.mock.calls[0]!;
      expect(panelArg).toBe(moviesPanel);

      menuOfl.destroy();
      navOfl.remove();
    });
  });

  // ── justFocused guard ────────────────────────────────────────────────────
  // When keyboard focus arrives on an already-open trigger and a click fires
  // immediately after (common AT pattern), the click is swallowed so the panel
  // is not double-toggled to closed.

  describe('justFocused guard', () => {
    it('click on open trigger is a no-op when focus just arrived via keyboard', () => {
      const navJf = buildNav();
      const menuJf = new AMegMen(navJf);
      const trigger = navJf.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navJf.querySelector<HTMLElement>('.amegmen-panel')!;

      // Open the panel programmatically
      menuJf.openPanelAt(0);
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      // Keyboard focus arrives on the trigger (no prior pointerdown → justFocused = true)
      trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

      // Click fires immediately — must NOT close the panel
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      menuJf.destroy();
      navJf.remove();
    });
  });

  // ── onBeforeOpen hook ─────────────────────────────────────────────────────

  describe('onBeforeOpen hook', () => {
    it('delays panel open until done() is called', () => {
      let done: (() => void) | undefined;
      const navBo = buildNav();
      const menuBo = new AMegMen(navBo, {
        onBeforeOpen: (_panel, _trigger, d) => {
          done = d;
        },
      });
      const trigger = navBo.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navBo.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');
      expect(panel.classList.contains('amegmen-open')).toBe(false); // not open yet

      done!();
      expect(panel.classList.contains('amegmen-open')).toBe(true); // open after done()

      menuBo.destroy();
      navBo.remove();
    });

    it('onBeforeOpen receives the correct panel and trigger elements', () => {
      const received: HTMLElement[] = [];
      const navBo = buildNav();
      const menuBo = new AMegMen(navBo, {
        onBeforeOpen: (p, t, d) => {
          received.push(p, t);
          d();
        },
      });
      const trigger = navBo.querySelector<HTMLElement>('a[href="#movies"]')!;
      const panel = navBo.querySelector<HTMLElement>('.amegmen-panel')!;

      fireKey(trigger, 'Enter');

      expect(received[0]).toBe(panel);
      expect(received[1]).toBe(trigger);
      menuBo.destroy();
      navBo.remove();
    });
  });

  // ── amegmenopen / amegmenclose custom events ──────────────────────────────────────

  describe('amegmenopen / amegmenclose custom events', () => {
    it('amegmenopen fires on the panel when a panel opens', () => {
      const panel = getPanels(nav)[0]!;
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      let detail: Record<string, unknown> | null = null;

      panel.addEventListener('amegmenopen', (e) => {
        detail = (e as CustomEvent).detail as Record<string, unknown>;
      });

      fireKey(trigger, 'Enter');

      expect(detail).not.toBeNull();
      expect((detail as Record<string, unknown>).panel).toBe(panel);
    });

    it('amegmenclose fires on the panel when a panel closes', () => {
      const panel = getPanels(nav)[0]!;
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      let fired = false;

      panel.addEventListener('amegmenclose', () => {
        fired = true;
      });

      fireKey(trigger, 'Enter');
      fireKey(trigger, 'Escape');

      expect(fired).toBe(true);
    });

    it('amegmenopen bubbles to the nav element', () => {
      const trigger = nav.querySelector<HTMLElement>('a[href="#movies"]')!;
      let fired = false;
      nav.addEventListener(
        'amegmenopen',
        () => {
          fired = true;
        },
        { once: true }
      );

      fireKey(trigger, 'Enter');
      expect(fired).toBe(true);
    });

    it('amegmenclose is NOT fired during destroy()', () => {
      const panel = getPanels(nav)[0]!;
      let fired = false;
      panel.addEventListener('amegmenclose', () => {
        fired = true;
      });

      menu.openPanelAt(0);
      menu.destroy();

      expect(fired).toBe(false);
      // re-init so afterEach cleanup doesn't throw
      menu = new AMegMen(nav);
    });
  });

  // ── Per-panel animation overrides ─────────────────────────────────────────

  describe('Per-panel animation overrides', () => {
    it('data-amegmen-open-duration overrides panelOpenDuration for slideDown', () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      el.dataset.amegmenOpenDuration = '99';
      document.body.appendChild(el);

      menu.slideDown(el);

      expect(el.style.transition).toContain('99ms');
      el.remove();
    });

    it('data-amegmen-close-duration overrides panelCloseDuration for slideUp', () => {
      const el = document.createElement('div');
      el.style.display = 'block';
      el.dataset.amegmenCloseDuration = '42';
      document.body.appendChild(el);

      menu.slideUp(el);

      expect(el.style.transition).toContain('42ms');
      el.remove();
    });

    it('global panelOpenDuration is used when no data attribute is set', () => {
      const navDur = buildNav();
      const menuDur = new AMegMen(navDur, { panelOpenDuration: 123 });
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.appendChild(el);

      menuDur.slideDown(el);

      expect(el.style.transition).toContain('123ms');
      el.remove();
      menuDur.destroy();
      navDur.remove();
    });
  });

  // ── maxPanelHeight ────────────────────────────────────────────────────────

  describe('maxPanelHeight', () => {
    it('caps panel height to maxPanelHeight when content is taller', () => {
      const navMph = buildNav();
      const menuMph = new AMegMen(navMph, { maxPanelHeight: 50 });
      const el = document.createElement('div');
      el.style.display = 'none';
      // jsdom scrollHeight is 0 in unit tests; test the cap logic via the style
      // by reading what target height would be set (0 vs 50 — Math.min wins)
      Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
      document.body.appendChild(el);

      menuMph.slideDown(el);

      expect(el.style.height).toBe('50px');
      el.remove();
      menuMph.destroy();
      navMph.remove();
    });

    it('slideUp clears maxHeight and overflowY after animation', () => {
      const el = document.createElement('div');
      el.style.display = 'block';
      el.style.maxHeight = '50px';
      el.style.overflowY = 'auto';
      document.body.appendChild(el);

      menu.slideUp(el);
      el.dispatchEvent(new Event('transitionend'));

      expect(el.style.maxHeight).toBe('');
      expect(el.style.overflowY).toBe('');
      el.remove();
    });
  });

  // ── stickyOffset ──────────────────────────────────────────────────────────

  describe('stickyOffset', () => {
    it('sets --amegmen-sticky-offset CSS custom property on init', () => {
      const navSo = buildNav();
      const menuSo = new AMegMen(navSo, { stickyOffset: 64 });

      expect(navSo.style.getPropertyValue('--amegmen-sticky-offset')).toBe('64px');

      menuSo.destroy();
      navSo.remove();
    });

    it('removes --amegmen-sticky-offset on destroy', () => {
      const navSo = buildNav();
      const menuSo = new AMegMen(navSo, { stickyOffset: 64 });
      menuSo.destroy();

      expect(navSo.style.getPropertyValue('--amegmen-sticky-offset')).toBe('');
      navSo.remove();
    });

    it('does not set --amegmen-sticky-offset when stickyOffset is 0', () => {
      const navSo = buildNav();
      const menuSo = new AMegMen(navSo, { stickyOffset: 0 });

      expect(navSo.style.getPropertyValue('--amegmen-sticky-offset')).toBe('');

      menuSo.destroy();
      navSo.remove();
    });
  });

  // ── trapFocus ─────────────────────────────────────────────────────────────

  describe('trapFocus', () => {
    it('Tab on the last tabbable item wraps focus to the first', () => {
      const navTf = buildNav();
      const menuTf = new AMegMen(navTf, { trapFocus: true });
      navTf.classList.remove('amegmen-desktop'); // ensure mobile mode

      menuTf.openMenu();

      const focusable = Array.from(navTf.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.tabIndex >= 0
      );
      const last = focusable[focusable.length - 1]!;
      const first = focusable[0]!;
      last.focus();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      expect(document.activeElement).toBe(first);

      menuTf.destroy();
      navTf.remove();
    });

    it('Shift+Tab on the first tabbable item wraps focus to the last', () => {
      const navTf = buildNav();
      const menuTf = new AMegMen(navTf, { trapFocus: true });
      navTf.classList.remove('amegmen-desktop');

      menuTf.openMenu();

      const focusable = Array.from(navTf.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.tabIndex >= 0
      );
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      first.focus();

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
      );

      expect(document.activeElement).toBe(last);

      menuTf.destroy();
      navTf.remove();
    });

    it('toggle button click wires trapFocus when trapFocus: true', () => {
      const navTt = buildNav();
      const menuTt = new AMegMen(navTt, { trapFocus: true });
      navTt.classList.remove('amegmen-desktop');

      const btn = navTt.querySelector<HTMLButtonElement>('.amegmen-toggle')!;
      btn.click(); // opens offcanvas via onToggleClick → attachTrapFocus

      const focusable = Array.from(navTt.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.tabIndex >= 0
      );
      const last = focusable[focusable.length - 1]!;
      const first = focusable[0]!;
      last.focus();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      expect(document.activeElement).toBe(first);

      menuTt.destroy();
      navTt.remove();
    });

    it('trapFocus is inactive when the offcanvas is closed', () => {
      const navTf = buildNav();
      const menuTf = new AMegMen(navTf, { trapFocus: true });
      navTf.classList.remove('amegmen-desktop');
      // do NOT open the menu

      const focusable = Array.from(navTf.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.tabIndex >= 0
      );
      const last = focusable[focusable.length - 1]!;
      last.focus();

      const before = document.activeElement;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      // focus should not have been moved by the trap
      expect(document.activeElement).toBe(before);

      menuTf.destroy();
      navTf.remove();
    });
  });

  // ── Initialization attributes ─────────────────────────────────────────────

  describe('Initialization attributes', () => {
    it('sets data-amegmen-offcanvas-dir from offcanvasDirection option', () => {
      const navDir = buildNav();
      const menuDir = new AMegMen(navDir, { offcanvasDirection: 'left' });
      expect(navDir.getAttribute('data-amegmen-offcanvas-dir')).toBe('left');
      menuDir.destroy();
      navDir.remove();
    });

    it('sets data-amegmen-nav-align from navAlignment option', () => {
      const navAl = buildNav();
      const menuAl = new AMegMen(navAl, { navAlignment: 'center' });
      expect(navAl.getAttribute('data-amegmen-nav-align')).toBe('center');
      menuAl.destroy();
      navAl.remove();
    });

    it('removes data-amegmen-offcanvas-dir and data-amegmen-nav-align on destroy', () => {
      const navDd = buildNav();
      const menuDd = new AMegMen(navDd, { offcanvasDirection: 'top', navAlignment: 'right' });
      menuDd.destroy();
      expect(navDd.getAttribute('data-amegmen-offcanvas-dir')).toBeNull();
      expect(navDd.getAttribute('data-amegmen-nav-align')).toBeNull();
      navDd.remove();
    });
  });

  // ── Focus and hover classes ───────────────────────────────────────────────

  describe('Focus and hover classes', () => {
    it('adds focusClass to the focused element on focusin and removes it on focusout', () => {
      const navFc = buildNav();
      const menuFc = new AMegMen(navFc, { focusClass: 'my-focus' });
      const trigger = navFc.querySelector<HTMLElement>('ul > li > h2 > a')!;

      trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(trigger.classList.contains('my-focus')).toBe(true);

      trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(trigger.classList.contains('my-focus')).toBe(false);

      menuFc.destroy();
      navFc.remove();
    });

    it('adds hoverClass to the pointer-overed element in openOnMouseover mode', () => {
      vi.useFakeTimers();
      const navHv = buildNav();
      const menuHv = new AMegMen(navHv, {
        openOnMouseover: true,
        hoverClass: 'my-hover',
        openDelay: 100,
      });
      navHv.classList.add('amegmen-desktop');

      const trigger = navHv.querySelector<HTMLElement>('a[href="#movies"]')!;
      trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      vi.advanceTimersByTime(100);

      expect(trigger.classList.contains('my-hover')).toBe(true);

      menuHv.destroy();
      navHv.remove();
      vi.useRealTimers();
    });
  });

  // ── Animation easing ──────────────────────────────────────────────────────

  describe('Animation easing', () => {
    it('animationEasing option is included in the slideDown transition style', () => {
      const navEa = buildNav();
      const menuEa = new AMegMen(navEa, { animationEasing: 'linear', panelOpenDuration: 300 });
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.appendChild(el);
      menuEa.slideDown(el);
      expect(el.style.transition).toContain('linear');
      el.remove();
      menuEa.destroy();
      navEa.remove();
    });

    it('animationEasing option is included in the slideUp transition style', () => {
      const navEa2 = buildNav();
      const menuEa2 = new AMegMen(navEa2, {
        animationEasing: 'ease-in-out',
        panelCloseDuration: 200,
      });
      const el = document.createElement('div');
      el.style.display = 'block';
      document.body.appendChild(el);
      menuEa2.slideUp(el);
      expect(el.style.transition).toContain('ease-in-out');
      el.remove();
      menuEa2.destroy();
      navEa2.remove();
    });
  });

  // ── Backdrop click ────────────────────────────────────────────────────────

  describe('Backdrop click', () => {
    it('clicking the backdrop closes the offcanvas drawer', () => {
      const navBd = buildNav();
      const menuBd = new AMegMen(navBd);

      menuBd.openMenu();
      expect(navBd.classList.contains('amegmen-offcanvas-open')).toBe(true);

      const backdrop = navBd.querySelector<HTMLElement>('.amegmen-backdrop')!;
      expect(backdrop).not.toBeNull();
      backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(navBd.classList.contains('amegmen-offcanvas-open')).toBe(false);

      menuBd.destroy();
      navBd.remove();
    });
  });

  // ── Escape key: offcanvas ─────────────────────────────────────────────────

  describe('Escape key: offcanvas', () => {
    it('Escape closes the offcanvas drawer when no panel is open', () => {
      const navEsc = buildNav();
      const menuEsc = new AMegMen(navEsc);
      // Mobile mode — no amegmen-desktop class

      menuEsc.openMenu();
      expect(navEsc.classList.contains('amegmen-offcanvas-open')).toBe(true);

      const trigger = navEsc.querySelector<HTMLElement>('a[href="#movies"]')!;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(navEsc.classList.contains('amegmen-offcanvas-open')).toBe(false);

      menuEsc.destroy();
      navEsc.remove();
    });
  });

  // ── onBeforeOpen: openPanelAt path ────────────────────────────────────────

  describe('onBeforeOpen: openPanelAt path', () => {
    it('delays open via openPanelAt until done() is invoked', () => {
      const navBo = buildNav();
      let captureDone: (() => void) | null = null;
      const menuBo = new AMegMen(navBo, {
        onBeforeOpen: (_panel, _trigger, done) => {
          captureDone = done;
        },
      });
      const panel = navBo.querySelector<HTMLElement>('.amegmen-panel')!;

      menuBo.openPanelAt(0);
      expect(panel.classList.contains('amegmen-open')).toBe(false);

      captureDone!();
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      menuBo.destroy();
      navBo.remove();
    });

    it('passes the correct panel and trigger to onBeforeOpen via openPanelAt', () => {
      const navBo2 = buildNav();
      let receivedPanel: HTMLElement | null = null;
      let receivedTrigger: HTMLElement | null = null;
      const menuBo2 = new AMegMen(navBo2, {
        onBeforeOpen: (p, t, done) => {
          receivedPanel = p;
          receivedTrigger = t;
          done();
        },
      });
      const panel = navBo2.querySelector<HTMLElement>('.amegmen-panel')!;
      const trigger = navBo2.querySelector<HTMLElement>('[aria-haspopup="true"]')!;

      menuBo2.openPanelAt(0);

      expect(receivedPanel).toBe(panel);
      expect(receivedTrigger).toBe(trigger);

      menuBo2.destroy();
      navBo2.remove();
    });
  });

  // ── onPointerDown: mouseFocused state ────────────────────────────────────
  // Exercises the pointerdown handler (AMegMen.ts lines ~1133-1144) and verifies
  // that it correctly sets mouseFocused so the following focusin does not
  // accidentally set justFocused=true (which would block the next click).

  describe('onPointerDown', () => {
    it('pointerdown before focusin prevents justFocused from blocking the next click', () => {
      vi.useFakeTimers();
      try {
        const navPd = buildNav();
        const menuPd = new AMegMen(navPd);
        const trigger = navPd.querySelector<HTMLElement>('a[href="#movies"]')!;
        const panel = navPd.querySelector<HTMLElement>('.amegmen-panel')!;

        menuPd.openPanelAt(0);
        expect(panel.classList.contains('amegmen-open')).toBe(true);

        // pointerdown → mouseFocused = true; 1 ms setTimeout clears any focusTimeoutId
        trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        vi.advanceTimersByTime(5);

        // focusin after pointerdown → justFocused = !mouseFocused = false
        trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

        // Click while open and justFocused=false → closes the panel normally
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(panel.classList.contains('amegmen-open')).toBe(false);

        menuPd.destroy();
        navPd.remove();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  // ── Type-ahead: multi-character prefix ───────────────────────────────────

  describe('Type-ahead: multi-character prefix', () => {
    it('second character narrows the search from the current position', () => {
      vi.useFakeTimers();
      try {
        const navTa = buildNav();
        const menuTa = new AMegMen(navTa, { typeAheadTimeout: 500 });
        const movies = navTa.querySelector<HTMLElement>('a[href="#movies"]')!;
        const tv = navTa.querySelector<HTMLElement>('a[href="#tv"]')!;

        // First character 't' advances focus from Movies to TV Shows
        movies.focus();
        fireKey(movies, 't');
        expect(document.activeElement).toBe(tv);

        // Second character 'v' (now "tv") should stay on TV Shows (matches)
        fireKey(tv, 'v');
        expect(document.activeElement).toBe(tv);

        menuTa.destroy();
        navTa.remove();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  // ── handleMenuClick: non-tabbable child click ────────────────────────────
  // Covers the closestEl fallback branch (AMegMen.ts line ~1240) where the raw
  // click target is not directly tabbable but is a descendant of a trigger button.

  describe('handleMenuClick: click on non-tabbable child of trigger', () => {
    it('click on a <span> inside a button trigger still opens the panel', () => {
      const navSpan = document.createElement('nav');
      navSpan.innerHTML = `
        <ul>
          <li>
            <button type="button"><span>Products</span></button>
            <div class="amegmen-panel">
              <ul class="amegmen-panel-group">
                <li><a href="#design">Design</a></li>
              </ul>
            </div>
          </li>
        </ul>
      `;
      document.body.appendChild(navSpan);
      const menuSpan = new AMegMen(navSpan);
      const span = navSpan.querySelector<HTMLElement>('button span')!;
      const panel = navSpan.querySelector<HTMLElement>('.amegmen-panel')!;

      // Clicking the inner span should bubble up; handleMenuClick should walk up to <button>
      span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(panel.classList.contains('amegmen-open')).toBe(true);

      menuSpan.destroy();
      navSpan.remove();
    });
  });

  // ── onMediaChange: desktop transition ────────────────────────────────────
  // Covers the closeOffcanvas() call (AMegMen.ts line ~1308) when the viewport
  // crosses the desktopBreakpoint upward.

  describe('onMediaChange: desktop transition', () => {
    it('closeOffcanvas is called when the breakpoint transitions to desktop', () => {
      const origMatchMedia = window.matchMedia;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaQueryList);

      try {
        const navDt = buildNav();
        navDt.classList.add('amegmen-offcanvas-open');
        const menuDt = new AMegMen(navDt);
        // setupResponsive → onMediaChange → isDesktop=true → closeOffcanvas removes the class
        expect(navDt.classList.contains('amegmen-offcanvas-open')).toBe(false);
        menuDt.destroy();
        navDt.remove();
      } finally {
        window.matchMedia = origMatchMedia;
      }
    });
  });

  // ── MutationObserver (Windows Narrator workaround) ────────────────────────

  describe('MutationObserver (Windows Narrator workaround)', () => {
    it('closes the panel when aria-expanded is set to "false" externally on the panel element', async () => {
      const navMo = buildNav();
      const menuMo = new AMegMen(navMo);
      navMo.classList.add('amegmen-desktop');

      // Pre-set aria-expanded on the panel so openPanelAt picks it up in the observer query
      const panel = navMo.querySelector<HTMLElement>('.amegmen-panel')!;
      panel.setAttribute('aria-expanded', 'false');

      menuMo.openPanelAt(0);
      expect(panel.classList.contains('amegmen-open')).toBe(true);
      expect(panel.getAttribute('aria-expanded')).toBe('true');

      // Simulate Windows Narrator externally setting aria-expanded="false" on the panel
      panel.setAttribute('aria-expanded', 'false');

      // MutationObserver callbacks run in a microtask
      await Promise.resolve();

      expect(panel.classList.contains('amegmen-open')).toBe(false);

      menuMo.destroy();
      navMo.remove();
    });
  });
});
