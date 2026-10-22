import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

// index.html carries Figma placeholders that the main config fills in.
const fillHtmlPlaceholders = (): Plugin => ({
  name: 'fill-html-placeholders',
  transformIndexHtml: html => html.replace('<!-- figma:lang -->', 'en').replace('<!-- figma:title -->', 'SLM Platform'),
})

// Bundles the whole app into one self-contained HTML file for sharing as a mockup.
export default defineConfig({
  base: './',
  build: { outDir: 'dist-html', emptyOutDir: true },
  plugins: [react(), tailwindcss(), fillHtmlPlaceholders(), viteSingleFile()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
