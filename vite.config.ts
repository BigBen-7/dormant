import { defineConfig, build } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'build-service-worker',
      apply: 'build',
      async closeBundle() {
        await build({
          configFile: false,
          build: {
            outDir: 'dist',
            emptyOutDir: false,
            lib: {
              entry: resolve(__dirname, 'src/background/service-worker.ts'),
              formats: ['es'],
              fileName: 'service-worker',
            },
            rollupOptions: {
              output: {
                inlineDynamicImports: true,
                entryFileNames: 'src/background/[name].js',
              },
            },
          },
        })
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
