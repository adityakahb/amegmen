# AMegMen — Specification & Implementation Plan

> **Version:** 2.0.0  
> **Status:** Implemented  
> **Last updated:** 2026-06-17

---

## 1. Real-World Problem Statement

### 1.1 Navigation accessibility failures in the wild

Mega menus are ubiquitous in large website navigation — retail, media, government, and enterprise sites all use them. Yet most implementations share the same class of accessibility failures:

| Failure | Impact |
|---------|--------|
| Panels cannot be opened or closed with a keyboard | Screen reader and keyboard-only users cannot reach sub-navigation |
| `<div>` soup with no ARIA semantics | Screen readers announce "group" or nothing, giving no structural context |
| Focus stolen on open or lost on close | Disorienting for all keyboard users; violates WCAG SC 2.4.3 |
| No `aria-expanded` state | Screen reader users cannot tell whether a panel is open |
| Mouse-only hover menus | Touch users, keyboard users, and users of switch access cannot operate the nav |
| Fixed-position overlays block page content | Visually distressing; violates WCAG SC 1.4.13 (Content on Hover or Focus) |
| Hard-coded colour values | Cannot adapt to dark mode or Windows High Contrast Mode |
| No reduced-motion support | Triggers vestibular disorders in users who have enabled "Reduce motion" |
| No live region announcements | Screen readers miss panel open/close state changes |
| Mobile menus trap focus or do not trap it | Either prevents leaving (bad) or lets focus escape an unclosed drawer (confusing) |

### 1.2 The developer experience gap

Beyond end-user failures, existing solutions have developer experience problems:

- Require framework-specific rewrites for each stack (React / Vue / Angular / Svelte)
- Are tightly coupled to one CSS methodology (Bootstrap classes, Tailwind utilities)
- Lack a programmatic API for lazy-loading panel content
- Do not support per-panel animation timing overrides
- Have no callback hooks for analytics or dynamic content

---

## 2. Design Goals

1. **Zero runtime dependencies** — runs in any stack without pulling a framework.
2. **ARIA APG Disclosure Navigation Pattern** — implements the W3C specification exactly.
3. **Mobile-first** — single instance handles both mobile offcanvas and desktop bar.
4. **Customisable** — all visual tokens are CSS custom properties; all behaviour options are runtime-configurable.
5. **Accessible** — WCAG 2.2 AA + AAA (SC 1.4.11 Non-text Contrast, SC 2.4.11 Focus Appearance, SC 2.3.3 Animation from Interactions, SC 1.4.13 Content on Hover or Focus).
6. **Secure** — guards against XSS via `javascript:` URI, prototype pollution via data-attribute allowlist.
7. **Testable** — 93%+ statement coverage, jsdom + Vitest.
8. **Tree-shakeable** — `sideEffects: false` in `package.json`; ESM build enables dead-code elimination.
9. **Lighthouse-ready** — no render-blocking resources required; passes 100/100/100/100 when loaded correctly.

---

## 3. Architecture

### 3.1 Source layout

```
src/
├── ts/
│   ├── amegmen.ts        # Core class — all DOM wiring, ARIA, keyboard, pointer
│   ├── cdn.ts             # CDN entry: attaches autoInit as static, default-exports AMegMen
│   ├── index.ts           # Library entry: named exports + autoInit + DOMContentLoaded auto-init
│   ├── keyboard.ts        # Key constant map (event.key values)
│   ├── types.ts           # MegaMenuOptions interface (fully JSDoc'd)
│   └── utils/
│       ├── dom.ts         # isFocusable / isTabbable / getTabbable / closestEl
│       └── uid.ts         # generateId / ensureId
├── css/
│   ├── index.css          # Entry point with CSS @import chain
│   ├── variables.css      # All :root CSS custom properties + dark mode overrides
│   ├── base.css           # Nav container, wrapper, offcanvas, menu list
│   ├── nav.css            # Top-level items, trigger buttons, disclosure arrows
│   ├── panel.css          # Dropdown panels, column grids, panel groups
│   ├── forms.css          # Form controls inside panels
│   ├── toggle.css         # Mobile hamburger button
│   ├── a11y.css           # sr-only, focus management, WHCM overrides
│   ├── motion.css         # prefers-reduced-motion overrides
│   └── print.css          # Print stylesheet (expand panels, hide chrome)
└── connectors/
    ├── react/index.ts     # useMegaMenu hook + MegaMenuConnector interface
    ├── vue/index.ts       # useMegaMenu composable + v-amegmen directive + plugin
    ├── angular/index.ts   # AmegmenDirective + AmegmenModule
    └── svelte/index.ts    # megamenu action + MegaMenuAction interface
```

