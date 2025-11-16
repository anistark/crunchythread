import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      apply: 'build',
      async generateBundle() {
        mkdirSync('./dist', { recursive: true });
        mkdirSync('./dist/icons', { recursive: true });
        mkdirSync('./dist/config', { recursive: true });
        copyFileSync('./public/manifest.json', './dist/manifest.json');
        copyFileSync('./public/popup.html', './dist/popup.html');

        // Copy all icon files
        const iconFiles = readdirSync('./public/icons');
        iconFiles.forEach((file) => {
          const filePath = `./public/icons/${file}`;
          if (statSync(filePath).isFile()) {
            copyFileSync(filePath, `./dist/icons/${file}`);
          }
        });

        // Copy anime mappings YAML for reference/documentation
        copyFileSync('./data/ANIMESUBREDDITS.yaml', './dist/config/ANIMESUBREDDITS.yaml');
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/main.tsx'),
        content: path.resolve(__dirname, 'src/content/content.ts'),
        background: path.resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: [
        {
          dir: 'dist',
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
        },
      ],
    },
  },
  server: {
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
