# CDN Publish Checklist — jsDelivr & Skypack

Both [jsDelivr](https://www.jsdelivr.com/) and [Skypack](https://www.skypack.dev/)
serve npm packages automatically — there is no separate "publish" step. Once
`amegmen` is live on npm (see `npm-publish-checklist.md`), it is mirrored on
both. This checklist verifies the bundles resolve and documents the canonical
URLs.

---

## Prerequisite

- [ ] The target version is published to npm and visible via
      `npm view amegmen version`.
- [ ] A matching git tag / GitHub Release exists (jsDelivr can also serve files
      straight from GitHub tags as a fallback).

---

## 1. jsDelivr (npm-backed)

jsDelivr mirrors the published npm tarball, so it serves the `dist/` files
directly.

- [ ] **Pinned version** (recommended for production — immutable, cacheable):
  - CDN script:
    `https://cdn.jsdelivr.net/npm/amegmen@<version>/dist/scripts/amegmen.cdn.min.js`
  - Stylesheet:
    `https://cdn.jsdelivr.net/npm/amegmen@<version>/dist/styles/amegmen.min.css`
- [ ] **ESM (auto-bundled)**:
    `https://cdn.jsdelivr.net/npm/amegmen@<version>/+esm`
- [ ] **Latest** (do not use in production — cache + breaking-change risk):
    `https://cdn.jsdelivr.net/npm/amegmen/dist/scripts/amegmen.cdn.min.js`
- [ ] Open each URL in a browser — the file loads (HTTP 200), not a 404 or the
      directory listing.
- [ ] Purge the cache after a new release if needed:
    `https://purge.jsdelivr.net/npm/amegmen@<version>/dist/scripts/amegmen.cdn.min.js`

### jsDelivr smoke test

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/amegmen@<version>/dist/styles/amegmen.min.css"
/>
<script
  src="https://cdn.jsdelivr.net/npm/amegmen@<version>/dist/scripts/amegmen.cdn.min.js"
  defer
></script>
```

- [ ] In a blank page, the CDN build exposes the global `AMegMen` and
      auto-initialises `[data-amegmen]` elements on `DOMContentLoaded`.

## 2. Skypack (ESM-only)

Skypack serves optimised ES modules for browsers and Deno.

- [ ] **Pinned ESM**: `https://cdn.skypack.dev/amegmen@<version>`
- [ ] **Latest ESM**: `https://cdn.skypack.dev/amegmen`
- [ ] Confirm the package is tree-shakeable on Skypack — `sideEffects: false`
      in `package.json` enables this.

### Skypack smoke test

```html
<script type="module">
  import { AMegMen, autoInit } from 'https://cdn.skypack.dev/amegmen@<version>';
  autoInit('[data-amegmen]');
</script>
```

- [ ] The named exports `AMegMen` and `autoInit` import without error.
- [ ] Visit `https://www.skypack.dev/view/amegmen` and check the Skypack package
      score (types, exports, ESM) once the version has been indexed.

## 3. Post-verification

- [ ] Update README CDN examples to the new pinned version if they reference a
      specific one.
- [ ] Note that CDN mirrors can take a few minutes after an npm publish to
      become available — re-check if a fresh URL 404s initially.
