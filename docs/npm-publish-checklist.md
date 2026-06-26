# npm Publish Checklist — AMegMen

A step-by-step checklist for publishing the `amegmen` package to the public npm
registry. Work top to bottom; every box should be ticked before `npm publish`.

---

## 1. Pre-flight — repository state

- [ ] Working tree is clean (`git status` shows no uncommitted changes).
- [ ] You are on the release branch and it is up to date with `origin`.
- [ ] `package.json` `version` is bumped following [SemVer](https://semver.org/)
      (`patch` for fixes, `minor` for features, `major` for breaking changes).
- [ ] `AMegMen.version` (in `src/ts/amegmen.ts`, injected as `__AMEGMEN_VERSION__`)
      resolves to the same value — it is sourced from `package.json` at build time.
- [ ] The version comment in the built CSS header matches the new version.
- [ ] `CHANGELOG`/release notes updated (if maintained).

## 2. Quality gates

- [ ] `npm run format:check` — all files Prettier-formatted.
- [ ] `npm run lint` — ESLint + Stylelint pass (no errors).
- [ ] `npm run typecheck` — `tsc --noEmit` passes.
- [ ] `npm run test` — full Vitest suite passes.
- [ ] `npm run test:coverage` — coverage has not regressed.

## 3. Build the distributables

- [ ] `npm run build` — produces ESM, CJS, UMD, CDN bundles + minified copies,
      CSS (unminified + map + minified), and `dist/index.d.ts`.
- [ ] Confirm `dist/` layout:
  - [ ] `dist/scripts/` — all `.js` files; `.js.map` source maps for the
        un-minified files **only**.
  - [ ] `dist/styles/` — `amegmen.css`, `amegmen.css.map`, `amegmen.min.css`.
  - [ ] `dist/index.d.ts` — the **only** `.ts` file in `dist/`.
- [ ] No source maps shipped for minified files.

## 4. Verify package metadata

- [ ] `name` is `amegmen` and is available / owned by you on npm
      (`npm view amegmen` to check).
- [ ] `license` is correct (`Apache-2.0`).
- [ ] `type`, `main`, `module`, `types`, and `exports` map to files that exist
      in `dist/`.
- [ ] `sideEffects: false` is present (enables tree-shaking for consumers).
- [ ] `files` includes `dist` (and nothing unnecessary).

## 5. Dry-run the publish

- [ ] `npm pack --dry-run` — review the exact file list that will ship.
- [ ] Confirm only `dist/` (and auto-included `package.json`, `README.md`,
      `LICENSE`) are in the tarball — no `src/`, `tests/`, `demos/`, or config.
- [ ] Tarball size is reasonable (no stray `node_modules` or coverage output).

## 6. Authenticate & publish

- [ ] `npm whoami` — confirm you are logged in as the right account.
- [ ] 2FA enabled on the npm account (recommended for public packages).
- [ ] First-ever publish: `npm publish --access public`.
- [ ] Subsequent publishes: `npm publish` (tag with `--tag next` for pre-releases).

## 7. Post-publish verification

- [ ] `npm view amegmen version` reports the new version.
- [ ] Install into a scratch project: `npm install amegmen` and import both the
      ESM build and the CSS to confirm they resolve.
- [ ] Tag the release in git: `git tag v<version> && git push --tags`.
- [ ] Create a GitHub Release for the tag (optional but recommended — drives the
      jsDelivr/Skypack mirrors, see `cdn-publish-checklist.md`).
