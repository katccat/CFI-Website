/// <reference path="../.astro/types.d.ts" />

// Virtual module provided by vite-plugins/image-dimensions.js: a map of public
// image URL -> intrinsic size, used by <Img> to reserve space at build time.
declare module 'virtual:image-dimensions' {
  const dimensions: Record<string, { width: number; height: number }>
  export default dimensions
}
