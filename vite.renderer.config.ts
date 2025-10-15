import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../.vite/renderer',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/renderer/index.html')
    }
  }
});
