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
    // Remove console logs in production build
    drop: ['console', 'debugger'],
  },
});
