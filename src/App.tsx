import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { AnimatePresence, motion } from 'framer-motion'
import { TimelineProvider, CameraRig, paletteForPhase } from './components/core'
import { SCENE_REGISTRY } from './components/scenes/registry'
import { SceneBloom } from './components/effects'
import { useScene, useTimeline, useCinematicAudio } from './hooks'
import { clamp, mapRange } from './utils'

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
      <OptimizationStats />
      <OutroOverlay />
      <Hud />
    </div>
  )
}

/** Framer Motion outro tagline (white content), revealed as the logo locks in. */
function OutroOverlay() {
  const { elapsed } = useTimeline()
  const active = elapsed >= 117.8

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="outro-tagline"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-x-0 bottom-[16%] flex flex-col items-center text-center"
        >
          <p
            className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-white sm:text-4xl"
            style={{ textShadow: '0 0 34px rgba(255,255,255,0.55)' }}
          >
            Gestión Inteligente
          </p>
          <p className="mt-3 font-sans text-sm text-blue-100/80 sm:text-lg">
            Transformando operaciones en resultados
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Framer Motion metrics that count up during the Optimization scene. */
function OptimizationStats() {
  const { elapsed } = useTimeline()
  const active = elapsed >= 86 && elapsed < 106
  const p = clamp(mapRange(elapsed, 88, 100, 0, 1), 0, 1)

  const stats = [
    { label: 'Eficiencia', sign: '+', value: Math.round(p * 48) },
    { label: 'Tiempos de espera', sign: '−', value: Math.round(p * 72) },
    { label: 'Ventas', sign: '+', value: Math.round(p * 35) },
  ]

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="opt-stats"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-x-0 top-10 flex justify-center gap-4 px-6"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="min-w-[8rem] rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-center backdrop-blur-sm"
            >
              <div
                className="font-display text-3xl font-bold text-emerald-400 sm:text-4xl"
                style={{ textShadow: '0 0 24px rgba(34,197,94,0.7)' }}
              >
                {s.sign}
                {s.value}%
              </div>
              <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-white/70">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
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
  const { muted, ready, toggleMute } = useCinematicAudio()

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
          {muted ? 'Activar sonido' : 'Silenciar'}
        </button>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-neon">
          {segment.id}. {segment.label} · {elapsed.toFixed(1)}s / 120s
        </span>
        {!ready && (
          <span className="animate-pulse font-mono text-xs text-white/60">
            toca para activar el sonido
          </span>
        )}
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
