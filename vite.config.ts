import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
