import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import gsap from 'gsap'
import {
  EXPERIENCE_DURATION,
  phaseForTime,
} from './experience.config'
import type { ScenePhase } from './experience.config'

export interface TimelineContextValue {
  /** Elapsed time along the master timeline, in seconds. */
  elapsed: number
  /** Normalized progress in the range [0, 1]. */
  progress: number
  /** Currently active narrative phase. */
  phase: ScenePhase
  /** Whether the master timeline is currently playing. */
  isPlaying: boolean
  play: () => void
  pause: () => void
  /** Jump to a specific time (seconds) on the master timeline. */
  seek: (seconds: number) => void
  /** Restart the experience from the beginning. */
  restart: () => void
}

const noop = (): void => {}

export const TimelineContext = createContext<TimelineContextValue>({
  elapsed: 0,
  progress: 0,
  phase: 'supermarket',
  isPlaying: false,
  play: noop,
  pause: noop,
  seek: noop,
  restart: noop,
})

/**
 * Owns the single GSAP master timeline that drives the whole 120s experience.
 *
 * Scene-specific tweens should be added to `timelineRef.current` (exposed via
 * a ref API in later iterations). For now the provider maintains a driver
 * tween so `elapsed`, `progress` and `phase` advance in real time.
 */
export function TimelineProvider({ children }: PropsWithChildren) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useLayoutEffect(() => {
    const driver = { t: 0 }
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => setElapsed(driver.t),
      onComplete: () => setIsPlaying(false),
    })

    // Driver tween: gives the master timeline its 120s length so scene tweens
    // can be positioned by absolute time. Replace/extend as choreography grows.
    tl.to(driver, { t: EXPERIENCE_DURATION, duration: EXPERIENCE_DURATION, ease: 'none' })

    timelineRef.current = tl
    return () => {
      tl.kill()
      timelineRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    timelineRef.current?.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    timelineRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const seek = useCallback((seconds: number) => {
    timelineRef.current?.seek(seconds)
  }, [])

  const restart = useCallback(() => {
    timelineRef.current?.restart()
    setIsPlaying(true)
  }, [])

  const value = useMemo<TimelineContextValue>(() => {
    const progress = EXPERIENCE_DURATION > 0 ? elapsed / EXPERIENCE_DURATION : 0
    return {
      elapsed,
      progress,
      phase: phaseForTime(elapsed),
      isPlaying,
      play,
      pause,
      seek,
      restart,
    }
  }, [elapsed, isPlaying, play, pause, seek, restart])

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}
