import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        locations: resolve(__dirname, 'locations/index.html'),
        advertisingSolutions: resolve(__dirname, 'advertising-solutions/index.html'),
        advertisingDigitalLed: resolve(__dirname, 'advertising-solutions/digital-led-billboards/index.html'),
        advertisingStatic: resolve(__dirname, 'advertising-solutions/static-billboards/index.html'),
        advertisingTransit: resolve(__dirname, 'advertising-solutions/transit-advertising/index.html'),
        advertisingBuildingWraps: resolve(__dirname, 'advertising-solutions/building-wraps/index.html'),
        advertisingPoleBanners: resolve(__dirname, 'advertising-solutions/pole-banners/index.html'),
        advertisingMall: resolve(__dirname, 'advertising-solutions/mall-advertising/index.html'),
        advertisingCustom: resolve(__dirname, 'advertising-solutions/custom-advertising/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/lenis')) {
            return 'vendor-lenis';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});

