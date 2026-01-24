import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: set to '/<REPO_NAME>/' if not using custom domain
  // For custom domain or local dev, use '/'
  base: process.env.GITHUB_ACTIONS ? "/aura_react/" : "/",
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
        name: "Aura - Cycle Tracking",
        short_name: "Aura",
        description: "A local-first cycle tracking PWA",
        theme_color: "#ffffff",
        background_color: "#0f0f23",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "/icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
