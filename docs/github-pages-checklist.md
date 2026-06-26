# GitHub Pages Publish Checklist — AMegMen

Steps to publish the demos as a static site at
`https://adityakahb-cts.github.io/amegmen/`.

The site is built from `demos/` into `docs/` by `vite-pages.config.ts`, which
uses a relative `base: './'` so it works at any sub-path, and writes a
`.nojekyll` file so GitHub Pages serves the assets verbatim.

---

## ⚠️ Resolution of the `docs/` conflict

Originally, the static site built into `docs/`, which deleted the hand-authored markdown files. We resolved this by:

- [x] Moving the static site build output to a dedicated folder (`dist-pages/`), leaving the `docs/` directory exclusively for markdown documentation.
- [x] Configuring GitHub Pages to deploy via a GitHub Actions workflow from the `dist-pages/` build artifact. This avoids committing build artifacts to git.

---

## 1. Build the site

- [ ] `npm run build:pages` — runs the full library build, then builds the demos into `dist-pages/`.
- [ ] Confirm `dist-pages/index.html` exists and references hashed asset paths under `./assets/`.
- [ ] Confirm `dist-pages/.nojekyll` exists.
- [ ] Confirm the demo sub-pages built: `dist-pages/print/`, `dist-pages/lighthouse/`, `dist-pages/script-loading/`.

## 2. Verify locally

- [ ] `npm run preview` (or any static server) and open the built `dist-pages/` — every demo loads, panels open, CSS applies in light **and** dark mode.
- [ ] No 404s in the network panel for scripts/styles (relative base resolves).

## 3. GitHub Actions Workflow (automated)

- [ ] A workflow is configured in `.github/workflows/deploy-pages.yml` to automatically build and deploy the `dist-pages/` folder to GitHub Pages when changes are pushed to `master`/`main`.
- [ ] Push changes to the default branch to trigger the build and deploy.

## 4. Configure the repository (one-time)

- [ ] Repo **Settings → Pages**.
- [ ] **Source**: "GitHub Actions".
- [ ] Once configured, GitHub Pages will deploy automatically via the workflow.

## 5. Verify the live site

- [ ] Visit `https://adityakahb-cts.github.io/amegmen/`.
- [ ] All demos load and assets resolve (no mixed-content or 404 errors).
- [ ] Run Lighthouse against the `lighthouse/` demo — targets 100/100/100/100.
- [ ] Test keyboard navigation and a screen reader on the live site.

## 6. Re-deploy on changes

- [ ] Merging changes into the default branch automatically builds and deploys the site. No manual build or committing of build files is necessary!
