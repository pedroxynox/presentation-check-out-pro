import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import { masterTimeline } from './MasterTimeline'
import { EXPERIENCE_DURATION, segmentForTime } from './experience.config'
import type { SceneSegment } from './experience.config'

export interface TimelineContextValue {
  elapsed: number
  progress: number
  segment: SceneSegment
  isPlaying: boolean
  play: () => void
  pause: () => void
  seek: (seconds: number) => void
  restart: () => void
}

const noop = (): void => {}

export const TimelineContext = createContext<TimelineContextValue>({
  elapsed: 0,
  progress: 0,
  segment: segmentForTime(0),
  isPlaying: false,
  play: noop,
  pause: noop,
  seek: noop,
  restart: noop,
})

/**
 * React bridge to the GSAP master timeline singleton. Subscribes to time
 * updates and exposes transport controls. Does NOT own the timeline — the
 * singleton does — so components inside the Canvas share the same playhead.
 */
export function TimelineProvider({ children }: PropsWithChildren) {
  const [elapsed, setElapsed] = useState(masterTimeline.elapsed)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const unsubscribe = masterTimeline.subscribe((t) => {
      setElapsed(t)
      setIsPlaying(masterTimeline.isPlaying)
    })
    return unsubscribe
  }, [])

  const play = useCallback(() => {
    masterTimeline.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    masterTimeline.pause()
    setIsPlaying(false)
  }, [])

  const seek = useCallback((seconds: number) => {
    masterTimeline.seek(seconds)
  }, [])

  const restart = useCallback(() => {
    masterTimeline.restart()
    setIsPlaying(true)
  }, [])

  const value = useMemo<TimelineContextValue>(
    () => ({
      elapsed,
      progress: EXPERIENCE_DURATION > 0 ? elapsed / EXPERIENCE_DURATION : 0,
      segment: segmentForTime(elapsed),
      isPlaying,
      play,
      pause,
      seek,
      restart,
    }),
    [elapsed, isPlaying, play, pause, seek, restart],
  )

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}
