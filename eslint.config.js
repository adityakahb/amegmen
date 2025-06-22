// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const thisConfig = [
  // Global ignores for the entire project
  {
    ignores: [
      'blocks/**',
      'coverage/**',
      'plugins/**',
      'scripts/**',
      'tools/**',
      'gulpfile.cjs',
      'gulp-tasks/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  // Main configuration for all TypeScript and JavaScript files
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        // Important: If you use type-aware rules (e.g., from @typescript-eslint/recommended-type-checked),
        // you MUST uncomment the 'project' line below and point it to your tsconfig.json.
        // project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // ESLint's recommended rules
      ...tseslint.configs.recommended.rules, // TypeScript ESLint plugin's recommended rules
      ...prettierPlugin.configs.recommended.rules, // Runs Prettier as an ESLint rule
      ...prettierConfig.rules, // Disables ESLint rules that conflict with Prettier

      // Custom rules (from your original .eslintrc.json)
      curly: 'error',
      eqeqeq: 'error',
      'no-console': 'off',
      'no-param-reassign': [0, { props: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  // Override for test files
  {
    files: ['src/**/*.test.js', 'src/**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.jest, // Adds Jest test globals
      },
    },
    rules: {
      // Add specific rules for tests if needed
    },
  },
];

export default thisConfig;
