import { useEffect, useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'
import { masterTimeline } from './MasterTimeline'
import { CAMERA_PATH } from './CameraManager'

const DEG = Math.PI / 180
/** Horizontal FOV the scenes are framed for (landscape). */
const TARGET_HFOV = 78 * DEG
const MIN_VFOV = 45
const MAX_VFOV = 82

/**
 * Keeps scene framing usable on any aspect ratio (portrait phones included) by
 * deriving the camera's vertical FOV from the viewport so the intended
 * *horizontal* field of view is preserved (clamped to avoid distortion).
 */
export function ResponsiveCamera() {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    const aspect = size.width / Math.max(1, size.height)
    const vFovRad = 2 * Math.atan(Math.tan(TARGET_HFOV / 2) / Math.max(0.0001, aspect))
    const vFovDeg = Math.min(MAX_VFOV, Math.max(MIN_VFOV, vFovRad / DEG))
    camera.fov = vFovDeg
    camera.updateProjectionMatrix()
  }, [camera, size])

  return null
}

/**
 * Drives the real R3F camera from the GSAP master timeline.
 *
 * Registers the whole camera choreography (CAMERA_PATH) as tweens on the
 * master timeline once, on mount. The camera lives outside the scenes (part of
 * the Canvas), so it persists across scene swaps while GSAP owns its motion —
 * exactly as the Cinematic Spec requires.
 */
export function CameraRig() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    const first = CAMERA_PATH[0]
    const look = { x: first.lookAt[0], y: first.lookAt[1], z: first.lookAt[2] }

    camera.position.set(first.position[0], first.position[1], first.position[2])
    camera.lookAt(look.x, look.y, look.z)

    const dispose = masterTimeline.attach((tl) => {
      for (let i = 1; i < CAMERA_PATH.length; i++) {
        const prev = CAMERA_PATH[i - 1]
        const kf = CAMERA_PATH[i]
        const duration = kf.time - prev.time

        // Position tween keeps the camera looking at the (also animated) target.
        tl.to(
          camera.position,
          {
            x: kf.position[0],
            y: kf.position[1],
            z: kf.position[2],
            duration,
            ease: 'power2.inOut',
            onUpdate: () => camera.lookAt(look.x, look.y, look.z),
          },
          prev.time,
        )

        // Look-at target tween (runs in parallel at the same position).
        tl.to(
          look,
          {
            x: kf.lookAt[0],
            y: kf.lookAt[1],
            z: kf.lookAt[2],
            duration,
            ease: 'power2.inOut',
          },
          prev.time,
        )
      }
    })

    return dispose
  }, [camera])

  return null
}
