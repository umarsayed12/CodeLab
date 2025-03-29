import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
        "/api": {
          target: "https://codelab-sq6v.onrender.com", // ✅ Ensure this is correct
          changeOrigin: true,
          secure: false,
          ws:true,
          rewrite: (path) => path.replace(/^\/api/, ""), // ✅ Rewrite "/api" to "/"

    }
    }, 
  },
  plugins: [react(),tailwindcss()],
})
