import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // --------------------------------------------------
  // Global ignores
  // --------------------------------------------------
  globalIgnores(["dist", "node_modules", "coverage"]),

  // ==================================================
  // Base application rules
  // ==================================================
  {
    files: ["**/*.{ts,tsx}"],

    // --------------------------------------------------
    // Plugins
    // --------------------------------------------------
    plugins: {
      boundaries,
      import: importPlugin,
      "@tanstack/query": pluginQuery,
    },

    // --------------------------------------------------
    // Base configs
    // --------------------------------------------------
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    // --------------------------------------------------
    // Language options
    // --------------------------------------------------
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },

    // --------------------------------------------------
    // Architecture element definitions
    // --------------------------------------------------
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "pages", pattern: "src/pages/**" },
        { type: "features", pattern: "src/features/*/**" },
        { type: "shared", pattern: "src/shared/**" },
        { type: "assets", pattern: "src/assets/**" },
        { type: "styles", pattern: "src/styles/**" },
        { type: "i18n", pattern: "src/i18n/**" },
      ],
    },

    // --------------------------------------------------
    // Rules
    // --------------------------------------------------
    rules: {
      /* ----------------------------------------
       * React safety
       * ---------------------------------------- */
      "react-hooks/exhaustive-deps": "error",

      /* ----------------------------------------
       * TanStack Query
       * ---------------------------------------- */
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/stable-query-client": "error",
      "@tanstack/query/no-void-query-fn": "error",
      "@tanstack/query/infinite-query-property-order": "error",
      "@tanstack/query/no-rest-destructuring": "warn",
      "@tanstack/query/no-unstable-deps": "warn",
      "@tanstack/query/mutation-property-order": "warn",

      /* ----------------------------------------
       * TypeScript safety
       * ---------------------------------------- */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      /* ----------------------------------------
       * Clean code
       * ---------------------------------------- */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-param-reassign": "error",

      /* ----------------------------------------
       * Import hygiene
       * ---------------------------------------- */
      "import/no-cycle": "error",

      /* ----------------------------------------
       * Architecture enforcement
       * ---------------------------------------- */
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["shared", "features"] },
            { from: "pages", allow: ["features", "shared"] },
            { from: "features", allow: ["features", "shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],

      /* ----------------------------------------
       * Forbidden imports
       * ---------------------------------------- */
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/*",
                "@/features/*/*/*",
                "@/features/*/*/*/*",
              ],
              message:
                "Deep imports into features are forbidden. Import from the feature index only.",
            },
            {
              group: [
                "@/features/third-party-ui",
                "@/features/third-party-ui/**",
              ],
              message:
                "Third-party UI infrastructure and examples must live in shared/** or docs/, not features/**.",
            },
            {
              group: [
                "@/components",
                "@/hooks",
                "@/services",
                "@/contexts",
                "@/schemas",
                "@/stores",
                "@/utils",
                "@/lib",
              ],
              message:
                "Forbidden root-level folder. Use feature-first architecture.",
            },
          ],
        },
      ],
    },
  },

  // --------------------------------------------------
  // React Compiler: allow TanStack Table wrapper
  // --------------------------------------------------
  {
    files: ["src/shared/ui/data-table/DataTable.tsx"],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },

  // --------------------------------------------------
  // Generated shadcn registry files can export helpers
  // --------------------------------------------------
  {
    files: ["src/shared/ui/shadcn/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // ==================================================
  // 🔒 Notification Architecture Enforcement
  // ==================================================
  {
    files: [
      "**/*loader*.{ts,tsx}",
      "**/*middleware*.{ts,tsx}",
      "**/*.query.{ts,tsx}",
      "src/shared/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-hot-toast",
              message:
                "Notifications are UI side-effects only. react-hot-toast is forbidden here.",
            },
            {
              name: "react-hot-toast/headless",
              message:
                "Notifications are UI side-effects only. react-hot-toast is forbidden here.",
            },
          ],
        },
      ],
    },
  },

  // ==================================================
  // 🧪 Test placement enforcement (no __tests__ folders)
  // ==================================================
  {
    files: ["**/__tests__/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "Do not use __tests__ directories. Colocate tests next to the source files they verify.",
        },
      ],
    },
  },
]);
