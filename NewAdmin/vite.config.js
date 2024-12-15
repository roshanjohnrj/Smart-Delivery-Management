import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
  proxy:{
    '/api':'https://smart-delivery-management-backend-2y57.onrender.com'
  }
  },
  plugins: [react()],
})
