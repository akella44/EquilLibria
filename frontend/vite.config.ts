import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@app": resolve(__dirname, "src/app"),
      "@layouts": resolve(__dirname, "src/layouts"),
      "@modules": resolve(__dirname, "src/modules"),
      "@pages": resolve(__dirname, "src/pages"),
      "@router": resolve(__dirname, "src/router"),
      "@store": resolve(__dirname, "src/store"),
      "@shared": resolve(__dirname, "src/shared"),
      "@styles": resolve(__dirname, "src/styles"),
      "@hooks": resolve(__dirname, "src/shared/hooks"),
      "@components": resolve(__dirname, "src/shared/components"),
      "@assets": resolve(__dirname, "src/shared/assets"),
      "@api": resolve(__dirname, "src/shared/api"),
      "@ui": resolve(__dirname, "src/shared/ui"),
    },
  },
  esbuild: {
    target: "esnext",
  },
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    strictPort: true,
    port: 5173,
  },
});
