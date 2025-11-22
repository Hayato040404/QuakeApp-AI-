import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'service-worker.js',
          dest: '.'
        },
        {
          src: '*.png', // Copy icon files if they exist
          dest: '.'
        }
      ]
    })
  ],
  base: './', // Github Pagesのリポジトリサブディレクトリに対応するため相対パスを指定
  build: {
    outDir: 'dist',
  }
});