import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/life-quest/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'LifeQuest',
        short_name: 'LifeQuest',
        description: 'Gamified habit tracker — level up your life',
        theme_color: '#4f46e5',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/life-quest/',
        icons: [
          { src: '/life-quest/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/life-quest/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
