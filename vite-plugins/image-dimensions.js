import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { imageSize } from 'image-size'

const VIRTUAL_ID = 'virtual:image-dimensions'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const RASTER = /\.(png|jpe?g|webp|avif|gif)$/i

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function buildManifest(publicDir) {
  const manifest = {}
  let files
  try {
    files = walk(publicDir)
  } catch {
    return manifest
  }
  for (const file of files) {
    if (!RASTER.test(file)) continue
    let dim
    try {
      dim = imageSize(readFileSync(file))
    } catch {
      continue
    }
    if (!dim?.width || !dim?.height) continue
    // Key by the public URL path (posix, leading slash), matching how
    // images are referenced in the app, e.g. "/images/foo.png".
    const url = '/' + relative(publicDir, file).split(sep).join('/')
    manifest[url] = { width: dim.width, height: dim.height }
  }
  return manifest
}

// Scans the Vite public dir for raster images and exposes their intrinsic
// dimensions as `virtual:image-dimensions`, a map of URL -> { width, height }.
// The <Img> component reads this to set width/height automatically and reserve
// space, preventing layout shift.
export default function imageDimensions() {
  let publicDir
  let manifest = {}

  return {
    name: 'image-dimensions',
    configResolved(config) {
      publicDir = config.publicDir
      manifest = buildManifest(publicDir)
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id === RESOLVED_ID) {
        return `export default ${JSON.stringify(manifest)}`
      }
    },
    configureServer(server) {
      const rebuild = (file) => {
        if (!file.startsWith(publicDir)) return
        manifest = buildManifest(publicDir)
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(publicDir)
      server.watcher.on('add', rebuild)
      server.watcher.on('change', rebuild)
      server.watcher.on('unlink', rebuild)
    },
  }
}
