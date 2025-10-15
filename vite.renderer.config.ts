import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../.vite/renderer',
    rollupOptions: {
      input: 'index.html'
    }
  }
});
