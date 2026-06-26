import type { MegaMenuOptions } from './types';
import { Key } from './keyboard';
import { getTabbable, isFocusable, isTabbable, closestEl } from './utils/dom';
import { ensureId } from './utils/uid';

// Injected by Vite `define` at build time from package.json — not a runtime import.
declare const __AMEGMEN_VERSION__: string;

/** Per-element plugin instance storage — avoids double-init without polluting element data. */
const PLUGIN_STORE = new WeakMap<Element, AMegMen>();

/**
 * Keyboard- and screen-reader-accessible mega menu component.
 *
 * Manages ARIA wiring, keyboard navigation (ARIA APG disclosure pattern),
 * pointer interactions, and responsive offcanvas/desktop switching. Zero
 * runtime dependencies. A `WeakMap` guard prevents double-initialisation:
 * calling `new AMegMen(el)` on an already-initialised element returns the
 * existing instance unchanged.
 *
 * @example
 * ```ts
 * const menu = new AMegMen(document.querySelector('nav')!);
 * menu.setOption('openOnMouseover', true);
 * ```
 */
export class AMegMen {
  // `!` assertions: these are always assigned before use. The constructor
  // may return an existing instance (double-init guard) so TypeScript can't
  // prove assignment for the new `this` — but it will never be used unset.
  private readonly element!: HTMLElement;
  private settings!: MegaMenuOptions;

  private menu!: HTMLElement;
  private topnavitems!: HTMLElement[];
  private panels: HTMLElement[] = [];
  private navHeadings: HTMLElement[] = [];
  private toggleButton: HTMLButtonElement | null = null;
  private liveRegion: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private wrapperEl: HTMLElement | null = null;
  private mediaQuery: MediaQueryList | null = null;

  // Timers
  private mouseTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private focusTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private keydownTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private panelOpenTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private keydownSearchString = '';

  // Interaction state flags
  private mouseFocused = false;
  private justFocused = false;

  // Lifecycle controllers
  private mainAbort: AbortController | null = null;
  private outerAbort: AbortController | null = null;
  private trapFocusAbort: AbortController | null = null;
  private panelObservers: MutationObserver[] = [];

  /** Library version, sourced from `package.json` at build time. */
  static readonly version: string = __AMEGMEN_VERSION__;

  static readonly defaults: Readonly<MegaMenuOptions> = {
    uuidPrefix: 'amegmen',
    menuClass: 'amegmen',
    topNavItemClass: 'amegmen-top-nav-item',
    panelClass: 'amegmen-panel',
    panelGroupClass: 'amegmen-panel-group',
    hoverClass: 'amegmen-hover',
    focusClass: 'amegmen-focus',
    openClass: 'amegmen-open',
    toggleButtonClass: 'amegmen-toggle',
    openDelay: 0,
    closeDelay: 250,
    openOnMouseover: false,
    navigationLabel: 'Main navigation',
    announceOpen: false,
    offcanvasDirection: 'right',
    desktopBreakpoint: 1280,
    navAlignment: 'left',
    panelOpenDuration: 250,
    panelCloseDuration: 250,
    panelSwitchGap: 0,
    focusOutDelay: 300,
    typeAheadTimeout: 1000,
    scrollBehavior: 'smooth',
    closeOnOutsideClick: true,
    animationEasing: 'ease-out',
    onOpen: null,
    onClose: null,
    onBeforeOpen: null,
    trapFocus: false,
    stickyOffset: 0,
    maxPanelHeight: 0,
  };

  constructor(element: HTMLElement, options: Partial<MegaMenuOptions> = {}) {
    const existing = PLUGIN_STORE.get(element);
    if (existing) return existing;

    this.element = element;
    this.settings = { ...AMegMen.defaults, ...options };
    PLUGIN_STORE.set(element, this);
    this.init();
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /** Returns the library version string (e.g. `"2.0.0"`). */
  static getVersion(): string {
    return AMegMen.version;
  }

  /** Returns the static default options object shared by all instances. */
  getDefaults(): Readonly<MegaMenuOptions> {
    return AMegMen.defaults;
  }

  /** Returns the current value of the given option key. */
  getOption<K extends keyof MegaMenuOptions>(key: K): MegaMenuOptions[K] {
    return this.settings[key];
  }

  /** Returns a shallow copy of all current option values. */
  getAllOptions(): Readonly<MegaMenuOptions> {
    return { ...this.settings };
  }

  /**
   * Updates a single option value.
   * @param reinitialize - When `true`, re-runs `init()` so the change takes effect immediately.
   */
  setOption<K extends keyof MegaMenuOptions>(
    key: K,
    value: MegaMenuOptions[K],
    reinitialize = false
  ): void {
    this.settings[key] = value;
    if (reinitialize) this.init();
  }

  /**
   * Opens the mobile offcanvas navigation drawer programmatically — equivalent
   * to the user clicking the toggle button when the drawer is closed.
   * No-op if the drawer is already open.
   */
  openMenu(): void {
    if (this.menu.classList.contains(this.settings.openClass)) return;
    this.toggleButton?.setAttribute('aria-expanded', 'true');
    this.menu.classList.add(this.settings.openClass);
    this.element.classList.add('amegmen-offcanvas-open');
    this.forceCloseAllPanels();
    if (this.settings.trapFocus && !this.element.classList.contains('amegmen-desktop')) {
      this.attachTrapFocus();
    }
  }

  /**
   * Closes the mobile offcanvas navigation drawer programmatically — equivalent
   * to the user clicking the toggle button when the drawer is open.
   * No-op if the drawer is already closed.
   */
  closeMenu(): void {
    if (!this.menu.classList.contains(this.settings.openClass)) return;
    this.closeOffcanvas();
  }

  /**
   * Opens the panel for the top-level item at the given zero-based index.
   * Closes any currently open panel first. Honors `onBeforeOpen` if set.
   * No-op if the index is out of range or the item has no panel.
   */
  openPanelAt(index: number): void {
    const topli = this.topnavitems[index];
    if (!topli) return;
    const panel = topli.querySelector<HTMLElement>(`.${this.settings.panelClass}`);
    if (!panel) return;
    const trigger = topli.querySelector<HTMLElement>('[aria-haspopup="true"]') ?? null;

    this.forceCloseAllPanels();

    const applyOpen = (): void => {
      const { settings } = this;
      topli.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
        el.setAttribute('aria-expanded', 'true');
        el.classList.add(settings.openClass);
      });
      panel.classList.add(settings.openClass);
      panel.setAttribute('aria-hidden', 'false');
      this.slideDown(panel);

      const panelTopAbs = topli.getBoundingClientRect().top + window.scrollY;
      const scrollTarget = panelTopAbs - settings.stickyOffset;
      if (window.scrollY > scrollTarget) {
        window.scrollTo({ top: scrollTarget, behavior: settings.scrollBehavior });
      }

      if (this.liveRegion) {
        const labelId = panel.getAttribute('aria-labelledby') ?? '';
        const labelEl = labelId ? document.getElementById(labelId) : null;
        const labelText = labelEl?.textContent;
        const label =
          panel.getAttribute('aria-label') ?? (labelText ? labelText.trim() : null) ?? 'submenu';
        this.liveRegion.textContent = `${label} expanded`;
      }

      panel.dispatchEvent(
        new CustomEvent('amegmenopen', {
          bubbles: true,
          composed: true,
          detail: { panel, trigger },
        })
      );
      if (settings.onOpen && trigger) {
        settings.onOpen(panel, trigger);
      }

      this.attachOuterHandlers();
    };

