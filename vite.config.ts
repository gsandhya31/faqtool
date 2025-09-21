import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root (/) during dev / Lovable preview, but the repo path on production builds.
  // Vite sets `mode` to "production" for production builds, so:
  base: mode === "production" ? "/faqtool/" : "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // helpful for debugging production errors (optional)
  build: {
    sourcemap: true,
  },
}));
