import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Environment flags
const isProduction = process.env.NODE_ENV === "production";
const isAnalyze = process.env.ANALYZE === "true";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: !isProduction,
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

        chunkFileNames: isProduction
          ? "assets/[name]-[hash].js"
          : "assets/[name].js",

        entryFileNames: isProduction
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
    port: 3000,
    host: true,
    open: process.env.OPEN_BROWSER !== "false",
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
    port: 3000,
    host: true,
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
    },
  },

  css: {
    devSourcemap: !isProduction,
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "axios",
    ],
    force: !isProduction,
  },

  define: {
    __DEV__: !isProduction,
    __PROD__: isProduction,
    __ANALYZE__: isAnalyze,
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  envPrefix: ["VITE_"],
});
