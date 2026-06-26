/**
 * Vite configuration — main library build + dev server + Vitest.
 *
 * Produces:
 *   dist/scripts/amegmen.esm.js      — ES module (tree-shakeable)
 *   dist/scripts/amegmen.esm.js.map  — source map
 *   dist/scripts/amegmen.esm.min.js  — minified (no source map)
 *   dist/scripts/amegmen.umd.js      — UMD for bundlers (window.AMegMen = { AMegMen, autoInit })
 *   dist/scripts/amegmen.umd.js.map
 *   dist/scripts/amegmen.umd.min.js
 *   dist/scripts/amegmen.cjs.js      — CommonJS
 *   dist/scripts/amegmen.cjs.js.map
 *   dist/scripts/amegmen.cjs.min.js
 *   dist/index.d.ts                  — rolled-up TypeScript declarations
 *
 * CSS is built separately via `npm run build:css` (scripts/build-css.mjs).
 *
 * Root is set to `demos/` only for the dev server (command === 'serve' and
 * mode !== 'test'). Vitest also runs with command === 'serve' but mode === 'test',
 * so the `mode !== 'test'` guard keeps Vitest looking in the project root for
 * test files rather than inside demos/.
 */

import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { createRequire } from 'node:module';
import dts from 'vite-plugin-dts';

const { version } = createRequire(import.meta.url)('./package.json') as { version: string };

/**
 * Rollup plugin that emits a `.min.js` copy of every chunk using esbuild.
 * The `/*!` banner comment is preserved via `legalComments: 'inline'`.
 * Both the main build and the CDN build use this plugin.
 */
const emitMinified: Plugin = {
  name: 'emit-minified',
  async generateBundle(_options, bundle) {
    const { transform } = await import('esbuild');
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (chunk.type !== 'chunk' || !fileName.endsWith('.js')) continue;
      const { code } = await transform(chunk.code, {
        minify: true,
        legalComments: 'inline',
      });
      this.emitFile({
        type: 'asset',
        fileName: fileName.replace(/\.js$/, '.min.js'),
        source: code,
      });
    }
  },
};

export default defineConfig(({ command, mode }) => ({
  root: command === 'serve' && mode !== 'test' ? 'demos' : '.',
  // Expose dist/ as the static public dir so demos/index.html can reference
  // built files as absolute paths (e.g. /scripts/amegmen.cdn.js).
  publicDir: command === 'serve' && mode !== 'test' ? resolve(__dirname, 'dist') : false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/ts/index.ts'),
      name: 'AMegMen',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'scripts/amegmen.esm.js';
        if (format === 'umd') return 'scripts/amegmen.umd.js';
        return 'scripts/amegmen.cjs.js';
      },
    },
    rollupOptions: {
      output: {
        banner: (chunk) => {
          const f = chunk.fileName;
          if (f.endsWith('.umd.js'))
            return `/*! AMegMen v${version} UMD library build — import { AMegMen } / window.AMegMen.AMegMen | Apache-2.0 */`;
          if (f.endsWith('.esm.js'))
            return `/*! AMegMen v${version} ESM build — import { AMegMen } from "amegmen" | Apache-2.0 */`;
          if (f.endsWith('.cjs.js'))
            return `/*! AMegMen v${version} CommonJS build — const { AMegMen } = require("amegmen") | Apache-2.0 */`;
          return `/*! AMegMen v${version} | Apache-2.0 */`;
        },
      },
    },
    // minify:false so the primary output is readable; emitMinified creates .min.js
    minify: false,
    // Source maps for un-minified files only
    sourcemap: true,
  },
  define: {
    // Injected at build time and in Vitest so AMegMen.version reflects package.json
    __AMEGMEN_VERSION__: JSON.stringify(version),
  },
  plugins: [
    dts({
      include: ['src/ts/**/*'],
      outDir: 'dist',
      rollupTypes: true,
    }),
    emitMinified,
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/ts/**/*'],
      reporter: ['text', 'html'],
    },
  },
}));
