import { defineConfig } from 'vite'
import DefineOptions from 'unplugin-vue-macros/dist/vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [DefineOptions(), vue()]
})
