import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  plugins: [
    svelte(),
    federation({
      name: "flow",
      filename: "remoteEntry.js",
      exposes: {
        "./mount": "./src/mount.ts",
      },
    }),
  ],
});
