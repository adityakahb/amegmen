// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

// Determine if sourcemaps should be generated for uncompressed files
// This env variable is set by npm scripts (e.g., in package.json)
const generateSourcemaps = process.env.GENERATE_SOURCEMAPS === 'true';
const fileName = 'amegmen';

export default [
  // ----------------------------------------------------
  // 1. TypeScript/JavaScript Bundle Configurations
  // ----------------------------------------------------
  // Uncompressed JS outputs (with optional sourcemaps)
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/${fileName}.cjs`,
        format: 'cjs',
        sourcemap: generateSourcemaps,
        exports: 'named',
      },
      { file: `dist/${fileName}.esm.js`, format: 'es', sourcemap: generateSourcemaps },
      {
        file: `dist/${fileName}.umd.js`,
        format: 'umd',
        name: 'AMegMen',
        sourcemap: generateSourcemaps,
      },
      {
        file: `dist/${fileName}.amd.js`,
        format: 'amd',
        name: 'AMegMen',
        sourcemap: generateSourcemaps,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
      }),
      nodeResolve(),
      commonjs(),
    ],
    external: [],
  },

  // Compressed JS outputs (no sourcemaps)
  {
    input: 'src/index.ts',
    output: [
      { file: `dist/${fileName}.min.cjs`, format: 'cjs', sourcemap: false, exports: 'named' },
      { file: `dist/${fileName}.esm.min.js`, format: 'es', sourcemap: false },
      {
        file: `dist/${fileName}.umd.min.js`,
        format: 'umd',
        name: 'AMegMen',
        sourcemap: false,
        globals: {},
      },
      {
        file: `dist/${fileName}.amd.min.js`,
        format: 'amd',
        name: 'AMegMen',
        sourcemap: false,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        // Important: Only generate declarations ONCE from the main uncompressed build to avoid duplicates
        // Set declaration to false for the minified bundle to avoid re-generating.
        declaration: false,
      }),
      nodeResolve(),
      commonjs(),
      terser(), // Apply terser to this entire bundle of outputs
    ],
    external: [],
  },

  // ----------------------------------------------------
  // 2. CSS/Sass Bundle Configurations
  // ----------------------------------------------------
  // Uncompressed CSS output (with optional sourcemap)
  {
    input: 'src/index.scss',
    output: {
      file: `dist/${fileName}.css`,
      format: 'es', // Format doesn't really matter for CSS output
      sourcemap: generateSourcemaps,
    },
    plugins: [
      postcss({
        extract: true,
        minimize: false, // Don't minify uncompressed output
        sourceMap: generateSourcemaps,
      }),
    ],
  },
  // Compressed CSS output (no sourcemap)
  {
    input: 'src/index.scss',
    output: {
      file: `dist/${fileName}.min.css`,
      format: 'es',
      sourcemap: false, // No sourcemap for compressed files
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true, // Minify this output
        sourceMap: false,
      }),
    ],
  },
];
