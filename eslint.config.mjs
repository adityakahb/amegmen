/**
 * ESLint flat config for AMegMen.
 *
 * Covers all TypeScript source files in src/ and tests/.
 * Uses @typescript-eslint/recommended with strict type-checking rules
 * and prettier integration to avoid formatting conflicts.
 *
 * `tsconfig.eslint.json` extends the main tsconfig and adds tests/ and
 * src/connectors/ so the project service can type-check all linted files.
 */

import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tsEslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript strict + stylistic rules
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  // Prettier must come last — disables all formatting rules
  prettierConfig,

  {
    // Apply TS rules only to TypeScript files
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow explicit `any` with a warning rather than hard error
      "@typescript-eslint/no-explicit-any": "warn",

      // Non-null assertions are acceptable in test files; source should avoid them
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Unused vars/imports are errors
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Prefer const assertions and readonly where appropriate
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-readonly": "error",

      // Consistent array type style
      "@typescript-eslint/array-type": ["error", { default: "array" }],

      // Allow void returns in callbacks
      "@typescript-eslint/no-confusing-void-expression": "off",

      // Constructor return guard (double-init pattern) — disabled globally
      "no-constructor-return": "off",
      "@typescript-eslint/no-this-alias": "off",

      // Allow numbers and booleans in template literals (common in CSS string building)
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: false },
      ],
    },
  },

  {
    // Relaxed rules for test files
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },

  {
    // Ignore generated/vendor directories and config files
    ignores: [
      "dist/**",
      "coverage/**",
      "docs/**",
      "demos/**",
      "node_modules/**",
      "*.config.ts",
      "*.config.mjs",
      "scripts/**",
    ],
  }
);
