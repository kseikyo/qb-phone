import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'html'),
  build: {
    outDir: 'dist',
    // keep the html folder structure; Vite will write to html/dist
    emptyOutDir: false,
  },
  server: {
    port: 5173,
  },
})