### 3.2 Event architecture

All menu-level listeners are registered with a single `AbortController` signal:

```
AbortController (mainAbort)
  └── menu.addEventListener('focusin', …, { signal })
  └── menu.addEventListener('focusout', …, { signal })
  └── menu.addEventListener('keydown', …, { signal })
  └── menu.addEventListener('pointerover', …, { signal })
  └── menu.addEventListener('pointerout', …, { signal })
  └── menu.addEventListener('pointerdown', …, { signal })
  └── menu.addEventListener('click', …, { signal })
  └── toggleButton.addEventListener('click', …, { signal })
  └── backdropEl.addEventListener('click', …, { signal })

AbortController (outerAbort) — only active while a panel is open
  └── document.addEventListener('pointerup', …, { signal })
  └── MutationObserver per open panel (Windows Narrator workaround)

AbortController (trapFocusAbort) — only active while trapFocus is on and drawer is open
  └── document.addEventListener('keydown', …, { signal })
```

Calling `abort()` removes all listeners at once — no explicit `removeEventListener` bookkeeping.

### 3.3 Markup patterns

Three patterns are supported in the top-level `<li>` markup:

| Pattern | Markup | Trigger element | Panel trigger |
|---------|--------|-----------------|---------------|
| 1 | `<a href> + <div.amegmen-panel>` | `<a>` (gets `role="button"`) | Click / Enter / Space / Arrow |
| 2 | `<a href> + <button> + <div.amegmen-panel>` | `<button>` | Button click; link navigates |
| 3 | `<button> + <div.amegmen-panel>` | `<button>` | Button click / keyboard |

Pattern 2 is recommended because it separates navigation (`<a>`) from disclosure (`<button>`), satisfying ARIA APG without needing `role="button"` overrides.

### 3.4 CSS architecture

All CSS is scoped to `.amegmen-nav` or `.amegmen-wrapper` — styles cannot leak into the host page. CSS custom properties on `:root` are the only global declarations. This allows:

- Authors to override tokens on any ancestor element without a build step.
- SSR/static sites to render the nav with correct styles before JS loads.
- Zero specificity wars with host-page CSS frameworks.

CSS nesting (`&`) and `@layer` are used throughout for readable, maintainable rules.

---

## 4. Accessibility Specification

### 4.1 ARIA attribute wiring

| Element | On init | On open | On close |
|---------|---------|---------|---------|
| `<nav>` | `aria-label = navigationLabel option` | — | — |
| Trigger (`<a>` or `<button>`) | `aria-haspopup="true"`, `aria-expanded="false"`, `aria-controls={panelId}` | `aria-expanded="true"` | `aria-expanded="false"` |
| Panel `<div>` | `role="region"`, `aria-hidden="true"`, `aria-labelledby={triggerId}` | `aria-hidden="false"` | `aria-hidden="true"` |
| Mobile toggle `<button>` | `aria-expanded="false"`, `aria-controls={menuId}`, `aria-label="Toggle navigation"` (if unlabelled) | `aria-expanded="true"` | `aria-expanded="false"` |
| `<hr>` separators | `role="separator"` | — | — |

