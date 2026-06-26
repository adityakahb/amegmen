# GitHub Pages Publish Checklist — AMegMen

Steps to publish the demos as a static site at
`https://adityakahb.github.io/amegmen/`.

The site is built from `demos/` into `docs/` by `vite-pages.config.ts`, which
uses a relative `base: './'` so it works at any sub-path, and writes a
`.nojekyll` file so GitHub Pages serves the assets verbatim.

---

## ⚠️ Important caveat — `docs/` is the build output

`vite-pages.config.ts` sets `emptyOutDir: true` on `docs/`. Running
`npm run build:pages` **clears `docs/` before writing the site**, which removes
any hand-authored markdown that lives there (`amegmen-specs.md`,
`*-checklist.md`).

Choose one of:

- [ ] Keep the markdown docs committed to git and restore them after a pages
      build (`git checkout docs/*.md`), **or**
- [ ] Move the static site to a dedicated folder (e.g. `site/`) and point Pages
      at that, leaving `docs/` for documentation only.

Pick a convention and apply it consistently before the first deploy.

---

## 1. Build the site

- [ ] `npm run build:pages` — runs the full library build, then builds the demos
      into `docs/`.
- [ ] Confirm `docs/index.html` exists and references hashed asset paths under
      `./assets/`.
- [ ] Confirm `docs/.nojekyll` exists.
- [ ] Confirm the demo sub-pages built: `docs/print/`, `docs/lighthouse/`,
      `docs/script-loading/`.
- [ ] Restore any markdown docs if they were wiped (see caveat above).

## 2. Verify locally

- [ ] `npm run preview` (or any static server) and open the built `docs/` —
      every demo loads, panels open, CSS applies in light **and** dark mode.
- [ ] No 404s in the network panel for scripts/styles (relative base resolves).

## 3. Commit & push

- [ ] Commit the regenerated `docs/` directory.
- [ ] Push to the default branch (`main`).

## 4. Configure the repository (one-time)

- [ ] Repo **Settings → Pages**.
- [ ] **Source**: "Deploy from a branch".
- [ ] **Branch**: `main`, **folder**: `/docs`.
- [ ] Save and wait for the first Pages build to finish.

## 5. Verify the live site

- [ ] Visit `https://adityakahb.github.io/amegmen/`.
- [ ] All demos load and assets resolve (no mixed-content or 404 errors).
- [ ] Run Lighthouse against the `lighthouse/` demo — targets 100/100/100/100.
- [ ] Test keyboard navigation and a screen reader on the live site.

## 6. Re-deploy on changes

- [ ] Re-run `npm run build:pages`, restore markdown docs, commit, and push.
      GitHub rebuilds Pages automatically on push to `main`.
