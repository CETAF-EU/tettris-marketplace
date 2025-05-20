import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      api: '/src/api',
      app: '/src/app',
      components: '/src/components',
      "redux-store": '/src/redux-store',
      sources: '/src/sources',
      tests: '/src/tests',
      webroot: '/src/webroot'
    }
  },
  build: {
    outDir: './build',
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
      provider: "v8"
    }
  },
  server:  (process.env.VITE_PROXY ?? 'true') === 'true' ? {
    proxy: {
      '/cordra/doip': {
        target: 'https://marketplace.cetaf.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cordra\/doip/, '/cordra/doip'),
      }
    }
  } : undefined
});