### 4.2 Keyboard interactions

Follows [ARIA APG Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) exactly.

**Top-level navigation bar:**

| Key | Action |
|-----|--------|
| `Enter` / `Space` on trigger | Toggle panel |
| `ArrowDown` | Open panel, focus first item |
| `ArrowUp` on open trigger | Close, open previous item's panel, focus last item |
| `ArrowRight` / `ArrowLeft` | Move to next / previous trigger |
| `Home` / `End` | Move to first / last trigger |
| `Escape` | Close panel, return focus to trigger |
| `Tab` | Natural tab order through menu |
| `Shift+Tab` | Close panel, open previous, focus last |
| Printable character | Type-ahead search |

**Inside a panel:**

| Key | Action |
|-----|--------|
| `Escape` | Close panel, return focus to trigger |
| `ArrowDown` / `ArrowUp` | Next / previous item in panel |
| `ArrowRight` / `ArrowLeft` | Jump to next / previous `amegmen-panel-group` |
| `Home` / `End` | First / last item in current group |
| `Tab` / `Shift+Tab` | Natural tab order |
| Printable character | Type-ahead within top-level item's tabbable items |

### 4.3 WCAG 2.2 conformance targets

| SC | Level | How AMegMen satisfies it |
|----|-------|--------------------------|
| 1.4.11 Non-text Contrast | AA | Focus ring ≥ 3:1 against adjacent colours |
| 1.4.13 Content on Hover or Focus | AA | `closeOnOutsideClick`, pointer-out delay |
| 2.1.1 Keyboard | A | Full keyboard navigation (ARIA APG pattern) |
| 2.1.2 No Keyboard Trap | A | Tab/Shift+Tab exit menu naturally; `trapFocus` only when opted-in |
| 2.4.1 Bypass Blocks | A | `<nav aria-label>` landmark; panels are `role="region"` |
| 2.4.3 Focus Order | A | Focus moves predictably; `Escape` returns to trigger |
| 2.4.7 Focus Visible | AA | Custom focus ring on all interactive elements |
| 2.4.11 Focus Appearance | AA | 2px solid ring, 2px offset (WCAG 2.2) |
| 2.3.3 Animation from Interactions | AAA | `prefers-reduced-motion` removes all transitions |
| 4.1.2 Name, Role, Value | A | Full ARIA wiring on all interactive elements |
| 4.1.3 Status Messages | AA | `aria-live="polite"` live region when `announceOpen: true` |

---

## 5. Build Outputs

### 5.1 JavaScript (`dist/scripts/`)

| File | Format | Entry | Global |
|------|--------|-------|--------|
| `amegmen.cdn.js` | UMD | `cdn.ts` | `window.AMegMen` = class (auto-inits) |
| `amegmen.cdn.js.map` | Source map | — | — |
| `amegmen.cdn.min.js` | UMD minified | same | same |
| `amegmen.umd.js` | UMD | `index.ts` | `window.AMegMen = { AMegMen, autoInit }` |
| `amegmen.umd.js.map` | Source map | — | — |
| `amegmen.umd.min.js` | UMD minified | same | same |
| `amegmen.esm.js` | ESM | `index.ts` | named exports |
| `amegmen.esm.js.map` | Source map | — | — |
| `amegmen.esm.min.js` | ESM minified | same | same |
| `amegmen.cjs.js` | CJS | `index.ts` | named exports |
| `amegmen.cjs.js.map` | Source map | — | — |
| `amegmen.cjs.min.js` | CJS minified | same | same |

### 5.2 CSS (`dist/styles/`)

| File | Notes |
|------|-------|
| `amegmen.css` | Unminified, with source map |
| `amegmen.css.map` | Source map |
| `amegmen.min.css` | Minified, no source map |

### 5.3 TypeScript (`dist/`)

| File | Notes |
|------|-------|
| `index.d.ts` | Rolled-up declarations for all exports |

---

## 6. Framework Connectors

