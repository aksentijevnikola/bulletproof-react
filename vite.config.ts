import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import {
  assertValidApiBaseUrl,
  parseBooleanEnv,
  parseIntegerEnv,
} from "./config/parsers";

const DEPLOY_ENVS = new Set(["staging", "preprod", "production"]);

export default defineConfig(({ mode, command }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const readEnv = (key: string) => fileEnv[key] ?? process.env[key];

  const deployModeRaw = readEnv("DEPLOY_ENV");
  const deployMode = deployModeRaw?.trim().toLowerCase();

  if (deployMode && !DEPLOY_ENVS.has(deployMode)) {
    throw new Error(
      `Invalid DEPLOY_ENV: expected staging, preprod or production, received "${deployModeRaw}"`,
    );
  }

  const isBuild = command === "build";
  const isProductionMode = mode === "production";
  const isDeployBuild = isBuild && Boolean(deployMode);
  const isReleaseBuild = isBuild && (isProductionMode || isDeployBuild);

  const apiBaseUrl = readEnv("VITE_API_BASE_URL");
  const countriesApiBaseUrl = readEnv("VITE_COUNTRIES_API_BASE_URL");
  assertValidApiBaseUrl(apiBaseUrl, "VITE_API_BASE_URL");
  assertValidApiBaseUrl(countriesApiBaseUrl, "VITE_COUNTRIES_API_BASE_URL");

  const hostAll = parseBooleanEnv(readEnv("DEV_SERVER_HOST_ALL")) ?? false;
  const port =
    parseIntegerEnv(readEnv("DEV_SERVER_PORT"), "DEV_SERVER_PORT", {
      min: 1,
      max: 65535,
    }) ?? 3000;
  const openBrowser = parseBooleanEnv(readEnv("OPEN_BROWSER")) ?? true;
  const forceOptimizeDeps =
    parseBooleanEnv(readEnv("DEV_FORCE_OPTIMIZE_DEPS")) ?? false;
  const isAnalyze = parseBooleanEnv(readEnv("ANALYZE")) ?? false;

  const buildSourcemapOverride = parseBooleanEnv(readEnv("BUILD_SOURCEMAP"));
  const useHashedAssets = isReleaseBuild;
  const buildSourcemap = buildSourcemapOverride ?? !isReleaseBuild;

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
    ],

    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: buildSourcemap,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "router-vendor": ["react-router-dom"],
            "query-vendor": ["@tanstack/react-query"],
            "form-vendor": ["react-hook-form", "zod"],
            "http-vendor": ["axios"],
          },

          chunkFileNames: useHashedAssets
            ? "assets/[name]-[hash].js"
            : "assets/[name].js",

          entryFileNames: useHashedAssets
            ? "assets/[name]-[hash].js"
            : "assets/[name].js",

          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? "asset";

            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
              return "images/[name]-[hash][extname]";
            }

            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return "fonts/[name]-[hash][extname]";
            }

            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },

    server: {
      port,
      host: hostAll ? true : "127.0.0.1",
      open: openBrowser,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    preview: {
      port,
      host: hostAll ? true : "127.0.0.1",
    },

    resolve: {
      alias: {
        "@app": resolve(__dirname, "./src/app"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@features": resolve(__dirname, "./src/features"),
        "@shared": resolve(__dirname, "./src/shared"),
        "@assets": resolve(__dirname, "./src/assets"),
        "@styles": resolve(__dirname, "./src/styles"),
        "@i18n": resolve(__dirname, "./src/i18n"),
        "@": resolve(__dirname, "./src"),
      },
    },

    css: {
      devSourcemap: !isProductionMode,
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
      ],
      force: forceOptimizeDeps,
    },

    define: {
      __DEV__: mode === "development",
      __PROD__: isProductionMode,
      __ANALYZE__: isAnalyze,
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version ?? "0.0.0",
      ),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    envPrefix: ["VITE_"],
  };
});
