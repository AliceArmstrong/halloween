import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Set VITE_BASE_PATH when deploying to a GitHub Pages project site, e.g. /vote-page/
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()]
});
