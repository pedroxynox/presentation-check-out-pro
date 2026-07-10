import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { TimelineProvider } from './components/core'
import { Supermarket, DataWorld, FinalOutro } from './components/scenes'
import { useTimeline } from './hooks'

/**
 * Root of the Check-Out Pro Web Experience.
 *
 * Architecture split:
 *  - GSAP master timeline (core) drives cinematic scene choreography.
 *  - Framer Motion drives the UI overlay (HUD).
 *  - React Three Fiber renders the 3D scenes; the active scene mounts based on
 *    the current timeline phase.
 */
function App() {
  return (
    <TimelineProvider>
      <Experience />
    </TimelineProvider>
  )
}

function Experience() {
  const { phase } = useTimeline()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-bg">
      <Canvas shadows camera={{ position: [0, 2, 9], fov: 50 }}>
        <color attach="background" args={['#050510']} />
        {phase === 'supermarket' && <Supermarket />}
        {phase === 'dataworld' && <DataWorld />}
        {phase === 'outro' && <FinalOutro />}
      </Canvas>

      <Hud />
    </div>
  )
}

/** Framer Motion HUD: transport controls + timeline progress. */
function Hud() {
  const { progress, elapsed, phase, isPlaying, play, pause, restart } = useTimeline()

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
        <span className="font-mono text-xs uppercase tracking-widest text-brand-neon">
          {phase} · {elapsed.toFixed(1)}s
        </span>
      </div>

      {/* Timeline scrubber */}
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
