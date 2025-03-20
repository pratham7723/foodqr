import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // or any port you're using
    hmr: {
      overlay: false, // Disable HMR overlay if needed
    },
  }, // Added missing closing brace
});