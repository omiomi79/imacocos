import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages はリポジトリ名のサブパスで配信されるため
  base: '/imacocos/',
  plugins: [react()],
})
