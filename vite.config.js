import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    // inline only tiny assets; keep images as separate cacheable files
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // keep the big libraries in their own long-cached files
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/three/")) return "three";
          if (id.includes("/gsap/")) return "gsap";
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
            return "react";
          return undefined;
        },
      },
    },
  },
});
