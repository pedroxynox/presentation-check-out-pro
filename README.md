# Check-Out Pro · Web Experience

An interactive **120-second** web experience built with a high-performance
stack: **Vite + React + TypeScript** with **WebGL/Three.js** for 3D,
**GSAP** for cinematic choreography, **Framer Motion** for UI, **cannon-es**
physics for the schedule-block sequence, and **Howler** for audio.

## Tech stack

| Concern      | Library                                                     |
| ------------ | ----------------------------------------------------------- |
| Build/Dev    | Vite, TypeScript                                            |
| 3D & Render  | `three`, `@react-three/fiber`, `@react-three/drei`          |
| Animation    | `gsap` (cinematic timeline), `framer-motion` (UI)           |
| Physics      | `cannon-es`, `@react-three/cannon`                          |
| Audio        | `howler`                                                    |
| Styles       | `tailwindcss`, `postcss`, `autoprefixer`                    |

## Architecture (feature-based)

```
src/
├── components/
│   ├── core/          # GSAP master timeline + Howler audio logic
│   │   ├── TimelineController.tsx
│   │   ├── AudioManager.ts
│   │   └── experience.config.ts
│   └── scenes/        # Narrative scenes rendered inside the <Canvas>
│       ├── Supermarket.tsx
│       ├── DataWorld.tsx     # cannon-es physics (schedule blocks)
│       └── FinalOutro.tsx
├── hooks/             # Timeline & audio state hooks
│   ├── useTimeline.ts
│   └── useAudio.ts
└── assets/            # Reserved for 3D models and audio
    ├── models/
    └── audio/
```

The whole narrative runs off a **single GSAP master timeline** (120s). Scenes
mount/unmount based on the current timeline phase (see
`src/components/core/experience.config.ts`).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
npm run lint     # oxlint
```
