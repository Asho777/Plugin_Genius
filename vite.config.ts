import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/wordpress': {
        target: 'https://api.wordpress.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wordpress/, ''),
        secure: true,
      },
    },
  },
})