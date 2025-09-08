import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // cho phép truy cập từ ngoài container
    port: 5173,        // giữ đúng port bạn đã map trong docker-compose
    strictPort: true   // nếu port bận thì báo lỗi, không tự động đổi
  }
})