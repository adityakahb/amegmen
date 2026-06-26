/**
 * Vite configuration — CDN UMD bundle.
 *
 * Built from `src/ts/cdn.ts` which exposes the AMegMen class as the default
 * export. The UMD wrapper sets `window.AMegMen` to the class directly
 * (not to a named-export namespace object) via `exports: 'default'`.
 *
 * Produces:
 *   dist/scripts/amegmen.cdn.js      — self-executing UMD for <script> tags (with source map)
 *   dist/scripts/amegmen.cdn.min.js  — minified (no source map)
 *
 * Usage:
 *   <script src="amegmen.cdn.min.js"></script>
 *   <script>new AMegMen(document.querySelector('nav'));</script>
 *   <script>AMegMen.autoInit('[data-amegmen]');</script>
 */

import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('./package.json') as { version: string };

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

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/ts/cdn.ts'),
      name: 'AMegMen',
      formats: ['umd'],
      fileName: () => 'scripts/amegmen.cdn.js',
    },
    rollupOptions: {
      output: {
        // Expose the default export directly so window.AMegMen is the class, not
        // an object like { default: AMegMen }
        exports: 'default',
        banner: `/*! AMegMen v${version} CDN build — <script src="amegmen.cdn.js"> → window.AMegMen | Apache-2.0 */`,
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
  },
  define: {
    __AMEGMEN_VERSION__: JSON.stringify(version),
  },
  plugins: [emitMinified],
});
