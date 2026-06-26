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
export interface MegaMenuOptions {
  // ─── DOM class / id configuration ─────────────────────────────────────────

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

  // ─── Timing ────────────────────────────────────────────────────────────────

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

  // ─── Behaviour ─────────────────────────────────────────────────────────────

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

  // ─── Callbacks ─────────────────────────────────────────────────────────────

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
