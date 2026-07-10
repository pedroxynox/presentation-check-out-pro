import { useCallback, useEffect, useState } from 'react'
import { audioEngine, audioManager } from '../components/core'

export interface CinematicAudioApi {
  muted: boolean
  /** True once the audio engine has been started by a user gesture. */
  ready: boolean
  toggleMute: () => void
}

/**
 * Starts the procedural audio engine on the first user gesture (required by
 * browser autoplay policies) and exposes mute control. Also mirrors mute to
 * the Howler AudioManager for any future file-based tracks.
 */
export function useCinematicAudio(): CinematicAudioApi {
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (audioEngine.isStarted) {
      setReady(true)
      return
    }
    const startOnGesture = () => {
      audioEngine.start()
      setReady(true)
    }
    window.addEventListener('pointerdown', startOnGesture, { once: true })
    window.addEventListener('keydown', startOnGesture, { once: true })
    return () => {
      window.removeEventListener('pointerdown', startOnGesture)
      window.removeEventListener('keydown', startOnGesture)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      audioEngine.setMuted(next)
      audioManager.setMuted(next)
      return next
    })
  }, [])

  return { muted, ready, toggleMute }
}
