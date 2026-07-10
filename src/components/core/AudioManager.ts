import { Howl, Howler } from 'howler'

export interface TrackConfig {
  /** Unique identifier used to trigger the track from the timeline/scenes. */
  id: string
  /** One or more source files (Howler picks the first playable format). */
  src: string[]
  loop?: boolean
  volume?: number
}

/**
 * Central audio controller for the experience.
 *
 * Wraps Howler so scenes and the master timeline can trigger cues by id
 * without juggling individual Howl instances. Register tracks once (e.g. on
 * boot), then play/stop/fade them from anywhere via the shared instance.
 */
export class AudioManager {
  private readonly tracks = new Map<string, Howl>()
  private muted = false

  /** Register a track. No-op if the id is already registered. */
  register(config: TrackConfig): void {
    if (this.tracks.has(config.id)) return
    this.tracks.set(
      config.id,
      new Howl({
        src: config.src,
        loop: config.loop ?? false,
        volume: config.volume ?? 1,
        preload: true,
      }),
    )
  }

  play(id: string): void {
    this.tracks.get(id)?.play()
  }

  stop(id: string): void {
    this.tracks.get(id)?.stop()
  }

  /** Fade a track's volume over the given duration (milliseconds). */
  fade(id: string, from: number, to: number, durationMs: number): void {
    this.tracks.get(id)?.fade(from, to, durationMs)
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    Howler.mute(muted)
  }

  isMuted(): boolean {
    return this.muted
  }

  /** Unload every registered track. Call on teardown. */
  dispose(): void {
    this.tracks.forEach((track) => track.unload())
    this.tracks.clear()
  }
}

/** Shared singleton used across the app. */
export const audioManager = new AudioManager()
