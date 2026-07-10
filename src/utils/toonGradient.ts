import { DataTexture, NearestFilter, RedFormat } from 'three'

let cached: DataTexture | null = null

/**
 * A stepped grayscale gradient texture used as `gradientMap` on
 * MeshToonMaterial to get the crisp, cel-shaded "cartoon premium" look.
 * Created once and shared across all characters.
 */
export function toonGradient(): DataTexture {
  if (cached) return cached
  // 4 tone bands (shadow -> light).
  const data = new Uint8Array([70, 130, 200, 255])
  const tex = new DataTexture(data, data.length, 1, RedFormat)
  tex.minFilter = NearestFilter
  tex.magFilter = NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  cached = tex
  return tex
}
