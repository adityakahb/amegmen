# AMegMen

A keyboard- and screen-reader-accessible mega menu written in TypeScript with zero runtime dependencies.

---

## Table of Contents

1. [Installation](#installation)
2. [HTML Structure](#html-structure)
3. [Initialization](#initialization)
4. [Configuration Options](#configuration-options)
5. [JavaScript API](#javascript-api)
6. [Data-Attribute API](#data-attribute-api)
7. [CSS Classes & Styling](#css-classes--styling)
8. [Developer Instructions](#developer-instructions)

---

## Installation

### npm / module bundler

```bash
npm install amegmen
```

```ts
import { AMegMen, autoInit } from 'amegmen';
import 'amegmen/dist/styles/amegmen.css';
```

### CDN

```html
<link rel="stylesheet" href="dist/styles/amegmen.css" />
<script src="dist/scripts/amegmen.cdn.js" defer></script>
```

The CDN build exposes a single global, `AMegMen`, and auto-initializes all `[data-amegmen]` elements on `DOMContentLoaded`. For manual control:

```js
const menu = new AMegMen(document.querySelector('nav'), { openOnMouseover: true });

// Or initialize everything matching a selector at once:
AMegMen.autoInit('[data-amegmen]');
```

#### Script loading strategies

Choose the right `<script>` attribute for your deployment context:

| Strategy | Blocks parser? | Execution timing | Order guaranteed? | Recommended? |
|----------|----------------|-----------------|-------------------|--------------|
| `defer` | No | After DOM parsed, before `DOMContentLoaded` | Yes — source order | ✓ Yes |
| `async` | Briefly on execute | As soon as download completes | No | Use with care |
| None (end of `<body>`) | Effectively no | After all preceding HTML | Yes — source order | Fallback only |

**`defer` (recommended)** — Place the `<script defer>` tag in `<head>`. The browser fetches the
script in parallel with HTML parsing and executes it after parsing completes. `DOMContentLoaded`
fires immediately after, triggering the auto-init. Zero parser blocking, guaranteed DOM availability,
no race conditions.

```html
<!-- In <head> — fetched early, never blocks parsing -->
<link rel="stylesheet" href="dist/styles/amegmen.css" />
<script src="dist/scripts/amegmen.cdn.js" defer></script>
```

**`async`** — Script is fetched in parallel and executes as soon as it downloads, potentially before
the DOM is complete. The CDN bundle is safe here: it checks `document.readyState` at runtime and
defers to `DOMContentLoaded` when the DOM is not yet ready. Use `async` when execution order with
other scripts does not matter.

```html
<script src="dist/scripts/amegmen.cdn.js" async></script>
```

> **Why `defer` beats end-of-body:** A deferred `<script>` in `<head>` starts downloading while the
> HTML is still being parsed, whereas a blocking tag at the end of `<body>` cannot start until the
> parser reaches that line. `defer` therefore loads faster and is strictly better.

See the [script loading strategies demo](demos/script-loading/index.html) for detailed explanations
and the [Lighthouse demo](demos/lighthouse/index.html) for a complete performance-optimised example.

---

## HTML Structure

The library supports three markup patterns. All can be used on the same page.

> **Important:** Each panel `<div>` must already carry `class="amegmen-panel"` in your HTML. The library reads this class to locate panels and does not inject it — this lets CSS hide panels before JavaScript initializes.

### Pattern 1 — Link as trigger (backward-compatible)

The top-level `<a>` doubles as the panel toggle. The library adds `role="button"` to it automatically. Clicking or pressing Enter/Space toggles the panel; the link's `href` is not followed.

```html
<nav aria-label="Primary navigation" data-amegmen>
  <button class="amegmen-toggle" aria-expanded="false">
    <span class="amegmen-sr-only">Toggle Navigation</span>
  </button>
  <ul>
    <li>
      <a href="#movies">Movies</a>
      <div class="amegmen-panel">
        <ul class="amegmen-panel-group">
          <li><a href="#action">Action</a></li>
          <li><a href="#comedy">Comedy</a></li>
        </ul>
      </div>
    </li>
    <li><a href="#music">Music</a></li>     <!-- plain link, no panel -->
  </ul>
</nav>
```

### Pattern 2 — Separate disclosure button (recommended)

A dedicated `<button>` sits next to the link and controls the panel. **The `<a>` link navigates normally — only the `<button>` toggles the panel.** This pattern is preferred when the top-level destination should remain reachable as an ordinary link.

```html
<nav aria-label="Primary navigation" data-amegmen>
  <button class="amegmen-toggle" aria-expanded="false">
    <span class="amegmen-sr-only">Toggle Navigation</span>
  </button>
  <ul>
    <li>
      <a href="/products">Products</a>      <!-- navigates to /products, does NOT toggle panel -->
      <button type="button">
        <span class="amegmen-sr-only">Products submenu</span>
      </button>
      <div class="amegmen-panel">
        <ul class="amegmen-panel-group">
          <li><a href="/design">Design</a></li>
          <li><a href="/analytics">Analytics</a></li>
        </ul>
      </div>
    </li>
  </ul>
</nav>
```

### Pattern 3 — Button-only trigger (no navigation link)

A `<button>` is the sole top-level control — no accompanying `<a>`. Useful for category labels that have no destination page of their own.

```html
<li>
  <button type="button">
    <span>Categories</span>
  </button>
  <div class="amegmen-panel">
    <ul class="amegmen-panel-group">
      <li><a href="/electronics">Electronics</a></li>
      <li><a href="/clothing">Clothing</a></li>
    </ul>
  </div>
</li>
```

### Multi-column panels

Wrap multiple `amegmen-panel-group` lists in a single `amegmen-cols-N` div **inside** the panel `<div>`. The grid wrapper must be a child of the panel, never the panel element itself.

```html
<div class="amegmen-panel">
  <div class="amegmen-cols-3">      <!-- grid wrapper: 3 equal columns -->
    <ul class="amegmen-panel-group">
      <li><h3>Action</h3></li>
      <li><a href="#action-adventure">Action &amp; Adventure</a></li>
      <li><a href="#comedy">Comedy</a></li>
    </ul>
    <ul class="amegmen-panel-group">
      <li><h3>Drama</h3></li>
      <li><a href="#dramas">Dramas</a></li>
      <li><a href="#foreign">Foreign</a></li>
    </ul>
    <ul class="amegmen-panel-group">
      <li><h3>Musical</h3></li>
      <li><a href="#musicals">Musicals</a></li>
      <li><a href="#romance">Romance</a></li>
    </ul>
  </div>
</div>
```

Available grid modifiers: `amegmen-cols-1`, `amegmen-cols-2`, `amegmen-cols-3`, `amegmen-cols-4`. Columns collapse responsively at `920 px` (→ 2 columns) and `434 px` (→ 1 column).

### Right-anchored utility panels

Add `amegmen-panel-align-end` to the panel `<div>` to anchor it to the right edge of its trigger rather than the left edge of the nav. Useful for utility items like Search or Account that sit at the end of the nav bar.

```html
<li>
  <a href="#search">Search</a>
  <div class="amegmen-panel amegmen-panel-align-end">
    <form role="search">…</form>
  </div>
</li>
```

### Wrapper pattern

When the mobile toggle button must live outside the `<nav>` (e.g. for a sticky header layout), wrap both in a parent element with `class="amegmen-wrapper"`. The library will search the wrapper for the toggle button and mirror the `amegmen-desktop` class onto it so CSS selectors reach the toggle correctly.

```html
<div class="amegmen-wrapper">
  <button class="amegmen-toggle" aria-expanded="false">
    <span class="amegmen-sr-only">Toggle Navigation</span>
  </button>
  <nav data-amegmen>
    <ul>…</ul>
  </nav>
</div>
```

### Key rules

| Rule | Detail |
|------|--------|
| The `<nav>` is the root element passed to the constructor. | |
| Direct child must be `<ul>` or `<ol>`. | |
| Each panel `<div>` must carry `class="amegmen-panel"` in the HTML. | The library does not inject this class — it uses it to find panels. |
| Column groups inside a panel use `class="amegmen-panel-group"`. | Enables left/right column navigation. |
| Multi-column grids use `class="amegmen-cols-N"` on an **inner wrapper** div, not on the panel itself. | `amegmen-cols-2` through `amegmen-cols-4` available. |
| Right-anchored panels use `class="amegmen-panel-align-end"` on the panel `<div>`. | |
| A mobile toggle button uses `class="amegmen-toggle"`. | Optional; controls `aria-expanded` on the `<ul>`. May live inside `<nav>` or inside a `.amegmen-wrapper` parent. |

---

## Initialization

### Auto-init (zero JavaScript)

Add `data-amegmen` to any `<nav>`. The CDN script initializes all matching elements on `DOMContentLoaded`.

```html
<nav data-amegmen>…</nav>
```

Options can be passed via `data-amegmen-*` attributes (see [Data-Attribute API](#data-attribute-api)).

### Explicit init

```ts
import { AMegMen } from 'amegmen';

const menu = new AMegMen(
  document.getElementById('main-nav'),
  { openOnMouseover: true, openDelay: 150, closeDelay: 300 }
);
```

### `autoInit` helper

```ts
import { autoInit } from 'amegmen';

// Initialize all [data-amegmen] elements, with optional programmatic overrides:
const menus = autoInit('[data-amegmen]', { announceOpen: true });
```

Returns an array of `AMegMen` instances. Programmatic options override any `data-amegmen-*` attributes on the element.

### Double-init guard

Calling `new AMegMen(el)` on an already-initialized element returns the existing instance without re-initializing.

---

## Configuration Options

All options can be set at construction time or updated later via `setOption()`.

### Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `openOnMouseover` | `boolean` | `false` | When `true`, hovering a top-level item opens its panel. |
| `openDelay` | `number` | `0` | ms to wait before opening a panel on `pointerover` (`openOnMouseover: true` only). |
| `closeDelay` | `number` | `250` | ms to wait before closing a panel on `pointerout` (`openOnMouseover: true` only). |
| `closeOnOutsideClick` | `boolean` | `true` | When `false`, clicking or tapping outside the menu does not close the open panel. |
| `focusOutDelay` | `number` | `300` | ms to wait after focus leaves the menu before closing the open panel. Increase for users who need more time to reach the panel. |
| `scrollBehavior` | `'auto' \| 'smooth' \| 'instant'` | `'smooth'` | Scroll behavior when the menu scrolls to bring an opening panel into view. |
| `stickyOffset` | `number` | `0` | Pixels to subtract from the scroll-into-view target. Set to the height of a sticky header so panels scroll into view below it. Also written as `--amegmen-sticky-offset` CSS custom property. |
| `trapFocus` | `boolean` | `false` | When `true` and the mobile offcanvas drawer is open, Tab and Shift+Tab cycle focus within the drawer instead of escaping to the page. |
| `maxPanelHeight` | `number` | `0` | Maximum panel content height in px. When the panel content is taller, the panel becomes scrollable internally. `0` = no limit. |

### Animation

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `panelOpenDuration` | `number` | `250` | Duration in ms for the panel slide-down (open) animation. |
| `panelCloseDuration` | `number` | `250` | Duration in ms for the panel slide-up (close) animation. |
| `panelSwitchGap` | `number` | `0` | Extra delay in ms between one panel finishing its close animation and the next panel beginning its open animation when switching between top-level items. |
| `animationEasing` | `string` | `'ease-out'` | CSS easing function applied to the panel slide animation (any valid `transition-timing-function` value). |

### Callbacks

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onOpen` | `((panelEl, triggerEl) => void) \| null` | `null` | Called after a panel finishes opening. Receives the panel element and its trigger element. |
| `onClose` | `((panelEl, triggerEl) => void) \| null` | `null` | Called when a panel starts closing. Receives the panel element and its trigger element. Not called during `destroy()`. |
| `onBeforeOpen` | `((panelEl, triggerEl, done) => void) \| null` | `null` | Called before a panel opens. The panel will not open until `done()` is invoked. Use to lazy-load panel content before revealing it. |

### Accessibility

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `navigationLabel` | `string` | `"Main navigation"` | Value for the `aria-label` attribute on the `<nav>` element. |
| `announceOpen` | `boolean` | `false` | When `true`, injects an `aria-live="polite"` region that announces panel open/close to screen readers. |
| `typeAheadTimeout` | `number` | `1000` | ms to accumulate keystrokes for type-ahead search before the search string resets. |

### Layout

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `offcanvasDirection` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Direction from which the mobile offcanvas drawer slides in. |
| `desktopBreakpoint` | `number` | `1280` | Viewport width in px at which the menu switches from the mobile offcanvas drawer to the desktop bar. |
| `navAlignment` | `'left' \| 'center' \| 'right'` | `'left'` | Horizontal alignment of top-level items in the desktop nav bar (`justify-content: flex-start/center/flex-end` on the flex nav list). |

### Class names

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `menuClass` | `string` | `"amegmen"` | CSS class added to the `<ul>/<ol>` menu element. |
| `topNavItemClass` | `string` | `"amegmen-top-nav-item"` | CSS class added to each top-level `<li>`. |
| `panelClass` | `string` | `"amegmen-panel"` | CSS class the library looks for to identify panel `<div>` elements. Must already be present in your HTML. |
| `panelGroupClass` | `string` | `"amegmen-panel-group"` | CSS class identifying column groups within a panel. |
| `hoverClass` | `string` | `"amegmen-hover"` | CSS class added to a top-level item while the pointer is over it (`openOnMouseover` only). |
| `focusClass` | `string` | `"amegmen-focus"` | CSS class added to the currently focused element. |
| `openClass` | `string` | `"amegmen-open"` | CSS class added to both the trigger and the panel while the panel is open. |
| `toggleButtonClass` | `string` | `"amegmen-toggle"` | CSS class on the mobile toggle button. |
| `uuidPrefix` | `string` | `"amegmen"` | Prefix for auto-generated `id` attributes on triggers and panels. |

---

## JavaScript API

### Constructor

```ts
new AMegMen(element: HTMLElement, options?: Partial<MegaMenuOptions>)
```

Returns the new instance, or the existing instance if `element` was already initialized.

### Static methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `getVersion` | `AMegMen.getVersion(): string` | Returns the library version string (e.g. `"2.0.0"`). |

### Instance methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `getOption` | `getOption<K>(key: K): MegaMenuOptions[K]` | Return the current value of a single option. |
| `getAllOptions` | `getAllOptions(): Readonly<MegaMenuOptions>` | Return a snapshot of all current options. |
| `getDefaults` | `getDefaults(): Readonly<MegaMenuOptions>` | Return the static default values. |
| `setOption` | `setOption<K>(key, value, reinitialize?: boolean): void` | Update a single option. Pass `true` as the third argument to re-run initialization immediately (required for class-name options). |
| `openMenu` | `openMenu(): void` | Programmatically opens the mobile offcanvas drawer. No-op if already open. |
| `closeMenu` | `closeMenu(): void` | Programmatically closes the mobile offcanvas drawer. No-op if already closed. |
| `openPanelAt` | `openPanelAt(index: number): void` | Opens the panel for the top-level item at the given zero-based index. Closes any currently open panel first. Honors `onBeforeOpen` if set. No-op if the index is out of range or the item has no panel. |
| `closePanels` | `closePanels(): void` | Closes all open panels immediately. Fires `amegmenclose` events and the `onClose` callback. |
| `slideDown` | `slideDown(el: HTMLElement): void` | Animates an element from `display:none` to its natural height (jQuery-style). Respects `prefers-reduced-motion`, `maxPanelHeight`, and per-element `data-amegmen-open-duration`. |
| `slideUp` | `slideUp(el: HTMLElement): void` | Animates an element from its current height down to zero, then sets `display:none`. Respects `prefers-reduced-motion` and per-element `data-amegmen-close-duration`. |
| `slideToggle` | `slideToggle(el: HTMLElement): void` | Calls `slideDown` if hidden, `slideUp` if visible. |
| `destroy` | `destroy(): void` | Remove all event listeners and ARIA attributes added by the plugin, remove the live region, backdrop, and `--amegmen-sticky-offset` CSS property, and clear the internal instance reference. The element can be re-initialized afterwards with `new AMegMen(el)`. |

### `autoInit` (named export)

```ts
autoInit(selector?: string, options?: Partial<MegaMenuOptions>): AMegMen[]
```

Queries the document for all elements matching `selector` (default `"[data-amegmen]"`), initializes each as a mega menu, and returns the array of instances.

### Custom events

The library dispatches two `CustomEvent`s that bubble and are `composed` (cross shadow DOM):

| Event | Fired on | When | `detail` |
|-------|----------|------|----------|
| `amegmenopen` | Panel `<div>` | After a panel opens | `{ panel: HTMLElement, trigger: HTMLElement \| null }` |
| `amegmenclose` | Panel `<div>` | When a panel starts closing | `{ panel: HTMLElement, trigger: HTMLElement \| null }` |

`amegmenclose` is **not** fired during `destroy()`.

```js
document.querySelector('nav').addEventListener('amegmenopen', (e) => {
  console.log('opened', e.detail.panel, 'via', e.detail.trigger);
});
```

### Per-panel animation overrides

Add `data-amegmen-open-duration` or `data-amegmen-close-duration` (milliseconds) directly on a panel `<div>` to override the global `panelOpenDuration` / `panelCloseDuration` for that specific panel:

```html
<div class="amegmen-panel" data-amegmen-open-duration="400" data-amegmen-close-duration="200">
  <!-- larger panel that benefits from a slower reveal -->
</div>
```

---

## Data-Attribute API

Every `MegaMenuOptions` key can be set on the root `<nav>` element as a `data-amegmen-{kebab-case-key}` attribute. Programmatic options passed to the constructor or `autoInit` take precedence.

| Attribute value | Parsed as |
|-----------------|-----------|
| `"true"` / `"false"` | `boolean` |
| Numeric string (e.g. `"300"`) | `number` |
| Everything else | `string` |

```html
<nav
  data-amegmen
  data-amegmen-open-on-mouseover="true"
  data-amegmen-open-delay="150"
  data-amegmen-close-delay="300"
  data-amegmen-panel-open-duration="200"
  data-amegmen-panel-close-duration="150"
  data-amegmen-panel-switch-gap="50"
  data-amegmen-animation-easing="ease-in-out"
  data-amegmen-focus-out-delay="400"
  data-amegmen-type-ahead-timeout="1500"
  data-amegmen-close-on-outside-click="false"
  data-amegmen-scroll-behavior="auto"
  data-amegmen-navigation-label="Site navigation"
  data-amegmen-announce-open="true"
  data-amegmen-offcanvas-direction="left"
  data-amegmen-desktop-breakpoint="1024"
  data-amegmen-nav-alignment="center"
>
```

---

## CSS Classes & Styling

Import the provided stylesheet or write your own using the class names below.

### JS-controlled classes (added by the library at runtime)

| Class | Applied to | When |
|-------|-----------|------|
| `amegmen` | `<ul>/<ol>` | Always (on init). Also `js-amegmen` for progressive-enhancement CSS. |
| `amegmen-top-nav-item` | Each top-level `<li>` | Always. |
| `amegmen-toggle` | Mobile toggle `<button>` | On init. |
| `amegmen-open` | Trigger + panel | While the panel is open. |
| `amegmen-focus` | Any focused element inside the menu | While the element has keyboard focus. |
| `amegmen-hover` | Top-level `<li>` | While pointer is over it (`openOnMouseover` only). |
| `amegmen-desktop` | `<nav>` (and `.amegmen-wrapper` if present) | When the viewport is at or above `desktopBreakpoint`. |
| `amegmen-offcanvas-open` | `<nav>` | While the mobile offcanvas drawer is open. |

### Markup-defined classes (must be present in your HTML)

| Class | Applied to | Purpose |
|-------|-----------|---------|
| `amegmen-panel` | Panel `<div>` | **Required.** Identifies the element as a dropdown panel. The library locates panels by this class. |
| `amegmen-panel-group` | `<ul>` inside a panel | Marks column groups; enables ArrowLeft/Right column navigation. |
| `amegmen-cols-1` … `amegmen-cols-4` | Inner wrapper `<div>` inside a panel | CSS grid layout — N equal-width columns. Must be on a child of the panel, **not** on the panel itself. |
| `amegmen-panel-align-end` | Panel `<div>` | Right-anchors the panel to its trigger instead of the nav's left edge. |
| `amegmen-sr-only` | Any element | Visually hides content while keeping it accessible to screen readers. |
| `amegmen-wrapper` | Parent `<div>` of `<nav>` | Optional wrapper that allows the mobile toggle to live outside the `<nav>`. |
| `amegmen-push-end` | Top-level `<li>` | **Desktop only.** Pushes this item — and every item after it — to the trailing (right) edge of the nav bar via `margin-inline-start: auto`. Useful for separating utility items (search, account) from primary navigation links. |

### CSS Custom Properties

The stylesheet exposes every design token as a CSS custom property on `:root`. Override any property on the `<nav>` element or an ancestor to theme the menu without recompiling Sass.

#### Color tokens (`src/scss/_colors.scss`)

| Property | Default | Description |
|----------|---------|-------------|
| `--amegmen-color-bg` | `#dfe2e2` | Nav bar + offcanvas background. |
| `--amegmen-color-text` | `#454545` | All nav text. |
| `--amegmen-color-bg-panel` | `#ffffff` | Dropdown panel background. |
| `--amegmen-color-border` | `#c5c5c5` | Nav and panel borders. |
| `--amegmen-color-link` | `#225fd7` | Links inside panels. |
| `--amegmen-color-link-hover` | `#1a4bb0` | Hovered links inside panels. |
| `--amegmen-color-trigger-bg-hover` | `rgba(0 0 0 / 0.06)` | Trigger background on pointer hover. |
| `--amegmen-color-trigger-text-hover` | `inherit` | Trigger text color on pointer hover. |
| `--amegmen-color-trigger-bg-open` | `#ffffff` | Trigger background while its panel is open. |
| `--amegmen-color-trigger-text-open` | `#454545` | Trigger text color while its panel is open. |
| `--amegmen-focus-ring-color` | `rgba(34, 95, 215, 0.7)` | Focus ring color (WCAG 2.2 compliant). |
| `--amegmen-backdrop-bg` | `rgba(0, 0, 0, 0.5)` | Offcanvas backdrop overlay. |
| `--amegmen-input-bg` | `#ffffff` | Form input background. |
| `--amegmen-input-bg-readonly` | `#f0f0f0` | Read-only input background. |
| `--amegmen-input-bg-disabled` | `#e8e8e8` | Disabled input background. |
| `--amegmen-input-border` | `#999999` | Input border color. |
| `--amegmen-btn-bg` | `#225fd7` | Primary button background. |
| `--amegmen-btn-bg-hover` | `#1a4bb0` | Primary button hover background. |
| `--amegmen-btn-text` | `#ffffff` | Primary button text color. |

Built-in dark-mode overrides are applied automatically via `@media (prefers-color-scheme: dark)`.

#### Structural tokens (`src/css/variables.css`)

| Property | Default | Description |
|----------|---------|-------------|
| `--amegmen-nav-height` | `3em` | Nav bar height (used for offcanvas positioning). |
| `--amegmen-item-padding-block` | `0.5em` | Top/bottom padding on nav items. |
| `--amegmen-item-padding-inline` | `1em` | Left/right padding on nav items. |
| `--amegmen-panel-padding` | `1em` | Panel inner padding and column gap. |
| `--amegmen-panel-col-min-width` | `180px` | Minimum width of each column inside an `amegmen-cols-N` wrapper. |
| `--amegmen-transition-duration` | `250ms` | CSS animation duration for non-JS-driven transitions (e.g. hover states). JS-driven slide animations use `panelOpenDuration` / `panelCloseDuration` options instead. |
| `--amegmen-transition-easing` | `ease-out` | CSS easing for non-JS-driven transitions. JS slide animations use the `animationEasing` option. |
| `--amegmen-z-panel` | `100` | Panel `z-index`. |
| `--amegmen-border-radius` | `3px` | Border radius on panels and focus rings. |
| `--amegmen-offcanvas-width` | `320px` | Width of the mobile offcanvas drawer. |
| `--amegmen-focus-ring-width` | `2px` | Focus ring stroke width. |
| `--amegmen-focus-ring-offset` | `2px` | Focus ring offset from the element edge. |

### Responsive / mobile

The toggle button (`amegmen-toggle`) controls `aria-expanded` on the `<ul>`. The `desktopBreakpoint` option (default `1280px`) controls when the library adds the `amegmen-desktop` class. Use CSS to show/hide the `<ul>` based on that class and the `aria-expanded` attribute:

```css
/* Hide menu list on mobile by default */
.js-amegmen { display: none; }

/* Show when toggle is expanded */
.amegmen-toggle[aria-expanded="true"] + .js-amegmen { display: block; }

/* Always show on desktop */
.amegmen-desktop .js-amegmen { display: flex; }
```

### Reduced motion

The default stylesheet respects `prefers-reduced-motion` — transition animations are suppressed when the user has enabled that OS preference. The `slideDown`/`slideUp` methods also check this preference at runtime and skip animation when it is active.

---

## Developer Instructions

### Prerequisites

- Node.js 18+
- npm 9+

```bash
git clone https://github.com/adityakahb/amegmen.git
cd amegmen
npm install
```

### Development server

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173` with live-reload. The demos at `demos/` are served as the root; the compiled `dist/` is served as a static public directory so demos can import the built files. Additional demos:

- `demos/print/` — hard-copy print rendering with expanded panels
- `demos/lighthouse/` — Lighthouse-optimised page targeting 100/100/100/100

### Building

```bash
npm run build          # full library build — ESM + UMD + CJS + minified copies + CSS + CDN bundle
npm run build:cdn      # CDN-only UMD bundle
npm run build:css      # stylesheet only (no sourcemap)
npm run build:pages    # full build then GitHub Pages static site → docs/
npm run build:types    # TypeScript declaration files only
```

Output lands in `dist/`. See [Build Outputs](#build-outputs) in [CLAUDE.md](CLAUDE.md) for the full file inventory.

### Testing

```bash
npm test               # single run
npm run test:watch     # watch mode
npm run test:coverage  # HTML + text coverage report → coverage/
```

Tests use Vitest 2.x with a jsdom environment. Run `npm run typecheck` to type-check without emitting files.

### Code style

The project uses [ESLint](https://eslint.org) for TypeScript linting, [Prettier](https://prettier.io) for formatting, and [Stylelint](https://stylelint.io) for CSS linting:

```bash
npm run lint            # lint TypeScript + CSS
npm run lint:fix        # auto-fix lint errors
npm run format          # format all source files with Prettier
npm run format:check    # check formatting without writing
```

### Adding a new option

1. Add the field to `MegaMenuOptions` in [`src/ts/types.ts`](src/ts/types.ts) with a JSDoc comment.
2. Add the default value to `AMegMen.defaults` in [`src/ts/amegmen.ts`](src/ts/amegmen.ts).
3. Wire the option in the relevant method(s).
4. Add at least one test in [`tests/amegmen.test.ts`](tests/amegmen.test.ts).
5. Document the option in the [Configuration Options](#configuration-options) table above.
6. Update [CLAUDE.md](CLAUDE.md) if the change affects architecture-level behaviour.

### Build outputs

**Scripts** (`dist/scripts/`):

| File | Format | Notes |
|------|--------|-------|
| `amegmen.cdn.js` / `.min.js` | UMD | `window.AMegMen` = class; auto-inits on `DOMContentLoaded` |
| `amegmen.umd.js` / `.min.js` | UMD | `window.AMegMen = { AMegMen, autoInit }`; no auto-init |
| `amegmen.esm.js` / `.min.js` | ESM | named exports; tree-shakeable |
| `amegmen.cjs.js` / `.min.js` | CJS | CommonJS for older bundlers |

Un-minified files include `.js.map` source maps. `dist/index.d.ts` has rolled-up TypeScript declarations.

**Styles** (`dist/styles/`):

| File | Notes |
|------|-------|
| `amegmen.css` | Unminified, includes `.css.map` source map |
| `amegmen.min.css` | Minified, no source map |
| `amegmen.cjs.js` / `.min.js` | CJS | named exports |
| `amegmen.css` | — | compiled stylesheet |
| `index.d.ts` | — | rolled-up TypeScript declarations |
