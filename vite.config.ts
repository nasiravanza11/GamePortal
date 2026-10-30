import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        games: resolve(rootDir, 'games/index.html'),
        about: resolve(rootDir, 'about/index.html'),
        contact: resolve(rootDir, 'contact/index.html'),
      },
    },
  },
})
