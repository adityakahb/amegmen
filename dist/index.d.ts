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
export declare class AMegMen {
    private readonly element;
    private settings;
    private menu;
    private topnavitems;
    private panels;
    private navHeadings;
    private toggleButton;
    private liveRegion;
    private backdropEl;
    private wrapperEl;
    private mediaQuery;
    private mouseTimeoutId;
    private focusTimeoutId;
    private keydownTimeoutId;
    private panelOpenTimeoutId;
    private keydownSearchString;
    private mouseFocused;
    private justFocused;
    private mainAbort;
    private outerAbort;
    private trapFocusAbort;
    private panelObservers;
    /** Library version, sourced from `package.json` at build time. */
    static readonly version: string;
    static readonly defaults: Readonly<MegaMenuOptions>;
    constructor(element: HTMLElement, options?: Partial<MegaMenuOptions>);
    /** Returns the library version string (e.g. `"2.0.0"`). */
    static getVersion(): string;
    /** Returns the static default options object shared by all instances. */
    getDefaults(): Readonly<MegaMenuOptions>;
    /** Returns the current value of the given option key. */
    getOption<K extends keyof MegaMenuOptions>(key: K): MegaMenuOptions[K];
    /** Returns a shallow copy of all current option values. */
    getAllOptions(): Readonly<MegaMenuOptions>;
    /**
     * Updates a single option value.
     * @param reinitialize - When `true`, re-runs `init()` so the change takes effect immediately.
     */
    setOption<K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K], reinitialize?: boolean): void;
    /**
     * Opens the mobile offcanvas navigation drawer programmatically — equivalent
     * to the user clicking the toggle button when the drawer is closed.
     * No-op if the drawer is already open.
     */
    openMenu(): void;
    /**
     * Closes the mobile offcanvas navigation drawer programmatically — equivalent
     * to the user clicking the toggle button when the drawer is open.
     * No-op if the drawer is already closed.
     */
    closeMenu(): void;
    /**
     * Opens the panel for the top-level item at the given zero-based index.
     * Closes any currently open panel first. Honors `onBeforeOpen` if set.
     * No-op if the index is out of range or the item has no panel.
     */
    openPanelAt(index: number): void;
    /**
     * Closes all open panels immediately. Fires `amegmenclose` events and the
     * `onClose` callback. Equivalent to programmatically dismissing the menu.
     */
    closePanels(): void;
    /**
     * Animates an element from `display:none` to its natural height, like
     * jQuery's `$.slideDown()`. No-op if the element is already visible.
     * Skips the animation when `prefers-reduced-motion: reduce` is active.
     *
     * Respects per-element `data-amegmen-open-duration` override and the
     * `maxPanelHeight` option.
     */
    slideDown(el: HTMLElement): void;
    /**
     * Animates an element from its current height down to zero then sets
     * `display:none`, like jQuery's `$.slideUp()`. No-op if already hidden.
     * Skips the animation when `prefers-reduced-motion: reduce` is active.
     *
     * Respects per-element `data-amegmen-close-duration` override.
     */
    slideUp(el: HTMLElement): void;
    /**
     * Slides the element down if it is hidden, or up if it is visible — like
     * jQuery's `$.slideToggle()`.
     */
    slideToggle(el: HTMLElement): void;
    /**
     * Tears down the instance: removes all event listeners, reverts ARIA attributes,
     * and removes injected DOM elements (live region, backdrop, `<h2>` nav wrappers).
     * After calling this the element can be safely re-initialised with `new AMegMen(el)`.
     */
    destroy(): void;
    /**
     * Wires ARIA, event listeners, and responsive behaviour. Safe to call
     * multiple times (e.g. after `setOption(…, reinitialize: true)`); existing
     * DOM mutations (e.g. `<h2>` wrappers) are detected and skipped.
     */
    private init;
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
    private setupTopNavItem;
    /** Registers all menu-level listeners using an `AbortController` signal. */
    private addEventHandlers;
    /** Aborts all menu-level listeners and tears down outer (document-level) handlers. */
    private removeEventHandlers;
    /** Attaches document-level click-outside handler and MutationObserver for
     *  Windows Narrator aria-expanded changes (replaces DOMAttrModified). */
    private attachOuterHandlers;
    /** Aborts the document-level `pointerup` listener and disconnects all `MutationObserver` instances. */
    private detachOuterHandlers;
    /** Attaches a document-level Tab trap that cycles focus within the offcanvas container. */
    private attachTrapFocus;
    /** Removes the Tab trap listener. */
    private detachTrapFocus;
    /**
     * @param event  The triggering event; used for type and relatedTarget checks.
     * @param hide   If true, close all open panels. If false/omitted, open the panel
     *               associated with event.target's top-level item.
     */
    private togglePanel;
    /**
     * Closes all open panels. Skips closing if focus is still inside the same
     * top-level item (e.g. during an internal focus shift), and returns focus
     * to the trigger when triggered by `Escape`.
     */
    private closeAllPanels;
    /**
     * Opens the panel belonging to the top-level item that contains `event.target`.
     * Closes any other currently-open panel first and scrolls the item into view
     * if it is above the current scroll position.
     */
    private openPanel;
    /** Cancels any pending close timer, applies `focusClass`, and switches panels on keyboard focus change. */
    private readonly onFocusIn;
    /** Removes `focusClass` and starts the `focusOutDelay` timer to close the open panel. */
    private readonly onFocusOut;
    /** Main keyboard handler — routes Arrow/Home/End/Tab/Escape/Enter/Space and type-ahead. */
    private readonly onKeyDown;
    /** Sets `mouseFocused` on pointer press and clears any pending `focusTimeoutId` after 1 ms. */
    private readonly onPointerDown;
    /** Opens the hovered item's panel after `openDelay` ms (`openOnMouseover` mode, desktop only). */
    private readonly onPointerOver;
    /** Schedules panel close after `closeDelay` ms when the pointer leaves (`openOnMouseover` mode, desktop only). */
    private readonly onPointerOut;
    /** Routes menu list click events through `handleMenuClick`. */
    private readonly onClickMenu;
    /** Closes all open panels when a `pointerup` fires outside the menu (`closeOnOutsideClick`). */
    private readonly onPointerUpOutside;
    /** Toggles the mobile offcanvas drawer open/closed when the toggle button is clicked. */
    private readonly onToggleClick;
    /** Cycles Tab/Shift+Tab focus within the open offcanvas container. */
    private readonly onTrapFocusKeyDown;
    /**
     * Shared click/keyboard handler for top-level items. Toggles panels for
     * disclosure triggers (`aria-haspopup="true"`); navigates the `href` for
     * plain links when activated by keyboard Enter.
     */
    private handleMenuClick;
    /**
     * Creates a `matchMedia` listener for the `desktopBreakpoint` and applies the
     * `amegmen-desktop` class immediately; also fires on every breakpoint crossing.
     */
    private setupResponsive;
    private readonly onMediaChange;
    private closeOffcanvas;
    private forceCloseAllPanels;
    /** Closes the offcanvas drawer when the backdrop overlay is clicked. */
    private readonly onBackdropClick;
    /**
     * Opens the panel for `topli` and moves focus to its last tabbable element.
     * Used by `ArrowUp` and `Shift+Tab` to navigate backwards across top-level items.
     */
    private openAndFocusLast;
}

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
export declare function autoInit(selector?: string, options?: Partial<MegaMenuOptions>): AMegMen[];