    if (this.settings.onBeforeOpen && trigger) {
      this.settings.onBeforeOpen(panel, trigger, applyOpen);
    } else {
      applyOpen();
    }
  }

  /**
   * Closes all open panels immediately. Fires `amegmenclose` events and the
   * `onClose` callback. Equivalent to programmatically dismissing the menu.
   */
  closePanels(): void {
    this.forceCloseAllPanels();
  }

  /**
   * Animates an element from `display:none` to its natural height, like
   * jQuery's `$.slideDown()`. No-op if the element is already visible.
   * Skips the animation when `prefers-reduced-motion: reduce` is active.
   *
   * Respects per-element `data-amegmen-open-duration` override and the
   * `maxPanelHeight` option.
   */
  slideDown(el: HTMLElement): void {
    if (getComputedStyle(el).display !== 'none') return;

    const duration =
      el.dataset.amegmenOpenDuration !== undefined
        ? Number(el.dataset.amegmenOpenDuration)
        : this.settings.panelOpenDuration;
    const maxH = this.settings.maxPanelHeight;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'block';
      if (maxH > 0) {
        el.style.maxHeight = `${maxH}px`;
        el.style.overflowY = 'auto';
      }
      return;
    }

    el.style.display = 'block';
    el.style.overflow = 'hidden';
    el.style.height = '0px';
    void el.offsetHeight; // force reflow so the browser registers the start state

    const natural = el.scrollHeight;
    const target = maxH > 0 ? Math.min(natural, maxH) : natural;
    const capped = maxH > 0 && natural > maxH;

    el.style.transition = `height ${duration}ms ${this.settings.animationEasing}`;
    el.style.height = `${target}px`;

    el.addEventListener(
      'transitionend',
      () => {
        if (capped) {
          el.style.overflowY = 'auto';
          el.style.overflow = '';
        } else {
          el.style.height = 'auto';
          el.style.overflow = '';
        }
        el.style.transition = '';
      },
      { once: true }
    );
  }

  /**
   * Animates an element from its current height down to zero then sets
   * `display:none`, like jQuery's `$.slideUp()`. No-op if already hidden.
   * Skips the animation when `prefers-reduced-motion: reduce` is active.
   *
   * Respects per-element `data-amegmen-close-duration` override.
   */
  slideUp(el: HTMLElement): void {
    if (getComputedStyle(el).display === 'none') return;

    const duration =
      el.dataset.amegmenCloseDuration !== undefined
        ? Number(el.dataset.amegmenCloseDuration)
        : this.settings.panelCloseDuration;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none';
      el.style.maxHeight = '';
      el.style.overflowY = '';
      return;
    }

    el.style.height = `${el.offsetHeight}px`;
    el.style.overflow = 'hidden';
    void el.offsetHeight; // force reflow
    el.style.transition = `height ${duration}ms ${this.settings.animationEasing}`;
    el.style.height = '0px';

    el.addEventListener(
      'transitionend',
      () => {
        el.style.display = 'none';
        el.style.height = '';
        el.style.overflow = '';
        el.style.transition = '';
        el.style.maxHeight = '';
        el.style.overflowY = '';
      },
      { once: true }
    );
  }

  /**
   * Slides the element down if it is hidden, or up if it is visible — like
   * jQuery's `$.slideToggle()`.
   */
  slideToggle(el: HTMLElement): void {
    if (getComputedStyle(el).display === 'none') {
      this.slideDown(el);
    } else {
      this.slideUp(el);
    }
  }

  /**
   * Tears down the instance: removes all event listeners, reverts ARIA attributes,
   * and removes injected DOM elements (live region, backdrop, `<h2>` nav wrappers).
   * After calling this the element can be safely re-initialised with `new AMegMen(el)`.
   */
  destroy(): void {
    this.menu.classList.remove(this.settings.menuClass, `js-${this.settings.menuClass}`);
    this.removeEventHandlers();
    this.detachTrapFocus();
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.mediaQuery = null;
    this.element.classList.remove('amegmen-desktop', 'amegmen-offcanvas-open');
    this.wrapperEl?.classList.remove('amegmen-desktop');
    this.wrapperEl = null;
    this.element.removeAttribute('data-amegmen-offcanvas-dir');
    this.element.removeAttribute('data-amegmen-nav-align');
    this.element.style.removeProperty('--amegmen-sticky-offset');
    this.liveRegion?.remove();
    this.liveRegion = null;
    this.backdropEl?.remove();
    this.backdropEl = null;
    // Unwrap <h2> elements that were injected during init
    this.navHeadings.forEach((h2) => {
      const link = h2.firstElementChild;
      if (link && h2.parentElement) {
        h2.parentElement.insertBefore(link, h2);
      }
      h2.remove();
    });
    this.navHeadings = [];
    PLUGIN_STORE.delete(this.element);
  }

  // ─── Initialization ────────────────────────────────────────────────────────

  /**
   * Wires ARIA, event listeners, and responsive behaviour. Safe to call
   * multiple times (e.g. after `setOption(…, reinitialize: true)`); existing
   * DOM mutations (e.g. `<h2>` wrappers) are detected and skipped.
   */
  private init(): void {
    const { settings, element } = this;

    const menu = element.querySelector<HTMLElement>(':scope > ol, :scope > ul');
    if (!menu) throw new Error('AMegMen: no <ul>/<ol> found as a direct child.');

    this.menu = menu;
    this.topnavitems = Array.from(menu.children) as HTMLElement[];

    // Detect optional wrapper pattern: toggle lives outside <nav> in a parent
    // .amegmen-wrapper div that is a sibling container of the nav.
    const parentEl = element.parentElement;
    this.wrapperEl = parentEl?.classList.contains('amegmen-wrapper') ? parentEl : null;

    // Find toggle button: prefer the class selector, fall back to any button.
    // When the wrapper pattern is used the toggle is outside <nav> but inside
    // .amegmen-wrapper, so search the wrapper root first when present.
    const toggleSearchRoot = this.wrapperEl ?? element;
    this.toggleButton =
      toggleSearchRoot.querySelector<HTMLButtonElement>(`button.${settings.toggleButtonClass}`) ??
      toggleSearchRoot.querySelector<HTMLButtonElement>('button') ??
      null;

    // Nav landmark label — <nav> already carries role="navigation" implicitly
    if (settings.navigationLabel) {
      element.setAttribute('aria-label', settings.navigationLabel);
    }

    ensureId(menu, settings.uuidPrefix);
    menu.classList.add(settings.menuClass, `js-${settings.menuClass}`);

    this.topnavitems.forEach((item) => {
      item.classList.add(settings.topNavItemClass);
      this.setupTopNavItem(item);
    });

    this.panels = Array.from(menu.querySelectorAll<HTMLElement>(`.${settings.panelClass}`));

    menu.querySelectorAll('hr').forEach((hr) => {
      hr.setAttribute('role', 'separator');
    });

    if (this.toggleButton) {
      const btn = this.toggleButton;
      btn.classList.add(settings.toggleButtonClass);
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', menu.id);
      // Add aria-label only if the button has no visible text and no existing label
      // textContent is string|null per DOM spec; linter incorrectly sees it as string
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!btn.getAttribute('aria-label') && !(btn.textContent ?? '').trim()) {
        btn.setAttribute('aria-label', 'Toggle navigation');
      }
    }

    if (settings.announceOpen && !this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'amegmen-sr-only';
      element.appendChild(this.liveRegion);
    }

    // Offcanvas direction attribute (read by CSS for slide direction)
    element.setAttribute('data-amegmen-offcanvas-dir', settings.offcanvasDirection);
    // Nav alignment attribute (read by CSS for desktop text-align)
    element.setAttribute('data-amegmen-nav-align', settings.navAlignment);

    // Sticky offset CSS custom property (read by CSS for panel positioning)
    if (settings.stickyOffset > 0) {
      element.style.setProperty('--amegmen-sticky-offset', `${settings.stickyOffset}px`);
    } else {
      element.style.removeProperty('--amegmen-sticky-offset');
    }

    // Inject backdrop element (once; persists across re-inits)
    if (!this.backdropEl) {
      const bd = document.createElement('div');
      bd.className = 'amegmen-backdrop';
      bd.setAttribute('aria-hidden', 'true');
      element.insertBefore(bd, element.firstChild);
      this.backdropEl = bd;
    }

    this.addEventHandlers();
    this.setupResponsive();

    // If focus is already inside the menu, replay focusin to wire state
    const active = document.activeElement;
    if (active && element.contains(active) && active !== element) {
      active.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
    }
  }

  /**
   * Detects which markup pattern is in use for each top-level item, wraps the
   * nav label in an `<h2>` for heading hierarchy, and wires ARIA attributes:
   *
   *  1. `<a>` + `<div.panel>`              — link-as-trigger (backwards-compat)
   *  2. `<a>` + `<button>` + `<div.panel>` — separate disclosure button
   *  3. `<button>` + `<div.panel>`         — button-only trigger (no nav link)
   *  4. No panel child                      — plain link/button; only `<h2>` wrap runs
   *
   * On re-init (via `setOption(…, true)`) elements already inside an `<h2>` are
   * found through the wrapper and the wrapping step is skipped.
   */
  private setupTopNavItem(item: HTMLElement): void {
    const { settings } = this;
    const directChildren = Array.from(item.children) as HTMLElement[];

    // Panel = first direct child that already carries panelClass in the markup.
    // Authors must include the class; AMegMen no longer injects it, allowing
    // the panel to be styled (hidden/shown) by CSS before JS initialises.
    const panel = directChildren.find((el) => el.classList.contains(settings.panelClass));

    // Locate <a> and <button> — check inside any existing <h2> wrapper first
    // so that re-init (triggered by setOption with reinitialize:true) finds them
    // even after they have been moved inside the <h2> on the prior init.
    const h2Wrapper = directChildren.find((el) => el.tagName === 'H2');

    const aChild: HTMLAnchorElement | undefined =
      directChildren.find((el): el is HTMLAnchorElement => el.tagName === 'A') ??
      h2Wrapper?.querySelector<HTMLAnchorElement>('a') ??
      undefined;

    const buttonChild: HTMLButtonElement | undefined =
      directChildren.find(
        (el): el is HTMLButtonElement => el.tagName === 'BUTTON' && el !== panel
      ) ??
      h2Wrapper?.querySelector<HTMLButtonElement>('button') ??
      undefined;

    // Wrap the nav label in <h2> for heading hierarchy (panels use <h3>).
    // Prefer the <a> link; fall back to <button> for button-only items (no <a>).
    // Skip if the target is already inside an <h2> from a prior init.
    const wrapTarget: HTMLElement | undefined = aChild ?? buttonChild;
    if (wrapTarget && wrapTarget.parentElement?.tagName !== 'H2') {
      const h2 = document.createElement('h2');
      item.insertBefore(h2, wrapTarget);
      h2.appendChild(wrapTarget);
      this.navHeadings.push(h2);
    }

    if (!panel) return; // plain link or plain button, nothing to wire

    // Trigger = dedicated <button> child, else the <a>.
    // Using tagName-based lookup avoids false negatives from CSS visibility:hidden
    // that the menu's own styles apply to .amegmen before amegmen-desktop is set.
    const trigger: HTMLElement | null = buttonChild ?? aChild ?? null;

    if (!trigger) return;

    ensureId(trigger, settings.uuidPrefix);
    ensureId(panel, settings.uuidPrefix);

    // Backwards-compat: if a link is used as trigger, add role="button"
    if (trigger.tagName === 'A') {
      trigger.setAttribute('role', 'button');
    }

    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    if (trigger.tabIndex < 0) trigger.tabIndex = 0;

    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-hidden', 'true');
    if (!panel.getAttribute('aria-labelledby')) {
      panel.setAttribute('aria-labelledby', trigger.id);
    }
  }

  // ─── Event management ──────────────────────────────────────────────────────

  /** Registers all menu-level listeners using an `AbortController` signal. */
  private addEventHandlers(): void {
    this.removeEventHandlers();
    this.mainAbort = new AbortController();
    const { signal } = this.mainAbort;
    const menu = this.menu;

    menu.addEventListener('focusin', this.onFocusIn, { signal });
    menu.addEventListener('focusout', this.onFocusOut, { signal });
    menu.addEventListener('keydown', this.onKeyDown, { signal });
    menu.addEventListener('pointerover', this.onPointerOver, { signal });
    menu.addEventListener('pointerout', this.onPointerOut, { signal });
    menu.addEventListener('pointerdown', this.onPointerDown, { signal });
    menu.addEventListener('click', this.onClickMenu, { signal });

    this.toggleButton?.addEventListener('click', this.onToggleClick, { signal });
    this.backdropEl?.addEventListener('click', this.onBackdropClick, { signal });
  }

  /** Aborts all menu-level listeners and tears down outer (document-level) handlers. */
  private removeEventHandlers(): void {
    this.mainAbort?.abort();
    this.mainAbort = null;
    this.detachOuterHandlers();
  }

  /** Attaches document-level click-outside handler and MutationObserver for
   *  Windows Narrator aria-expanded changes (replaces DOMAttrModified). */
  private attachOuterHandlers(): void {
    this.detachOuterHandlers();
    this.outerAbort = new AbortController();

    if (this.settings.closeOnOutsideClick) {
      document.addEventListener('pointerup', this.onPointerUpOutside, {
        signal: this.outerAbort.signal,
      });
    }

    const openPanels = this.menu.querySelectorAll<HTMLElement>(
      `[aria-expanded="true"].${this.settings.panelClass}`
    );
    openPanels.forEach((panel) => {
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (
            m.attributeName === 'aria-expanded' &&
            (m.target as Element).getAttribute('aria-expanded') === 'false' &&
            (m.target as Element).classList.contains(this.settings.openClass)
          ) {
            this.togglePanel(new Event('mutation'), true);
          }
        }
      });
      obs.observe(panel, { attributes: true, attributeFilter: ['aria-expanded'] });
      this.panelObservers.push(obs);
    });
  }

  /** Aborts the document-level `pointerup` listener and disconnects all `MutationObserver` instances. */
  private detachOuterHandlers(): void {
    this.outerAbort?.abort();
    this.outerAbort = null;
    this.panelObservers.forEach((obs) => {
      obs.disconnect();
    });
    this.panelObservers = [];
  }

  /** Attaches a document-level Tab trap that cycles focus within the offcanvas container. */
  private attachTrapFocus(): void {
    this.detachTrapFocus();
    this.trapFocusAbort = new AbortController();
    document.addEventListener('keydown', this.onTrapFocusKeyDown, {
      signal: this.trapFocusAbort.signal,
    });
  }

  /** Removes the Tab trap listener. */
  private detachTrapFocus(): void {
    this.trapFocusAbort?.abort();
    this.trapFocusAbort = null;
  }

  // ─── Panel toggle ──────────────────────────────────────────────────────────

  /**
   * @param event  The triggering event; used for type and relatedTarget checks.
   * @param hide   If true, close all open panels. If false/omitted, open the panel
   *               associated with event.target's top-level item.
   */
  private togglePanel(event: Event, hide = false): void {
    this.detachOuterHandlers();

    if (hide) {
      this.closeAllPanels(event);
    } else {
      this.openPanel(event);
    }
  }

  /**
   * Closes all open panels. Skips closing if focus is still inside the same
   * top-level item (e.g. during an internal focus shift), and returns focus
   * to the trigger when triggered by `Escape`.
   */
  private closeAllPanels(event: Event): void {
    const { settings, menu } = this;

    const openTrigger = menu.querySelector<HTMLElement>('[aria-expanded="true"]');
    if (!openTrigger) return;

    const topli = closestEl(openTrigger, `.${settings.topNavItemClass}`);
    if (!topli) return;

    // Don't close if the new focus target is still inside this item
    const related = (event as FocusEvent).relatedTarget;
    if (related instanceof Element && topli.contains(related)) return;
    if (
      (event.type === 'focusout' || event.type === 'pointerout') &&
      topli.contains(document.activeElement)
    ) {
      return;
    }

    // Fire close events before DOM changes
    topli
      .querySelectorAll<HTMLElement>(`.${settings.panelClass}.${settings.openClass}`)
      .forEach((panel) => {
        panel.dispatchEvent(
          new CustomEvent('amegmenclose', {
            bubbles: true,
            composed: true,
            detail: { panel, trigger: openTrigger },
          })
        );
        if (settings.onClose) {
          settings.onClose(panel, openTrigger);
        }
      });

    topli.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
      el.setAttribute('aria-expanded', 'false');
      el.classList.remove(settings.openClass);
    });
    topli.querySelectorAll<HTMLElement>(`.${settings.panelClass}`).forEach((panel) => {
      panel.classList.remove(settings.openClass);
      panel.setAttribute('aria-hidden', 'true');
      this.slideUp(panel);
    });

    if (event.type === 'keydown' && (event as KeyboardEvent).key === Key.Escape) {
      const trigger = topli.querySelector<HTMLElement>('[aria-expanded]');
      if (trigger) {
        setTimeout(() => {
          trigger.focus();
          this.justFocused = false;
        }, 0);
      }
    }

    if (this.liveRegion) this.liveRegion.textContent = '';
  }

  /**
   * Opens the panel belonging to the top-level item that contains `event.target`.
   * Closes any other currently-open panel first and scrolls the item into view
   * if it is above the current scroll position.
   */
  private openPanel(event: Event): void {
    const { settings, menu } = this;

    if (this.focusTimeoutId !== null) {
      clearTimeout(this.focusTimeoutId);
      this.focusTimeoutId = null;
    }

    // Cancel any previous deferred open so rapid switching doesn't queue up
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }

    const target = event.target as Element | null;
    const topli = closestEl(target, `.${settings.topNavItemClass}`);
    if (!topli) return;

    // Pre-compute for onBeforeOpen hook, events, and callbacks
    const trigger = topli.querySelector<HTMLElement>('[aria-haspopup="true"]') ?? null;
    const newPanel = topli.querySelector<HTMLElement>(`.${settings.panelClass}`) ?? null;

    // Close any other open top-level item
    const openTrigger = menu.querySelector<HTMLElement>('[aria-expanded="true"]');
    const openTopli = openTrigger ? closestEl(openTrigger, `.${settings.topNavItemClass}`) : null;

    const hasPrev = openTopli !== null && openTopli !== topli;

    if (hasPrev) {
      // Fire close events for the panel being replaced
      openTopli
        .querySelectorAll<HTMLElement>(`.${settings.panelClass}.${settings.openClass}`)
        .forEach((p) => {
          const prevTrigger =
            openTopli.querySelector<HTMLElement>('[aria-haspopup="true"]') ?? null;
          p.dispatchEvent(
            new CustomEvent('amegmenclose', {
              bubbles: true,
              composed: true,
              detail: { panel: p, trigger: prevTrigger },
            })
          );
          if (settings.onClose && prevTrigger) {
            settings.onClose(p, prevTrigger);
          }
        });

      openTopli.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
        el.setAttribute('aria-expanded', 'false');
        el.classList.remove(settings.openClass);
      });
      openTopli.querySelectorAll<HTMLElement>(`.${settings.panelClass}`).forEach((p) => {
        p.classList.remove(settings.openClass);
        p.setAttribute('aria-hidden', 'true');
        this.slideUp(p);
      });
    }

    // Encapsulate "apply open state" so it can be deferred when switching panels
    const applyOpen = (): void => {
      topli.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
        el.setAttribute('aria-expanded', 'true');
        el.classList.add(settings.openClass);
      });

      if (newPanel) {
        newPanel.classList.add(settings.openClass);
        newPanel.setAttribute('aria-hidden', 'false');
        this.slideDown(newPanel);

        // Scroll so the panel is visible, accounting for sticky headers
        const panelTopAbs = topli.getBoundingClientRect().top + window.scrollY;
        const scrollTarget = panelTopAbs - settings.stickyOffset;
        if (window.scrollY > scrollTarget) {
          window.scrollTo({ top: scrollTarget, behavior: settings.scrollBehavior });
        }

        if (this.liveRegion) {
          const labelId = newPanel.getAttribute('aria-labelledby') ?? '';
          const labelEl = labelId ? document.getElementById(labelId) : null;
          const rawText = labelEl?.textContent;
          const label =
            newPanel.getAttribute('aria-label') ?? (rawText ? rawText.trim() : null) ?? 'submenu';
          this.liveRegion.textContent = `${label} expanded`;
        }

        newPanel.dispatchEvent(
          new CustomEvent('amegmenopen', {
            bubbles: true,
            composed: true,
            detail: { panel: newPanel, trigger },
          })
        );
        if (settings.onOpen && trigger) {
          settings.onOpen(newPanel, trigger);
        }
      }

      // On pointer-over: move keyboard focus to hovered tabbable item
      if (
        event.type === 'pointerover' &&
        target instanceof HTMLElement &&
        isTabbable(target) &&
        !newPanel &&
        menu.contains(document.activeElement)
      ) {
        target.focus();
        this.justFocused = false;
      }

      this.panelOpenTimeoutId = null;
      this.attachOuterHandlers();
    };

    // Wrap with onBeforeOpen hook if provided
    const runApply = (): void => {
      if (settings.onBeforeOpen && newPanel && trigger) {
        settings.onBeforeOpen(newPanel, trigger, applyOpen);
      } else {
        applyOpen();
      }
    };

    if (hasPrev) {
      // Wait for the previous panel's slide-up to finish before opening the new one
      this.panelOpenTimeoutId = setTimeout(
        runApply,
        settings.panelCloseDuration + settings.panelSwitchGap
      );
    } else {
      runApply();
    }
  }

  // ─── Event handlers (arrow functions for stable `this` binding) ─────────────

  /** Cancels any pending close timer, applies `focusClass`, and switches panels on keyboard focus change. */
  private readonly onFocusIn = (event: FocusEvent): void => {
    if (this.focusTimeoutId !== null) {
      clearTimeout(this.focusTimeoutId);
      this.focusTimeoutId = null;
    }

    const target = event.target as HTMLElement;
    const panel = closestEl(target, `.${this.settings.panelClass}`);

    target.classList.add(this.settings.focusClass);

    this.justFocused = !this.mouseFocused;
    this.mouseFocused = false;

    // If a different panel is already open, switch to this item's panel
    const otherOpenPanel = this.panels.find(
      (p) => p !== panel && p.classList.contains(this.settings.openClass)
    );
    if (this.justFocused && otherOpenPanel) {
      this.togglePanel(event);
    }
  };

  /** Removes `focusClass` and starts the `focusOutDelay` timer to close the open panel. */
  private readonly onFocusOut = (event: FocusEvent): void => {
    this.justFocused = false;
    (event.target as HTMLElement).classList.remove(this.settings.focusClass);

    this.focusTimeoutId = setTimeout(() => {
      // Don't close if mouse-caused blur with no relatedTarget (clicking outside)
      if (this.mouseFocused && event.relatedTarget === null) return;
      this.togglePanel(event, true);
    }, this.settings.focusOutDelay);
  };

  /** Main keyboard handler — routes Arrow/Home/End/Tab/Escape/Enter/Space and type-ahead. */
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const { settings } = this;
    const target = event.target as HTMLElement;

    // Let form controls handle their own keydown
    if (
      target.matches(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]), select, textarea'
      )
    ) {
      return;
    }

    const menu = this.menu;
    const topnavitems = this.topnavitems;
    const tabbables = getTabbable(menu);
    const topli = closestEl(target, `.${settings.topNavItemClass}`);
    const panel = target.classList.contains(settings.panelClass)
      ? target
      : closestEl(target, `.${settings.panelClass}`);
    const panelGroups = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(`.${settings.panelGroupClass}`))
      : [];
    const currentPanelGroup = closestEl(target, `.${settings.panelGroupClass}`);
    const isTopNavItem = !!topli && !panel;

    switch (event.key) {
      case Key.Escape: {
        this.mouseFocused = false;
        const hadOpenPanel = !!this.menu.querySelector(
          `.${settings.panelClass}.${settings.openClass}`
        );
        this.togglePanel(event, true);
        if (!hadOpenPanel && this.element.classList.contains('amegmen-offcanvas-open')) {
          this.closeOffcanvas();
          setTimeout(() => this.toggleButton?.focus(), 0);
        }
        break;
      }

      case Key.Down: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem) {
          this.togglePanel(event);
          const openPanel = topli.querySelector<HTMLElement>(`.${settings.panelClass}`);
          if (openPanel) getTabbable(openPanel)[0]?.focus();
        } else {
          const idx = tabbables.indexOf(target);
          tabbables[idx + 1]?.focus();
        }
        break;
      }

      case Key.Up: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem && target.classList.contains(settings.openClass)) {
          this.togglePanel(event, true);
          const topliIdx = topnavitems.indexOf(topli);
          const prev = topnavitems[topliIdx - 1];
          if (prev) this.openAndFocusLast(prev);
        } else if (!isTopNavItem) {
          const idx = tabbables.indexOf(target);
          if (idx > 0) tabbables[idx - 1]?.focus();
        }
        break;
      }

      case Key.Right: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem) {
          const topliIdx = topnavitems.indexOf(topli);
          const next = topnavitems[topliIdx + 1];
          if (next) getTabbable(next)[0]?.focus();
        } else {
          if (panelGroups.length && currentPanelGroup) {
            const groupIdx = panelGroups.indexOf(currentPanelGroup);
            const nextGroup = panelGroups[groupIdx + 1];
            if (nextGroup) {
              getTabbable(nextGroup)[0]?.focus();
              break;
            }
          }
          if (topli) getTabbable(topli)[0]?.focus();
        }
        break;
      }

      case Key.Left: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem) {
          const topliIdx = topnavitems.indexOf(topli);
          const prev = topnavitems[topliIdx - 1];
          if (prev) getTabbable(prev)[0]?.focus();
        } else {
          if (panelGroups.length && currentPanelGroup) {
            const groupIdx = panelGroups.indexOf(currentPanelGroup);
            const prevGroup = panelGroups[groupIdx - 1];
            if (prevGroup) {
              getTabbable(prevGroup)[0]?.focus();
              break;
            }
          }
          if (topli) getTabbable(topli)[0]?.focus();
        }
        break;
      }

      case Key.Home: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem) {
          const first = topnavitems[0];
          if (first) getTabbable(first)[0]?.focus();
        } else if (currentPanelGroup) {
          getTabbable(currentPanelGroup)[0]?.focus();
        } else if (panel) {
          getTabbable(panel)[0]?.focus();
        }
        break;
      }

      case Key.End: {
        event.preventDefault();
        this.mouseFocused = false;
        if (isTopNavItem) {
          const last = topnavitems.at(-1);
          if (last) getTabbable(last)[0]?.focus();
        } else if (currentPanelGroup) {
          getTabbable(currentPanelGroup).at(-1)?.focus();
        } else if (panel) {
          getTabbable(panel).at(-1)?.focus();
        }
        break;
      }

      case Key.Tab: {
        this.mouseFocused = false;
        const i = tabbables.indexOf(target);
        let found = false;

        if (event.shiftKey && isTopNavItem && target.classList.contains(settings.openClass)) {
          this.togglePanel(event, true);
          const topliIdx = topnavitems.indexOf(topli);
          const prev = topnavitems[topliIdx - 1];
          if (prev) {
            const prevPanel = prev.querySelector<HTMLElement>(`.${settings.panelClass}`);
            if (prevPanel) {
              this.openAndFocusLast(prev);
              found = true;
            }
          }
        } else if (event.shiftKey && i > 0) {
          tabbables[i - 1]?.focus();
          found = true;
        } else if (!event.shiftKey && i < tabbables.length - 1) {
          tabbables[i + 1]?.focus();
          found = true;
        }

        if (found) event.preventDefault();
        break;
      }

      case Key.Space:
      case Key.Enter:
        if (isTopNavItem) {
          if (target.getAttribute('aria-haspopup') === 'true') {
            // Disclosure trigger — toggle the panel
            event.preventDefault();
            if (target.classList.contains(settings.openClass)) {
              this.mouseFocused = false;
              this.togglePanel(event, true);
            } else {
              this.handleMenuClick(event);
            }
          } else if (event.key === Key.Enter) {
            // Plain nav link (no disclosure role) — delegate to follow href
            this.handleMenuClick(event);
          }
        }
        break;

      default: {
        // Single-character type-ahead search
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) break;

        if (this.keydownTimeoutId !== null) clearTimeout(this.keydownTimeoutId);
        this.keydownSearchString += event.key;
        this.keydownTimeoutId = setTimeout(() => {
          this.keydownSearchString = '';
        }, this.settings.typeAheadTimeout);

        let searchSet: HTMLElement[];
        if (isTopNavItem && !target.classList.contains(settings.openClass)) {
          // When on a closed top-level item, only search other top-level triggers
          searchSet = tabbables.filter((el) => !closestEl(el, `.${settings.panelClass}`));
        } else if (topli) {
          searchSet = getTabbable(topli);
        } else {
          searchSet = tabbables;
        }

        if (event.shiftKey) searchSet = [...searchSet].reverse();

        const escaped = this.keydownSearchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${escaped}`, 'i');

        const startIdx =
          this.keydownSearchString.length === 1
            ? searchSet.indexOf(target) + 1
            : searchSet.indexOf(target);

        const ordered = [...searchSet.slice(startIdx), ...searchSet.slice(0, startIdx)];
        // textContent is string|null per DOM spec; linter incorrectly sees it as string
        const match = ordered.find((el) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return regex.test((el.textContent ?? '').trim());
        });
        match?.focus();
        break;
      }
    }

    this.justFocused = false;
  };

  /** Sets `mouseFocused` on pointer press and clears any pending `focusTimeoutId` after 1 ms. */
  private readonly onPointerDown = (event: PointerEvent): void => {
    const el = event.target as Element;
    if (closestEl(el, `.${this.settings.panelClass}`) || isFocusable(el)) {
      this.mouseFocused = true;
    }
    if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
    this.mouseTimeoutId = setTimeout(() => {
      if (this.focusTimeoutId !== null) {
        clearTimeout(this.focusTimeoutId);
        this.focusTimeoutId = null;
      }
    }, 1);
  };

  /** Opens the hovered item's panel after `openDelay` ms (`openOnMouseover` mode, desktop only). */
  private readonly onPointerOver = (event: PointerEvent): void => {
    if (!this.settings.openOnMouseover) return;
    if (!this.element.classList.contains('amegmen-desktop')) return;
    if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
    const target = event.target as HTMLElement;
    this.mouseTimeoutId = setTimeout(() => {
      target.classList.add(this.settings.hoverClass);
      this.togglePanel(event);
    }, this.settings.openDelay);
  };

  /** Schedules panel close after `closeDelay` ms when the pointer leaves (`openOnMouseover` mode, desktop only). */
  private readonly onPointerOut = (event: PointerEvent): void => {
    if (!this.settings.openOnMouseover) return;
    if (!this.element.classList.contains('amegmen-desktop')) return;
    if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
    (event.target as HTMLElement).classList.remove(this.settings.hoverClass);
    this.mouseTimeoutId = setTimeout(() => {
      this.togglePanel(event, true);
    }, this.settings.closeDelay);
  };

  /** Routes menu list click events through `handleMenuClick`. */
  private readonly onClickMenu = (event: MouseEvent): void => {
    this.handleMenuClick(event);
  };

  /** Closes all open panels when a `pointerup` fires outside the menu (`closeOnOutsideClick`). */
  private readonly onPointerUpOutside = (event: PointerEvent): void => {
    if (!this.menu.contains(event.target as Node)) {
      event.preventDefault();
      event.stopPropagation();
      this.togglePanel(event, true);
    }
  };

  /** Toggles the mobile offcanvas drawer open/closed when the toggle button is clicked. */
  private readonly onToggleClick = (): void => {
    const btn = this.toggleButton;
    if (!btn) return;
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const next = !isExpanded;
    btn.setAttribute('aria-expanded', String(next));
    this.menu.classList.toggle(this.settings.openClass, next);
    this.element.classList.toggle('amegmen-offcanvas-open', next);
    // Always reset accordion panels — collapse when closing, start fresh when opening
    this.forceCloseAllPanels();
    if (next) {
      if (this.settings.trapFocus && !this.element.classList.contains('amegmen-desktop')) {
        this.attachTrapFocus();
      }
    } else {
      this.detachTrapFocus();
    }
  };

  /** Cycles Tab/Shift+Tab focus within the open offcanvas container. */
  private readonly onTrapFocusKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== Key.Tab) return;
    if (!this.element.classList.contains('amegmen-offcanvas-open')) return;
    if (this.element.classList.contains('amegmen-desktop')) return;

    const container = this.wrapperEl ?? this.element;
    const focusable = getTabbable(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // `focusable.length` is non-zero (guarded above), so both ends exist; this
    // narrows the `T | undefined` from noUncheckedIndexedAccess without a
    // non-null assertion.
    if (!first || !last) return;
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Shared click/keyboard handler for top-level items. Toggles panels for
   * disclosure triggers (`aria-haspopup="true"`); navigates the `href` for
   * plain links when activated by keyboard Enter.
   */
  private handleMenuClick(event: MouseEvent | KeyboardEvent): void {
    const { settings } = this;
    const rawTarget = event.target as Element;

    // Walk up to find the nearest tabbable (trigger button or link)
    const target =
      rawTarget instanceof HTMLElement && isTabbable(rawTarget)
        ? rawTarget
        : (closestEl(rawTarget, 'a, button') ?? null);

    if (!target) return;

    const topli = closestEl(target, `.${settings.topNavItemClass}`);
    const panel = closestEl(target, `.${settings.panelClass}`);

    if (
      topli &&
      !panel &&
      topli.querySelector(`.${settings.panelClass}`) &&
      target.getAttribute('aria-haspopup') === 'true'
    ) {
      const isOpen = target.classList.contains(settings.openClass);

      if (!isOpen) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePanel(event);
        this.justFocused = false;
      } else if (this.justFocused) {
        event.preventDefault();
        event.stopPropagation();
        this.justFocused = false;
      } else {
        // Touch or non-hover mode: clicking an open item closes it
        const isTouch = event instanceof PointerEvent && event.pointerType === 'touch';
        if (isTouch || !this.settings.openOnMouseover) {
          event.preventDefault();
          event.stopPropagation();
          this.togglePanel(event, true);
        }
        // Mouse + openOnMouseover: let the link navigate naturally
      }
    } else if (
      topli &&
      !panel &&
      event.type === 'keydown' &&
      target instanceof HTMLAnchorElement &&
      target.href &&
      target.protocol !== 'javascript:'
    ) {
      window.location.href = target.href;
    }
  }

  /**
   * Creates a `matchMedia` listener for the `desktopBreakpoint` and applies the
   * `amegmen-desktop` class immediately; also fires on every breakpoint crossing.
   */
  private setupResponsive(): void {
    if (typeof window === 'undefined') return;
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.mediaQuery = window.matchMedia(`(min-width: ${this.settings.desktopBreakpoint}px)`);
    this.onMediaChange();
    this.mediaQuery.addEventListener('change', this.onMediaChange);
  }

  private readonly onMediaChange = (): void => {
    const isDesktop = this.mediaQuery?.matches ?? false;
    this.element.classList.toggle('amegmen-desktop', isDesktop);
    // Mirror amegmen-desktop to wrapper so CSS selectors like
    // `.amegmen-desktop .amegmen-toggle` reach the toggle that lives outside <nav>.
    this.wrapperEl?.classList.toggle('amegmen-desktop', isDesktop);
    if (isDesktop) {
      this.closeOffcanvas();
    } else {
      // Entering mobile: collapse any panels that were open on desktop
      this.forceCloseAllPanels();
    }
  };

  private closeOffcanvas(): void {
    this.forceCloseAllPanels();
    this.menu.classList.remove(this.settings.openClass);
    this.element.classList.remove('amegmen-offcanvas-open');
    this.toggleButton?.setAttribute('aria-expanded', 'false');
    this.detachTrapFocus();
  }

  private forceCloseAllPanels(announce = true): void {
    const { settings, menu } = this;

    // Cancel any in-flight deferred open so it doesn't re-open after force-close
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }

    if (announce) {
      menu
        .querySelectorAll<HTMLElement>(`.${settings.panelClass}.${settings.openClass}`)
        .forEach((panel) => {
          const topli = closestEl(panel, `.${settings.topNavItemClass}`);
          const trigger = topli?.querySelector<HTMLElement>('[aria-haspopup="true"]') ?? null;
          panel.dispatchEvent(
            new CustomEvent('amegmenclose', {
              bubbles: true,
              composed: true,
              detail: { panel, trigger },
            })
          );
          if (settings.onClose && trigger) {
            settings.onClose(panel, trigger);
          }
        });
    }

    menu.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
      el.setAttribute('aria-expanded', 'false');
      el.classList.remove(settings.openClass);
    });
    menu.querySelectorAll<HTMLElement>(`.${settings.panelClass}`).forEach((panel) => {
      panel.classList.remove(settings.openClass);
      panel.setAttribute('aria-hidden', 'true');
      // Clear any in-progress slide animation and let CSS display:none take over
      panel.style.transition = '';
      panel.style.height = '';
      panel.style.overflow = '';
      panel.style.display = '';
      panel.style.maxHeight = '';
      panel.style.overflowY = '';
    });
    this.detachOuterHandlers();
    if (this.liveRegion) this.liveRegion.textContent = '';
  }

  /** Closes the offcanvas drawer when the backdrop overlay is clicked. */
  private readonly onBackdropClick = (): void => {
    this.closeOffcanvas();
  };

  /**
   * Opens the panel for `topli` and moves focus to its last tabbable element.
   * Used by `ArrowUp` and `Shift+Tab` to navigate backwards across top-level items.
   */
  private openAndFocusLast(topli: HTMLElement): void {
    const { settings } = this;
    const prevPanel = topli.querySelector<HTMLElement>(`.${settings.panelClass}`);
    if (prevPanel) {
      const prevTrigger = topli.querySelector<HTMLElement>('[aria-haspopup="true"]') ?? null;
      topli.querySelectorAll<HTMLElement>('[aria-expanded]').forEach((el) => {
        el.setAttribute('aria-expanded', 'true');
        el.classList.add(settings.openClass);
      });
      prevPanel.classList.add(settings.openClass);
      prevPanel.setAttribute('aria-hidden', 'false');
      this.slideDown(prevPanel);

      prevPanel.dispatchEvent(
        new CustomEvent('amegmenopen', {
          bubbles: true,
          composed: true,
          detail: { panel: prevPanel, trigger: prevTrigger },
        })
      );
      if (settings.onOpen && prevTrigger) {
        settings.onOpen(prevPanel, prevTrigger);
      }

      getTabbable(prevPanel).at(-1)?.focus();
      this.attachOuterHandlers();
    }
  }
}
