import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Proxy opcional para desenvolvimento (se necessário)
    // Descomente se tiver problemas de CORS
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:7000',
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'swiper', 'react-helmet-async']
        }
      }
    }
  },
  publicDir: 'public',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true
  }
})
