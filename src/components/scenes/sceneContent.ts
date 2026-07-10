import type { ScenePhase } from '../core'

/**
 * Cinematic backdrop content per scene.
 *
 * `image` is OPTIONAL. When you have real photographic/AI-generated images,
 * drop the URL (or an imported asset path) here and it becomes the full-bleed
 * backdrop — exactly the "photographic texture" look. Until then, the premium
 * `gradient` is used as a cinematic fallback so the experience looks intentional.
 *
 * Suggested image prompts (generate in Midjourney / Flux, 16:9, cinematic):
 *  - chaos:        "busy crowded supermarket checkout, long lines, warm light, cinematic, photoreal"
 *  - freeze:       "supermarket interior frozen in time, cold blue light, cinematic, photoreal"
 *  - optimization: "aerial view modern automated logistics warehouse, clean, green tint, cinematic"
 *  - return:       "calm organized modern supermarket, bright, happy shoppers, cinematic, photoreal"
 * (activation / dataworld / outro stay as real-time WebGL neon.)
 */
export interface SceneContent {
  /** Optional full-bleed image URL/path. Falls back to `gradient` if absent. */
  image?: string
  /** Cinematic CSS gradient fallback. */
  gradient: string
  /** Semi-transparent color-grade overlay applied on top of the image. */
  grade: string
  /** Optional on-screen caption (shown on image-backdrop scenes). */
  caption?: string
}

export const SCENE_CONTENT: Record<ScenePhase, SceneContent> = {
  chaos: {
    // image: 'https://.../chaos.jpg',
    gradient: 'linear-gradient(165deg, #6b4a2f 0%, #b9793f 42%, #e9c48f 100%)',
    grade: 'linear-gradient(180deg, rgba(60,30,10,0.15) 0%, rgba(20,10,5,0.6) 100%)',
    caption: 'Operación saturada',
  },
  freeze: {
    // image: 'https://.../freeze.jpg',
    gradient: 'linear-gradient(165deg, #070d1f 0%, #17305c 55%, #2a4a72 100%)',
    grade: 'linear-gradient(180deg, rgba(15,35,80,0.35) 0%, rgba(5,10,25,0.68) 100%)',
  },
  activation: {
    gradient: 'radial-gradient(circle at 50% 45%, #0c2a7a 0%, #050816 72%)',
    grade: 'linear-gradient(180deg, rgba(5,10,30,0.2) 0%, rgba(2,4,12,0.6) 100%)',
  },
  dataworld: {
    gradient: 'radial-gradient(circle at 50% 40%, #0a2f8a 0%, #04102e 78%)',
    grade: 'linear-gradient(180deg, rgba(5,20,60,0.2) 0%, rgba(2,6,20,0.55) 100%)',
    caption: 'Data World',
  },
  optimization: {
    gradient: 'linear-gradient(165deg, #05130c 0%, #0c5a30 55%, #0a2a18 100%)',
    grade: 'linear-gradient(180deg, rgba(10,60,35,0.18) 0%, rgba(4,20,12,0.55) 100%)',
  },
  return: {
    // image: 'https://.../return.jpg',
    gradient: 'linear-gradient(165deg, #0a3a22 0%, #1aa057 55%, #d9fbe8 100%)',
    grade: 'linear-gradient(180deg, rgba(10,60,35,0.12) 0%, rgba(5,25,15,0.5) 100%)',
    caption: 'Todo bajo control',
  },
  outro: {
    gradient: 'radial-gradient(circle at 50% 45%, #16368f 0%, #0a1f6b 78%)',
    grade: 'linear-gradient(180deg, rgba(12,40,120,0.15) 0%, rgba(6,16,60,0.5) 100%)',
  },
}
