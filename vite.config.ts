import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const token = env.FOOTBALL_DATA_TOKEN

  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        '/api/football-data': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/football-data/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (token) {
                proxyReq.setHeader('X-Auth-Token', token)
              }
            })
          },
        },
      },
    },
  }
})
