import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@wix/')) return 'vendor-wix'
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
        },
      },
    },
  },
  server: {
    proxy: {
      '/wixapi': {
        target: 'https://www.wixapis.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wixapi/, ''),
      },
    },
  },
})
