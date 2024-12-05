import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'OrderEase',
        short_name: 'OE',
        icons: [
          {
            src: '/app-icon-small.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/app-icon-large.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
          },
        ],
      },
    }),
  ],
});
