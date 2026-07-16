import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/resume_analyser/",
  plugins: [react()],
})