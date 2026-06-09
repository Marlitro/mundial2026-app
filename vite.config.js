import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Mundial 2026 · Guía del Fan Latino",
        short_name: "Mundial 2026",
        description: "Guía completa del Fan Latino para el FIFA World Cup 2026",
        theme_color: "#010c1f",
        background_color: "#010c1f",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "flags-cache", expiration: { maxEntries: 60, maxAgeSeconds: 86400 * 30 } }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "stadiums-cache", expiration: { maxEntries: 20, maxAgeSeconds: 86400 * 7 } }
          }
        ]
      }
    })
  ]
});
