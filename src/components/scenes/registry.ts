import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { ScenePhase } from '../core'

/**
 * Code-split scene registry: each scene is a separate lazy chunk, loaded on
 * demand as the master timeline reaches its phase. Keeps the initial bundle
 * small and honors the progressive-loading requirement.
 */
export const SCENE_REGISTRY: Record<ScenePhase, LazyExoticComponent<ComponentType>> = {
  chaos: lazy(() => import('./Scene01Chaos')),
  freeze: lazy(() => import('./Scene02Freeze')),
  activation: lazy(() => import('./Scene03Activation')),
  dataworld: lazy(() => import('./Scene04DataWorld')),
  optimization: lazy(() => import('./Scene05Optimization')),
  return: lazy(() => import('./Scene06Return')),
  outro: lazy(() => import('./Scene07Outro')),
}
