import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/llm/groq": {
        target: "https://api.groq.com",
        changeOrigin: true,
        rewrite: () => "/openai/v1/chat/completions",
      },
    },
  },
})
