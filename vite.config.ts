import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// Neither API enables CORS, so in development the browser talks to the Vite
// dev server and Vite forwards /api/* to the right API (same-origin, no CORS).
const MEALPLAN_API = 'http://localhost:5290'
const INGREDIENTS_API = 'http://localhost:5280'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/mealplan': {
        target: MEALPLAN_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mealplan/, ''),
      },
      '/api/ingredients': {
        target: INGREDIENTS_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ingredients/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
