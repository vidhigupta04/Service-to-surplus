import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true, // ✅ This allows access from other devices on network
        proxy: {
            '/api': {
                target: ['http://localhost:5000', 'http://127.0.0.1:5000'],
                changeOrigin: true,
                secure: false,
            }
        }
    }
})