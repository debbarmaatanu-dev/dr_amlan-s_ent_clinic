import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
  },
  esbuild: {
    // Only remove debugger statements, keep console logs for Vercel debugging
    drop: ['debugger'],
  },
});
