import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        locations: resolve(__dirname, 'locations/index.html'),
        advertisingSolutions: resolve(__dirname, 'advertising-solutions/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});

