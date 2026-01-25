import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.GITHUB_ACTIONS ? "/aura_react/" : "/";

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: set to '/<REPO_NAME>/' if not using custom domain
  // For custom domain or local dev, use '/'
  base,
  server: {
    port: 3015,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "script",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        clientsClaim: true,
        skipWaiting: false,
      },
      manifest: {
        name: "Aura",
        short_name: "Aura",
        description: "A local-first cycle tracking app",
        theme_color: "#0f0f23",
        background_color: "#0f0f23",
        display: "standalone",
        orientation: "portrait",
        // Use relative paths for GitHub Pages compatibility
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
