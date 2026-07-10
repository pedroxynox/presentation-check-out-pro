import gsap from 'gsap'
import { EXPERIENCE_DURATION } from './experience.config'

export interface MasterTimelineHandle {
  timeline: gsap.core.Timeline
  /** Shared driver object whose `t` reflects elapsed seconds. */
  driver: { t: number }
}

export interface MasterTimelineOptions {
  onUpdate: (elapsed: number) => void
  onComplete?: () => void
}

/**
 * Creates THE single GSAP master timeline for the whole 120s experience.
 *
 * All scene tweens (camera, lighting, transitions, effects) must be attached
 * to `handle.timeline` at absolute time positions — no independent timelines.
 * The driver tween guarantees the timeline's total length equals
 * EXPERIENCE_DURATION so `elapsed`/`progress`/`phase` advance in real time.
 */
export function createMasterTimeline(options: MasterTimelineOptions): MasterTimelineHandle {
  const driver = { t: 0 }
  const timeline = gsap.timeline({
    paused: true,
    onUpdate: () => options.onUpdate(driver.t),
    onComplete: options.onComplete,
  })

  timeline.to(driver, {
    t: EXPERIENCE_DURATION,
    duration: EXPERIENCE_DURATION,
    ease: 'none',
  })

  return { timeline, driver }
}
