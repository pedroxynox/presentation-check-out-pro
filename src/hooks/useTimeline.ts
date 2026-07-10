import { useContext } from 'react'
import { TimelineContext } from '../components/core'
import type { TimelineContextValue } from '../components/core'

/**
 * Access the master timeline state (elapsed, progress, phase) and controls
 * (play, pause, seek, restart). Must be used within a <TimelineProvider>.
 */
export function useTimeline(): TimelineContextValue {
  return useContext(TimelineContext)
}
