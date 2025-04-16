import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    root: path.resolve(__dirname),
    base: '/recipes/',
    plugins: [
      react({ jsxRuntime: 'automatic' }),
      nxViteTsPaths(),
    ],
    resolve: {
      alias: {
        '@cooking-ai/react': path.resolve(__dirname, './src'),
        './app/app': path.resolve(__dirname, './src/app/app.tsx'),
      },
    },
    server: {
      port: 4201,
      host: 'localhost',
      open: true,
      fs: { allow: ['..'] },
      proxy: {
        '/form': 'http://localhost:4200',
        '/api': 'http://localhost:3333',
      },
    },
    build: {
      outDir: '../../dist/apps/cooking-ai-react',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: 'main.js', 
          chunkFileNames: 'chunks/[name].js',
          assetFileNames: 'assets/[name][extname]',
          format: 'iife',
          name: 'CookingAIReact',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      target: 'es2020',
      minify: isProduction,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
  };
});