import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

const generatedPaths = [
  ".agents/**",
  ".vite-hooks/_/**",
  "dist/**",
  "test-results/**",
  "playwright-report/**",
  "public/mockServiceWorker.js",
  "src/app/routeTree.gen.ts",
  "src/shared/api/generated/**",
];

export default defineConfig({
  fmt: { ignorePatterns: generatedPaths },
  lint: {
    ignorePatterns: generatedPaths,
    plugins: ["react", "typescript", "oxc", "jsx-a11y"],
    rules: {
      "react/exhaustive-deps": "error",
      "react/rules-of-hooks": "error",
      "react/error-boundaries": "error",
      "react/immutability": "error",
      "react/purity": "error",
      "react/set-state-in-effect": "error",
      "react/set-state-in-render": "error",
      "react/static-components": "error",
      "react/unsupported-syntax": "error",
      "react/use-memo": "error",
      "react/void-use-memo": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { reportUnusedDisableDirectives: "error", typeAware: true, typeCheck: true },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
  },
  staged: {
    "*.{js,jsx,ts,tsx,json,css,md}": "vp fmt --check",
    "*.{js,jsx,ts,tsx}": "vp lint",
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(() => [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ]),
});
