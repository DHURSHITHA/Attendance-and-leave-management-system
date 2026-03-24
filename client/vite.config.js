import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  envDir: "..",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [react()],
});

