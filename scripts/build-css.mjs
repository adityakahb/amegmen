/**
 * CSS build script for AMegMen.
 *
 * Bundles src/css/index.css (which @imports all partials) into:
 *   dist/styles/amegmen.css        — unminified, with source map
 *   dist/styles/amegmen.min.css    — minified, no source map
 *
 * Uses esbuild (bundled with Vite) for CSS bundling and minification.
 * Runs as part of `npm run build:css`.
 */

import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Ensure output directory exists
mkdirSync(resolve(root, "dist/styles"), { recursive: true });

const entryPoint = resolve(root, "src/css/index.css");
const banner = `/* AMegMen — Accessible Mega Menu | Apache-2.0 | https://github.com/adityakahb/amegmen */`;

console.log("Building CSS…");

// Unminified with source map
await build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile: resolve(root, "dist/styles/amegmen.css"),
  sourcemap: true,
  minify: false,
  banner: { css: banner },
  logLevel: "info",
});

// Minified without source map
await build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile: resolve(root, "dist/styles/amegmen.min.css"),
  sourcemap: false,
  minify: true,
  banner: { css: banner },
  logLevel: "info",
});

console.log("CSS build complete.");