/**
 * @fileoverview Configuration option types for AMegMen.
 *
 * Import this interface to get fully typed option objects when constructing
 * an AMegMen instance or calling `autoInit()`:
 *
 * ```ts
 * import type { MegaMenuOptions } from 'amegmen';
 *
 * const opts: Partial<MegaMenuOptions> = { openOnMouseover: true };
 * ```
 */
/**
 * All configurable options for an AMegMen instance.
 *
 * Every option has a sensible default in `AMegMen.defaults`. Pass a
 * `Partial<MegaMenuOptions>` to the constructor or `autoInit()` to override
 * only the keys you need.
 *
 * Options can also be set via `data-amegmen-*` attributes on the `<nav>` element
 * (kebab-case names; booleans as `"true"/"false"`, numbers as digit strings).
 * Programmatic `options` override data attributes.
 */
export declare interface MegaMenuOptions {
    /**
     * Prefix used when generating unique `id` attributes for ARIA wiring
     * (`aria-controls`, `aria-labelledby`).
     * @default 'amegmen'
     */
    uuidPrefix: string;
    /**
     * CSS class applied to the menu `<ul>` / `<ol>` element.
     * Must match the CSS selector that styles the nav list and offcanvas drawer.
     * @default 'amegmen'
     */
    menuClass: string;
    /**
     * CSS class applied to each top-level `<li>` navigation item.
     * @default 'amegmen-top-nav-item'
     */
    topNavItemClass: string;
    /**
     * CSS class present on each dropdown panel `<div>` **in the author's markup**.
     * AMegMen reads this class to locate panels — it does not inject it.
     * This allows the panel to be styled (hidden) by CSS before JS initialises.
     * @default 'amegmen-panel'
     */
    panelClass: string;
    /**
     * CSS class applied to column groups inside a panel.
     * Used to scope `ArrowRight` / `ArrowLeft` navigation between columns.
     * @default 'amegmen-panel-group'
     */
    panelGroupClass: string;
    /**
     * CSS class applied to a top-level item when the pointer enters it
     * (`openOnMouseover: true` mode only).
     * @default 'amegmen-hover'
     */
    hoverClass: string;
    /**
     * CSS class applied to an element when it has keyboard focus.
     * @default 'amegmen-focus'
     */
    focusClass: string;
    /**
     * CSS class applied to both the trigger element and the panel element
     * when the panel is open.
     * @default 'amegmen-open'
     */
    openClass: string;
    /**
     * CSS class applied to (or used to locate) the mobile toggle button.
     * @default 'amegmen-toggle'
     */
    toggleButtonClass: string;
    /**
     * Milliseconds to wait before opening a panel on `pointerover`.
     * Only applies when `openOnMouseover: true`.
     * @default 0
     */
    openDelay: number;
    /**
     * Milliseconds to wait before closing a panel after the pointer leaves the
     * top-level item. Gives the user time to move the pointer back without
     * accidentally closing the panel.
     * Only applies when `openOnMouseover: true`.
     * @default 250
     */
    closeDelay: number;
    /**
     * Duration in ms for the panel slide-down (open) animation.
     * Can be overridden per panel via `data-amegmen-open-duration` on the panel element.
     * @default 250
     */
    panelOpenDuration: number;
    /**
     * Duration in ms for the panel slide-up (close) animation.
     * Can be overridden per panel via `data-amegmen-close-duration` on the panel element.
     * @default 250
     */
    panelCloseDuration: number;
    /**
     * Extra milliseconds inserted between a panel closing and the next panel
     * opening when rapidly switching between top-level items. Use a small positive
     * value (e.g. `50`) when panels have very short close durations and a visual
     * "flash" is perceived.
     * @default 0
     */
    panelSwitchGap: number;
    /**
     * Milliseconds to wait after focus leaves the menu before closing the open
     * panel. Prevents the panel from closing when focus momentarily leaves during
     * internal navigation.
     * @default 300
     */
    focusOutDelay: number;
    /**
     * Duration in ms to accumulate keystrokes for the type-ahead search feature
     * before resetting the search string. Set to `0` to disable type-ahead.
     * @default 1000
     */
    typeAheadTimeout: number;
    /**
     * When `true`, panels open on `pointerover` (mouse hover / touch enter) in
     * addition to keyboard and click. On touch devices the first tap opens the
     * panel; a second tap on an open trigger follows the link `href`.
     * @default false
     */
    openOnMouseover: boolean;
    /**
     * `aria-label` value for the `<nav>` element. Distinguishes this landmark
     * from other navigation regions on the page (WCAG SC 2.4.1).
     * @default 'Main navigation'
     */
    navigationLabel: string;
    /**
     * When `true`, panel open/close events are announced to screen readers via an
     * `aria-live="polite"` region injected inside the nav. The announcement text
     * is `"{label} expanded"` (label is resolved from the panel's `aria-label`
     * or `aria-labelledby` target).
     * @default false
     */
    announceOpen: boolean;
    /**
     * Edge from which the mobile offcanvas drawer slides in.
     * @default 'right'
     */
    offcanvasDirection: 'left' | 'right' | 'top' | 'bottom';
    /**
     * Viewport width in pixels at which the menu switches from the mobile
     * offcanvas drawer to the desktop horizontal navigation bar.
     * @default 1280
     */
    desktopBreakpoint: number;
    /**
     * Horizontal alignment of all top-level items within the desktop nav bar.
     * Controls `justify-content` on the flex `.amegmen` list.
     * @default 'left'
     */
    navAlignment: 'left' | 'center' | 'right';
    /**
     * CSS `scroll-behavior` value passed to `window.scrollTo()` when the menu
     * auto-scrolls to bring an opening panel into view.
     * @default 'smooth'
     */
    scrollBehavior: 'auto' | 'smooth' | 'instant';
    /**
     * When `true`, a document-level `pointerup` listener closes any open panel
     * when the user clicks or taps outside the menu. Set to `false` if the host
     * page manages this behaviour itself.
     * @default true
     */
    closeOnOutsideClick: boolean;
    /**
     * CSS easing function for the panel slide-down and slide-up animations.
     * Passed directly to `el.style.transition`.
     * @default 'ease-out'
     */
    animationEasing: string;
    /**
     * When `true` and the mobile offcanvas drawer is open, Tab and Shift+Tab
     * cycle focus within `wrapperEl ?? element` rather than leaving the drawer.
     * Detaches automatically when the drawer closes.
     * @default false
     */
    trapFocus: boolean;
    /**
     * Pixels subtracted from the scroll target when auto-scrolling to show an
     * opening panel. Use this when the nav is inside a sticky header so the panel
     * is not partially hidden behind the header.
     * Also written as `--amegmen-sticky-offset` CSS custom property on the nav
     * element during `init()`.
     * @default 0
     */
    stickyOffset: number;
    /**
     * Maximum panel content height in pixels before the panel becomes internally
     * scrollable. When `0` (the default) there is no maximum — the panel grows
     * to its natural height.
     * @default 0
     */
    maxPanelHeight: number;
    /**
     * Called after a panel finishes its slide-down (open) animation.
     * Receives the panel element and the trigger element that opened it.
     * @default null
     */
    onOpen: ((panelEl: HTMLElement, triggerEl: HTMLElement) => void) | null;
    /**
     * Called after a panel starts its slide-up (close) animation.
     * Receives the panel element and the trigger element that was open.
     * @default null
     */
    onClose: ((panelEl: HTMLElement, triggerEl: HTMLElement) => void) | null;
    /**
     * Called before a panel opens. The panel will not open until the provided
     * `done()` callback is invoked, allowing lazy-loading of panel content.
     *
     * @example
     * ```ts
     * new AMegMen(nav, {
     *   onBeforeOpen(panel, trigger, done) {
     *     fetch('/partial.html')
     *       .then(r => r.text())
     *       .then(html => { panel.innerHTML = html; done(); });
     *   }
     * });
     * ```
     * @default null
     */
    onBeforeOpen: ((panelEl: HTMLElement, triggerEl: HTMLElement, done: () => void) => void) | null;
}

export { }
