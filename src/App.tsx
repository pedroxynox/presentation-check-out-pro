import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { AnimatePresence, motion } from 'framer-motion'
import { TimelineProvider, CameraRig, paletteForPhase } from './components/core'
import { SCENE_REGISTRY } from './components/scenes/registry'
import { SceneBloom } from './components/effects'
import { useScene, useTimeline, useAudio } from './hooks'

/**
 * Root of the Check-Out Pro cinematic experience.
 *
 * Architecture:
 *  - GSAP master timeline (singleton) drives all choreography (120s).
 *  - CameraRig binds the real camera to that timeline (GSAP owns the camera).
 *  - Scenes are code-split and mounted on demand by phase (Suspense + lazy).
 *  - Postprocessing adds bloom; Framer Motion drives the UI HUD.
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
  const { play } = useTimeline()
  const palette = paletteForPhase(phase)
  const ActiveScene = SCENE_REGISTRY[phase]

  // Auto-start the cinematic on load.
  useEffect(() => {
    play()
  }, [play])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3, 14], fov: 50 }}>
        <color attach="background" args={[palette.background]} />
        <fog attach="fog" args={[palette.background, 16, 48]} />
        <CameraRig />
        <Suspense fallback={null}>
          <ActiveScene />
        </Suspense>
        <EffectComposer>
          <SceneBloom />
        </EffectComposer>
      </Canvas>

      <TitleOverlay />
      <Hud />
    </div>
  )
}

/** Framer Motion hero title, revealed during the Freeze scene. */
function TitleOverlay() {
  const { elapsed } = useTimeline()
  const visible = elapsed >= 37 && elapsed < 45.5

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="brand-title"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <h1
            className="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl"
            style={{ textShadow: '0 0 40px rgba(59,130,246,0.85)' }}
          >
            CHECK-OUT PRO
          </h1>
          <p
            className="mt-3 font-display text-lg uppercase tracking-[0.4em] text-brand-neon sm:text-2xl"
            style={{ textShadow: '0 0 24px rgba(57,255,208,0.7)' }}
          >
            Gestión Inteligente
          </p>
        </motion.div>
      )}
    </AnimatePresence>
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