### 6.1 Common interface (`MegaMenuConnector`)

```ts
interface MegaMenuConnector {
  instance: AMegMen | null;
  openPanelAt(index: number): void;
  closePanels(): void;
  setOption<K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K]): void;
}
```

### 6.2 React (`src/connectors/react/index.ts`)

- `useMegaMenu(ref, options)` hook
- Manages instance lifecycle with `useEffect`
- Re-creates on option change; destroys on unmount
- SSR-safe: guards with `typeof window !== 'undefined'`

### 6.3 Vue 3 (`src/connectors/vue/index.ts`)

- `useMegaMenu(ref, options)` composable
- `vAmegmen` directive (`v-amegmen="options"`) — `mounted`, `updated`, `unmounted`
- `createAMegMenPlugin()` — global plugin via `app.use()`
- `updated` hook diffs options and calls `setOption` — avoids full re-init

### 6.4 Angular (`src/connectors/angular/index.ts`)

- `AmegmenDirective` — attribute directive (`amegmen [amegmenOptions]="…"`)
- Creates instance in `ngAfterViewInit` (DOM ready), destroys in `ngOnDestroy`
- `ngOnChanges` diffs inputs and calls `setOption`
- `AmegmenModule` for NgModule-based applications

### 6.5 Svelte (`src/connectors/svelte/index.ts`)

- `megamenu` Svelte action (`use:megamenu`)
- `update(newOptions)` — diffs and calls `setOption`; `destroy()` — calls `instance.destroy()`
- Dispatches `amegmenmount` custom event with `{ instance }` for parent component access

### 6.6 Packaging recommendation

Publish connectors as separate npm packages with a peer dependency on `amegmen`:

```
amegmen-react   — peerDependency: amegmen, react ≥ 18
amegmen-vue     — peerDependency: amegmen, vue ≥ 3
amegmen-angular — peerDependency: amegmen, @angular/core ≥ 14
amegmen-svelte  — peerDependency: amegmen, svelte ≥ 4
```

---

## 7. Security Measures

| Attack vector | Mitigation |
|---------------|------------|
| `href="javascript:…"` XSS | `handleMenuClick` checks `target.protocol !== 'javascript:'` before assigning to `window.location.href` |
| Attribute injection via data-attributes | `parseDataOptions` rejects any key not present in `AMegMen.defaults` (prototype-pollution guard) |
| Injected HTML in panels | Library never reads `innerHTML` of panels — only queries for existing elements |
| CSS injection via class names | Class names are read-only from `defaults` — not constructed from user input |

---

## 8. Test Coverage

| File | Statements | Branches |
|------|-----------|----------|
| `uid.ts` | 100% | 100% |
| `keyboard.ts` | 100% | 100% |
| `dom.ts` | 100% | 91% |
| `index.ts` | 97% | 94% |
| `amegmen.ts` | 93% | 81% |
| `cdn.ts` | 0% | — (re-export only) |
| `types.ts` | 0% | — (interface only) |

Known uncovered paths in `amegmen.ts`:
- Type-ahead fallback `searchSet = tabbables` — reached only when focused element is in `<ul>` but outside any top-nav-item (unreachable via standard keyboard navigation).
- `onPointerDown` setTimeout body — race condition between `focusout` and `pointerdown`, exercisable only with precise event timing.

`index.ts` line ~57 — `DOMContentLoaded` listener — jsdom always reports `readyState === 'complete'` so this branch cannot be reached in the test environment.

---

## 9. Demos

| Demo | Path | Purpose |
|------|------|---------|
| Main | `demos/index.html` | All 5 patterns (link trigger, disclosure button, hover, forms, col layout) |
| Print | `demos/print/index.html` | Verify hard-copy rendering with expanded panels and printed URLs |
| Lighthouse | `demos/lighthouse/index.html` | 100/100/100/100 Lighthouse scores via inlined critical CSS + deferred JS |
