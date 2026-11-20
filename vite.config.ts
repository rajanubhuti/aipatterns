import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// "base" is the folder GitHub Pages serves the site from
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/aipatterns/',
})
