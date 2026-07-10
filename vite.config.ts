import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Relative base so the build works when served from a GitHub Pages subpath
// (e.g. https://<user>.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
