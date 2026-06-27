import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import imageDimensions from './vite-plugins/image-dimensions.js'

// Static multi-page site. Each file in src/pages is its own URL; build.format
// 'directory' keeps the existing trailing-slash URLs (/about/, /contact/, ...).
// React is used only for the interactive nav island; everything else is static.
// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: { format: 'directory' },
  integrations: [react()],
  vite: {
    // Exposes virtual:image-dimensions, the build-time map of public image
    // sizes that <Img> reads to reserve space and prevent layout shift.
    plugins: [imageDimensions()],
  },
})
