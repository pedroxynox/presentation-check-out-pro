import { segmentForTime } from './experience.config'
import type { WorldKey } from './experience.config'
import { masterTimeline } from './MasterTimeline'

interface ChordSpec {
  freqs: number[]
  cutoff: number
  padGain: number
  noiseGain: number
}

/** Per-world harmonic beds (Hz), filter cutoff and layer levels. */
const CHORDS: Record<WorldKey, ChordSpec> = {
  real: { freqs: [98.0, 116.5, 146.8], cutoff: 700, padGain: 0.12, noiseGain: 0.05 }, // tense, low
  digital: { freqs: [130.8, 164.8, 196.0, 261.6], cutoff: 1800, padGain: 0.16, noiseGain: 0.0 },
  optimized: { freqs: [146.8, 185.0, 220.0, 293.7], cutoff: 2600, padGain: 0.2, noiseGain: 0.0 },
  brand: { freqs: [130.8, 196.0, 261.6, 392.0], cutoff: 3000, padGain: 0.18, noiseGain: 0.0 },
}

const MASTER_LEVEL = 0.85

/**
 * Procedural cinematic audio engine (Web Audio API), synced to the single GSAP
 * master timeline. Generates the whole soundtrack in-browser with zero assets:
 * evolving pad chords per scene, crowd ambience in Chaos, a rhythmic beat in
 * Data World / Optimization, a freeze whoosh and a final sub-boom. File-based
 * tracks (Howler) can layer on top later.
 */
class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private padFilter: BiquadFilterNode | null = null
  private padGain: GainNode | null = null
  private pads: OscillatorNode[] = []
  private noiseGain: GainNode | null = null
  private started = false
  private muted = false
  private lastElapsed = 0
  private lastBeat = -1

  get isStarted(): boolean {
    return this.started
  }

  /** Must be called from a user gesture (browser autoplay policy). */
  start(): void {
    if (this.started) return
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return

    const ctx = new Ctor()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = this.muted ? 0 : MASTER_LEVEL
    master.connect(ctx.destination)
    this.master = master

    // --- Pad (evolving chord bed) ---
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 700
    const padGain = ctx.createGain()
    padGain.gain.value = 0.0001
    padFilter.connect(padGain)
    padGain.connect(master)
    this.padFilter = padFilter
    this.padGain = padGain

    const base = CHORDS.real.freqs
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle'
      osc.frequency.value = base[i % base.length]
      osc.detune.value = (i - 1.5) * 7
      osc.connect(padFilter)
      osc.start()
      this.pads.push(osc)
    }

    // --- Crowd ambience (filtered noise) ---
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const channel = noiseBuffer.getChannelData(0)
    for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 900
    noiseFilter.Q.value = 0.6
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.0001
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noise.start()
    this.noiseGain = noiseGain

    this.started = true
    void ctx.resume()
    this.loop()
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, this.ctx.currentTime, 0.1)
    }
  }

  private loop = (): void => {
    if (!this.ctx) return
    this.update(masterTimeline.elapsed)
    requestAnimationFrame(this.loop)
  }

  private update(elapsed: number): void {
    const ctx = this.ctx
    if (!ctx || !this.padGain || !this.padFilter) return
    const now = ctx.currentTime
    const seg = segmentForTime(elapsed)
    const chord = CHORDS[seg.world]

    // Freeze: near-silence (30s -> 34s).
    const freeze = elapsed >= 30 && elapsed < 34
    this.padGain.gain.setTargetAtTime(freeze ? 0.02 : chord.padGain, now, 0.6)
    this.padFilter.frequency.setTargetAtTime(chord.cutoff, now, 0.8)

    for (let i = 0; i < this.pads.length; i++) {
      this.pads[i].frequency.setTargetAtTime(chord.freqs[i % chord.freqs.length], now, 0.5)
    }

    if (this.noiseGain) {
      const target = seg.phase === 'chaos' ? chord.noiseGain : 0.0001
      this.noiseGain.gain.setTargetAtTime(target, now, 0.5)
    }

    // Beat during Data World & Optimization.
    if (seg.phase === 'dataworld' || seg.phase === 'optimization') {
      const beatDur = 0.5
      const idx = Math.floor(elapsed / beatDur)
      if (idx !== this.lastBeat) {
        this.lastBeat = idx
        this.kick(now)
        if (idx % 2 === 0) this.blip(now, seg.world)
      }
    }

    // One-shots (edge-triggered).
    if (this.lastElapsed < 30 && elapsed >= 30) this.whoosh(now)
    if (this.lastElapsed < 116 && elapsed >= 116) this.subBoom(now)
    this.lastElapsed = elapsed
  }

  private kick(now: number): void {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(130, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  private blip(now: number, world: WorldKey): void {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const freqs = CHORDS[world].freqs
    const f = freqs[Math.floor(Math.random() * freqs.length)] * 4
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 0.32)
  }

  private whoosh(now: number): void {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.2), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(6000, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 1.0)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    src.start(now)
    src.stop(now + 1.2)
  }

  private subBoom(now: number): void {
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.5)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 3.2)
  }
}

export const audioEngine = new AudioEngine()
