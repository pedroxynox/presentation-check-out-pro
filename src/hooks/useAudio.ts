import { useCallback, useState } from 'react'
import { audioManager } from '../components/core'
import type { TrackConfig } from '../components/core'

export interface UseAudioApi {
  muted: boolean
  register: (config: TrackConfig) => void
  play: (id: string) => void
  stop: (id: string) => void
  fade: (id: string, from: number, to: number, durationMs: number) => void
  toggleMute: () => void
}

/**
 * Thin React wrapper over the shared AudioManager singleton. Keeps a local
 * `muted` flag in sync so UI (e.g. a mute button) can re-render on change.
 */
export function useAudio(): UseAudioApi {
  const [muted, setMuted] = useState(audioManager.isMuted())

  const register = useCallback((config: TrackConfig) => audioManager.register(config), [])
  const play = useCallback((id: string) => audioManager.play(id), [])
  const stop = useCallback((id: string) => audioManager.stop(id), [])
  const fade = useCallback(
    (id: string, from: number, to: number, durationMs: number) =>
      audioManager.fade(id, from, to, durationMs),
    [],
  )
  const toggleMute = useCallback(() => {
    const next = !audioManager.isMuted()
    audioManager.setMuted(next)
    setMuted(next)
  }, [])

  return { muted, register, play, stop, fade, toggleMute }
}
