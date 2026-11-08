import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   preview: {
        allowedHosts: ['task-flow-1-plbt.onrender.com']
    }
})
