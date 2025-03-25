import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env file based on mode (development, production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/',
    server: {
      host: '0.0.0.0',   // 🔥 So you can access via IP or localhost
      port: 5173,
    },
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
    },
    build: {
      outDir: 'dist',
    },
  }
})

