/**
 * Vite configuration — GitHub Pages static site build.
 *
 * Builds the demos/ directory as a static site into docs/ for GitHub Pages.
 * Uses a relative base (`./`) so the site works at any sub-path, e.g.
 * `https://username.github.io/amegmen/`.
 *
 * Produces:
 *   docs/         — GitHub Pages root (committed to the repository)
 *   docs/.nojekyll — bypasses Jekyll processing on GitHub Pages
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, writeFileSync, mkdirSync } from 'fs';

export default defineConfig({
  root: 'demos',
  // Relative base works at any GitHub Pages sub-path
  base: './',
  // Expose dist/ so CDN bundle, CSS, and other assets are available as ./...
  publicDir: resolve(__dirname, 'dist'),
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-demo-assets',
      closeBundle() {
        const docs = resolve(__dirname, 'docs');
        mkdirSync(docs, { recursive: true });
        // Copy demo.js (not a Vite entry, so not automatically included)
        copyFileSync(resolve(__dirname, 'demos/demo.js'), `${docs}/demo.js`);
        // Write .nojekyll to prevent GitHub Pages from running Jekyll
        writeFileSync(`${docs}/.nojekyll`, '');
      },
    },
  ],
});
