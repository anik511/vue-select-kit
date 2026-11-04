import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({ processor: 'vue', entryRoot: 'src', outDirs: 'dist/types', include: ['src'], tsconfigPath: './tsconfig.json' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueSelectKit',
      fileName: (format) => (format === 'es' ? 'vue-select-kit.mjs' : 'vue-select-kit.umd.cjs'),
      formats: ['es', 'umd'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' }, exports: 'named' },
    },
  },
})
