import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import { TimelineProvider, paletteForPhase } from './components/core'
import { SCENE_REGISTRY } from './components/scenes/registry'
import { SceneBloom, SceneDepthOfField } from './components/effects'
import { useScene, useTimeline, useAudio } from './hooks'

/**
 * Root of the Check-Out Pro cinematic experience.
 *
 * Architecture:
 *  - GSAP master timeline (core) drives all choreography (120s).
 *  - Scenes are code-split and mounted on demand by phase (Suspense + lazy).
 *  - React Three Fiber renders 3D; postprocessing adds bloom + depth of field.
 *  - Framer Motion drives the UI HUD.
 */
function App() {
  return (
    <TimelineProvider>
      <Experience />
    </TimelineProvider>
  )
}

function Experience() {
  const { phase } = useScene()
  const palette = paletteForPhase(phase)
  const ActiveScene = SCENE_REGISTRY[phase]

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3, 14], fov: 50 }}>
        <color attach="background" args={[palette.background]} />
        <Suspense fallback={null}>
          <ActiveScene />
        </Suspense>
        <EffectComposer>
          <SceneBloom />
          <SceneDepthOfField />
        </EffectComposer>
      </Canvas>

      <Hud />
    </div>
  )
}

/** Framer Motion HUD: transport controls + timeline scrubber + mute. */
function Hud() {
  const { progress, elapsed, isPlaying, play, pause, restart } = useTimeline()
  const { segment } = useScene()
  const { muted, toggleMute } = useAudio()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6"
    >
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          type="button"
          onClick={isPlaying ? pause : play}
          className="rounded-full bg-brand-accent px-5 py-2 font-display text-sm font-medium text-white shadow-lg transition hover:opacity-90"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={restart}
          className="rounded-full border border-white/20 px-5 py-2 font-display text-sm text-white/80 transition hover:bg-white/10"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="rounded-full border border-white/20 px-4 py-2 font-display text-sm text-white/80 transition hover:bg-white/10"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-neon">
          {segment.id}. {segment.label} · {elapsed.toFixed(1)}s / 120s
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-accent transition-[width] duration-100"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </motion.div>
  )
}

export default App
