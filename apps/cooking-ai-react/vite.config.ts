import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  root: path.resolve(__dirname), 
  base: '/', 
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@cooking-ai/react': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      'axios': path.resolve(__dirname, '../../node_modules/axios'),
      'axios/': path.resolve(__dirname, '../../node_modules/axios/'),
      'react-slick': path.resolve(__dirname, '../../node_modules/react-slick'),
      'slick-carousel': path.resolve(__dirname, '../../node_modules/slick-carousel'),
      './app/app': path.resolve(__dirname, './src/app/app.tsx'),
      './styles.css': path.resolve(__dirname, './src/styles.css'),
    },
  },
  server: {
    port: 4201,
    host: 'localhost',
    open: true
  },
  clearScreen: false,
});