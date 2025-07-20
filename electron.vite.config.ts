import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    publicDir: 'src/renderer/public',
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    }
  }
})
