// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss'; // For CSS processing
// import path from 'path'; // Node.js path module

const isProduction = process.env.NODE_ENV === 'production';

export default [
  // ----------------------------------------------------
  // 1. TypeScript/JavaScript Bundle Configuration
  // ----------------------------------------------------
  {
    input: 'src/amegmen.ts',
    output: [
      // CommonJS (CJS) - For Node.js environments and legacy bundlers
      {
        file: 'dist/amegmen.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'named', // Use 'named' if you have named exports (e.g., `export function createMegaMenu`)
      },
      // ES Module (ESM) - For modern browsers and bundlers (Webpack, Rollup, Parcel)
      {
        file: 'dist/amegmen.esm.js',
        format: 'es',
        sourcemap: true,
      },
      // UMD (Universal Module Definition) - For browser globals, AMD, and CommonJS environments
      {
        file: 'dist/amegmen.umd.js',
        format: 'umd',
        name: 'MegaMenuPlugin', // Global variable name when loaded via <script> tag
        sourcemap: true,
        // If you have external dependencies (e.g., jQuery), map them here:
        // globals: { 'jquery': '$' }
      },
      // AMD (Asynchronous Module Definition) - For RequireJS
      {
        file: 'dist/amegmen.amd.js',
        format: 'amd',
        name: 'MegaMenuPlugin',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        // Important: Rollup's TypeScript plugin handles declaration output
        // The `declarationDir` here tells it where to put the .d.ts files.
        declaration: true,
        declarationDir: 'dist/types',
        // `outDir` from tsconfig.json is mostly ignored by Rollup's plugin for JS output
        // as Rollup handles the final bundle location.
      }),
      nodeResolve(), // Locates modules installed in node_modules
      commonjs(), // Converts CommonJS modules to ES6, allowing them to be bundled
      isProduction && terser(), // Minify JS in production builds
    ],
    // Specify external dependencies that should not be bundled into the output files
    external: [], // e.g., ['jquery'] if jQuery is a peer dependency
  },

  // ----------------------------------------------------
  // 2. CSS/Sass Bundle Configuration
  // ----------------------------------------------------
  {
    input: 'src/amegmen.scss', // Entry point for your Sass files
    output: {
      file: 'dist/amegmen.css', // Output path and filename for the compiled CSS
      format: 'es', // Format doesn't impact CSS output directly, 'es' is a common default
    },
    plugins: [
      postcss({
        extract: true, // Crucial: Extracts CSS to a separate file (megamenu.css)
        minimize: isProduction, // Minify CSS in production builds
        sourceMap: true, // Generate source maps for CSS
        // You can add more PostCSS plugins here, e.g., autoprefixer:
        // plugins: [require('autoprefixer')],
      }),
    ],
  },
];
