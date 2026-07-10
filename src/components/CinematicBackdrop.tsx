import { AnimatePresence, motion } from 'framer-motion'
import { useScene } from '../hooks'
import { SCENE_CONTENT } from './scenes/sceneContent'

/**
 * Full-bleed cinematic backdrop layer (DOM), rendered UNDER the transparent
 * R3F canvas. Each scene shows a photographic image (when provided) or a
 * premium gradient, with a slow Ken Burns move, color grading and a vignette —
 * the "photographic texture" look. Scenes cross-fade on phase change.
 */
export function CinematicBackdrop() {
  const { phase, progress } = useScene()
  const content = SCENE_CONTENT[phase]

  // Ken Burns: slow zoom + subtle pan driven by the master clock.
  const scale = 1.08 + progress * 0.12
  const panX = (progress - 0.5) * 4

  const layer = content.image
    ? { backgroundImage: `url(${content.image})` }
    : { backgroundImage: content.gradient }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Image / gradient with Ken Burns */}
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ ...layer, transform: `scale(${scale}) translateX(${panX}%)` }}
          />
          {/* Color grade */}
          <div className="absolute inset-0" style={{ backgroundImage: content.grade }} />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{ boxShadow: 'inset 0 0 220px 70px rgba(0,0,0,0.75)' }}
          />
          {/* Caption */}
          {content.caption && (
            <div className="absolute inset-x-0 bottom-[24%] flex justify-center px-6">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
                className="font-display text-2xl font-bold uppercase tracking-[0.28em] text-white/90 sm:text-4xl"
                style={{ textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
              >
                {content.caption}
              </motion.span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
