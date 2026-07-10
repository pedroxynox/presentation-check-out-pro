import gsap from 'gsap'
import { EXPERIENCE_DURATION } from './experience.config'

export type TimeListener = (elapsed: number) => void

/**
 * THE single source of truth for the whole 120s experience: one GSAP timeline
 * whose playhead every scene, the camera, lighting and effects hang off.
 *
 * Exposed as a module singleton so code both INSIDE and OUTSIDE the R3F
 * <Canvas> can attach tweens and read time — without ever creating an
 * independent timeline (hard requirement of the Cinematic Spec).
 */
class MasterTimelineController {
  readonly timeline: gsap.core.Timeline
  private readonly driver = { t: 0 }
  private readonly listeners = new Set<TimeListener>()

  constructor() {
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => this.emit(),
      onComplete: () => this.emit(),
    })

    // Driver tween guarantees the master length is exactly 120s so every
    // scene tween can be positioned by absolute time.
    this.timeline.to(
      this.driver,
      { t: EXPERIENCE_DURATION, duration: EXPERIENCE_DURATION, ease: 'none' },
      0,
    )
  }

  /** Current elapsed time in seconds. */
  get elapsed(): number {
    return this.driver.t
  }

  /** Normalized progress [0,1]. */
  get progress(): number {
    return EXPERIENCE_DURATION > 0 ? this.driver.t / EXPERIENCE_DURATION : 0
  }

  get isPlaying(): boolean {
    return this.timeline.isActive()
  }

  play(): void {
    this.timeline.play()
  }

  pause(): void {
    this.timeline.pause()
  }

  seek(seconds: number): void {
    this.timeline.seek(seconds)
    this.emit()
  }

  restart(): void {
    this.timeline.restart()
  }

  /**
   * Attach choreography to the master timeline. The builder receives the
   * master timeline; position tweens by absolute time (seconds) via the 3rd
   * arg of `tl.to()`. Returns a disposer that reverts everything the builder
   * created, so components can clean up on unmount.
   */
  attach(builder: (tl: gsap.core.Timeline) => void): () => void {
    const ctx = gsap.context(() => builder(this.timeline))
    return () => {
      ctx.revert()
    }
  }

  /** Subscribe to time updates. Returns an unsubscribe function. */
  subscribe(listener: TimeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    for (const listener of this.listeners) listener(this.driver.t)
  }
}

/** The one and only master timeline for the experience. */
export const masterTimeline = new MasterTimelineController()
