/**
 * Procedural sound effects — oscillator/noise recipes only. No samples, no
 * network. Every recipe is short, quiet, and designed to sit under ambience.
 */

export type SfxName =
  | 'click'
  | 'hover'
  | 'toggle'
  | 'key'
  | 'invalid'
  | 'activate'
  | 'complete'
  | 'secret'
  | 'warning'
  | 'contradiction'
  | 'semantic-shift'
  | 'surveillance'
  | 'recurrence'
  | 'contamination'
  | 'power-on'
  | 'power-off'
  | 'tick'
  | 'unlock'
  | 'reset'

export interface SfxParams {
  gain?: number
}

interface ToneOpts {
  type?: OscillatorType
  f0: number
  f1?: number
  dur: number
  gain: number
  delay?: number
  attack?: number
}

interface NoiseOpts {
  dur: number
  gain: number
  delay?: number
  filter?: { type: BiquadFilterType; freq: number; freq1?: number; q?: number }
  attack?: number
}

export interface SfxContext {
  ctx: AudioContext
  destination: AudioNode
  when: number
}

let cachedNoise: AudioBuffer | null = null

export function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoise && cachedNoise.sampleRate === ctx.sampleRate) return cachedNoise
  const length = ctx.sampleRate
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  cachedNoise = buffer
  return buffer
}

function tone(ctx: AudioContext, dest: AudioNode, when: number, opts: ToneOpts): void {
  const t0 = when + (opts.delay ?? 0)
  const osc = ctx.createOscillator()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(opts.f0, t0)
  if (opts.f1 !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.f1), t0 + opts.dur)
  }
  const gain = ctx.createGain()
  const attack = opts.attack ?? 0.004
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(opts.gain, t0 + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  osc.connect(gain).connect(dest)
  osc.start(t0)
  osc.stop(t0 + opts.dur + 0.05)
}

function noiseBurst(ctx: AudioContext, dest: AudioNode, when: number, opts: NoiseOpts): void {
  const t0 = when + (opts.delay ?? 0)
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  src.loop = true
  const node: AudioNode = src
  let tail: AudioNode = node
  if (opts.filter) {
    const filter = ctx.createBiquadFilter()
    filter.type = opts.filter.type
    filter.frequency.setValueAtTime(opts.filter.freq, t0)
    if (opts.filter.freq1 !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(1, opts.filter.freq1), t0 + opts.dur)
    }
    filter.Q.value = opts.filter.q ?? 0.8
    node.connect(filter)
    tail = filter
  }
  const gain = ctx.createGain()
  const attack = opts.attack ?? 0.002
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(opts.gain, t0 + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  tail.connect(gain).connect(dest)
  src.start(t0)
  src.stop(t0 + opts.dur + 0.05)
}

