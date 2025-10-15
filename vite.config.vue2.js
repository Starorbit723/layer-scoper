import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  root: 'src/pages/vue2',
  plugins: [vue()],
  server: {
    port: 5174,
    open: '/index.html'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      '@': '/src',
      '@components': '/src/components'
    }
  }
});


