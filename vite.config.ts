import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Github Pagesのリポジトリサブディレクトリに対応するため相対パスを指定
  build: {
    outDir: 'dist',
  }
});