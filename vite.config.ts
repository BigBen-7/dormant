import { defineConfig, build } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

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
    {
      name: 'copy-extension-assets',
      apply: 'build',
      closeBundle() {
        // Copy manifest.json to dist/
        fs.copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        )

        // Copy icons/ to dist/icons/
        const iconsDir = resolve(__dirname, 'icons')
        const distIconsDir = resolve(__dirname, 'dist/icons')
        if (fs.existsSync(iconsDir)) {
          fs.mkdirSync(distIconsDir, { recursive: true })
          for (const file of fs.readdirSync(iconsDir)) {
            fs.copyFileSync(
              resolve(iconsDir, file),
              resolve(distIconsDir, file)
            )
          }
        }
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
