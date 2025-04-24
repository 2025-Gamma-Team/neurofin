import { defineConfig } from "vite";
import { default as react } from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
});
