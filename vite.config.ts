import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/ rather than
  // the domain root. Keep the root path for local development.
  base: process.env.GITHUB_ACTIONS ? "/-/" : "/",
  plugins: [react()],
});
