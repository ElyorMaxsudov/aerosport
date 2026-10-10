import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite configuration for Standalone AeroSport Admin Portal (Port 5174)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'admin-entry-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            req.url = '/admin.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
});
