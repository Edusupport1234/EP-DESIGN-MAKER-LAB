
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite does not provide process.env by default, so we define it here
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
