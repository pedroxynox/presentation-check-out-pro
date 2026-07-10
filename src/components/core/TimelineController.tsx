import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import { createMasterTimeline } from './MasterTimeline'
import type { MasterTimelineHandle } from './MasterTimeline'
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

/** Owns the single GSAP master timeline that drives the whole experience. */
export function TimelineProvider({ children }: PropsWithChildren) {
  const handleRef = useRef<MasterTimelineHandle | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useLayoutEffect(() => {
    const handle = createMasterTimeline({
      onUpdate: setElapsed,
      onComplete: () => setIsPlaying(false),
    })
    handleRef.current = handle
    return () => {
      handle.timeline.kill()
      handleRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    handleRef.current?.timeline.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    handleRef.current?.timeline.pause()
    setIsPlaying(false)
  }, [])

  const seek = useCallback((seconds: number) => {
    handleRef.current?.timeline.seek(seconds)
  }, [])

  const restart = useCallback(() => {
    handleRef.current?.timeline.restart()
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
