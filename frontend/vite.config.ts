import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/documents': 'http://localhost:4000',
      '/patients': 'http://localhost:4000',
      '/medications': 'http://localhost:4000',
      '/tasks': 'http://localhost:4000',
      '/checkins': 'http://localhost:4000',
      '/appointments': 'http://localhost:4000',
      '/tests': 'http://localhost:4000',
      '/audit-logs': 'http://localhost:4000',
      '/health': 'http://localhost:4000'
    }
  }
});
