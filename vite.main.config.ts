import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['async_hooks']
    }
  },
  define: {
    __dirname: '__dirname',
    __filename: '__filename'
  }
});
