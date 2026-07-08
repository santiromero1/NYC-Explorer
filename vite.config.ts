import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'NY Explorer',
        short_name: 'NY Explorer',
        description: 'El mapa del viaje a Nueva York: itinerario, barrios, grid y subway.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#e9edf0',
        theme_color: '#ffffff',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            // Tiles y estilo del basemap CARTO
            urlPattern: /^https:\/\/(basemaps|tiles\.basemaps|[abcd]\.basemaps)\.cartocdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 600, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // Fotos de las paradas (no van al precache: se cachean al verlas)
            urlPattern: /\/photos\/.*\.jpg$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'place-photos',
              expiration: { maxEntries: 80, maxAgeSeconds: 90 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 900,
  },
});