/** Renders one named effect. All timings assume the constraint: short & subtle. */
export function renderSfx(name: SfxName, sfx: SfxContext, params: SfxParams = {}): void {
  const { ctx, destination: dest, when } = sfx
  const g = params.gain ?? 1
  switch (name) {
    case 'click':
      noiseBurst(ctx, dest, when, { dur: 0.014, gain: 0.1 * g, filter: { type: 'highpass', freq: 2200 } })
      tone(ctx, dest, when, { f0: 1900, f1: 1500, dur: 0.03, gain: 0.1 * g })
      break
    case 'hover':
      tone(ctx, dest, when, { f0: 2400, dur: 0.016, gain: 0.018 * g })
      break
    case 'toggle':
      tone(ctx, dest, when, { type: 'triangle', f0: 520, f1: 660, dur: 0.05, gain: 0.08 * g })
      break
    case 'key':
      noiseBurst(ctx, dest, when, { dur: 0.01, gain: 0.05 * g, filter: { type: 'bandpass', freq: 1200, q: 1.4 } })
      break
    case 'invalid':
      tone(ctx, dest, when, { type: 'square', f0: 170, f1: 118, dur: 0.14, gain: 0.09 * g })
      break
    case 'activate':
      tone(ctx, dest, when, { type: 'sawtooth', f0: 120, f1: 480, dur: 0.38, gain: 0.05 * g, attack: 0.03 })
      tone(ctx, dest, when, { f0: 58, f1: 62, dur: 0.24, gain: 0.12 * g })
      noiseBurst(ctx, dest, when, { dur: 0.3, gain: 0.05 * g, filter: { type: 'lowpass', freq: 900, freq1: 200 } })
      break
    case 'complete':
      tone(ctx, dest, when, { f0: 90, dur: 0.18, gain: 0.12 * g })
      tone(ctx, dest, when, { f0: 392, dur: 0.8, gain: 0.05 * g, delay: 0.05 })
      tone(ctx, dest, when, { f0: 494, dur: 0.8, gain: 0.045 * g, delay: 0.12 })
      tone(ctx, dest, when, { f0: 587, dur: 0.9, gain: 0.04 * g, delay: 0.19 })
      break
    case 'secret':
      tone(ctx, dest, when, { f0: 880, f1: 660, dur: 0.42, gain: 0.05 * g })
      tone(ctx, dest, when, { f0: 660, f1: 440, dur: 0.5, gain: 0.045 * g, delay: 0.38 })
      break
    case 'warning':
      tone(ctx, dest, when, { type: 'square', f0: 222, dur: 0.07, gain: 0.07 * g })
      tone(ctx, dest, when, { type: 'square', f0: 222, dur: 0.07, gain: 0.07 * g, delay: 0.16 })
      break
    case 'contradiction':
      tone(ctx, dest, when, { f0: 440, dur: 0.55, gain: 0.045 * g, attack: 0.05 })
      tone(ctx, dest, when, { f0: 447, dur: 0.55, gain: 0.045 * g, attack: 0.05 })
      break
    case 'semantic-shift':
      tone(ctx, dest, when, { type: 'triangle', f0: 900, f1: 1300, dur: 0.12, gain: 0.05 * g })
      break
    case 'surveillance':
      noiseBurst(ctx, dest, when, { dur: 0.03, gain: 0.09 * g, filter: { type: 'bandpass', freq: 3000, q: 2 } })
      tone(ctx, dest, when, { f0: 1500, dur: 0.02, gain: 0.05 * g, delay: 0.045 })
      break
    case 'recurrence':
      tone(ctx, dest, when, { f0: 1400, dur: 0.025, gain: 0.07 * g })
      tone(ctx, dest, when, { f0: 1400, dur: 0.025, gain: 0.07 * g, delay: 0.4 })
      break
    case 'contamination':
      noiseBurst(ctx, dest, when, { dur: 0.9, gain: 0.1 * g, filter: { type: 'lowpass', freq: 300, freq1: 70 }, attack: 0.2 })
      tone(ctx, dest, when, { f0: 55, dur: 0.8, gain: 0.09 * g, attack: 0.25 })
      break
    case 'power-on':
      tone(ctx, dest, when, { f0: 40, f1: 110, dur: 0.5, gain: 0.12 * g, attack: 0.05 })
      noiseBurst(ctx, dest, when, { dur: 0.25, gain: 0.07 * g, filter: { type: 'lowpass', freq: 600 } })
      break
    case 'power-off':
      tone(ctx, dest, when, { f0: 110, f1: 35, dur: 0.42, gain: 0.1 * g })
      break
    case 'tick':
      noiseBurst(ctx, dest, when, { dur: 0.008, gain: 0.035 * g, filter: { type: 'highpass', freq: 4000 } })
      break
    case 'unlock':
      tone(ctx, dest, when, { f0: 660, dur: 0.09, gain: 0.055 * g })
      tone(ctx, dest, when, { f0: 990, dur: 0.12, gain: 0.05 * g, delay: 0.1 })
      break
    case 'reset':
      noiseBurst(ctx, dest, when, { dur: 0.16, gain: 0.09 * g, filter: { type: 'lowpass', freq: 800 } })
      tone(ctx, dest, when, { f0: 200, f1: 80, dur: 0.26, gain: 0.08 * g, delay: 0.02 })
      break
  }
}
