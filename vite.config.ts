import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false,
    minify: false, // for testing purposes
    rollupOptions: {
      input: {
        content: "index.html",
        // background: "./src/browser/index.ts",
        shepherd_injection: "./src/browser/shepherd_injection.ts",
        shepherd_css: "./src/browser/shepherd_css.ts",
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/chunks/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
