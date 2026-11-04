import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  root: 'playground',
  // GitHub Pages serves the docs from https://anik511.github.io/vue-select-kit/
  base: command === 'build' ? '/vue-select-kit/' : '/',
  plugins: [vue()],
  build: { outDir: '../docs-dist', emptyOutDir: true },
}))
