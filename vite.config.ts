import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/](three|@react-three)[\\/]/.test(id)) return 'three'
          if (/[\\/]@supabase[\\/]/.test(id)) return 'supabase'
          if (/[\\/](leaflet|react-leaflet)[\\/]/.test(id)) return 'leaflet'
          return undefined
        },
      },
    },
  },
  server: { port: 5173, host: true },
})
