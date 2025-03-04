import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    https: true, // Enables HTTPS for local testing
  },
  plugins: [
    react(),
    mkcert(), // Fix: Move mkcert() out of VitePWA
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Enables PWA in dev mode
      },
      manifest: {
        name: "My IoT App",
        short_name: "IoT App",
        description: "An IoT web app with PWA support",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourdomain\.com\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // Cache for one day
              },
            },
          },
        ],
      },
    }),
  ],
});
