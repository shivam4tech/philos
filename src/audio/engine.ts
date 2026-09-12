import type { Settings } from '@/state/persistence'

import { BASE_SCENE, SCENES, type AmbienceLayerId, type SceneProfile } from './scenes'
import { renderSfx, type SfxName, type SfxParams } from './sfx'

/**
 * AudioEngine — lazy AudioContext (created on first user gesture), a master
 * limiter, three buses (ambience / interaction / machine), one physical
 * ambience layer graph whose gains crossfade between scene profiles, and a
 * slow scheduler for genuinely rare distant events.
 */

const LAYERS: AmbienceLayerId[] = ['roomTone', 'hum', 'ventilation', 'machinery', 'impacts', 'pulses']

const DEFAULT_SCENE_GAINS: Record<AmbienceLayerId, number> = {
  roomTone: 0.05,
  hum: 0.02,
  ventilation: 0.02,
  machinery: 0.012,
  impacts: 0.01,
  pulses: 0.006,
}

export class AmbienceGraph {
  private layerGains = new Map<AmbienceLayerId, GainNode>()
  private machineGain: GainNode | null = null
  private machineOsc: OscillatorNode | null = null
  private machineSub: OscillatorNode | null = null
  private schedulerId: number | null = null
  private intensity = { machinery: 1, impacts: 1, pulses: 1 }
  private disposed = false

  constructor(
    private ctx: AudioContext,
    private dest: AudioNode,
    private reducedSensory: () => boolean,
  ) {
    const noise = this.makeNoiseSource()
    // room tone: brown noise, heavily lowpassed
    this.buildLayer('roomTone', noise, { type: 'lowpass', freq: 240, q: 0.5 })
    // ventilation: noise through a slowly wandering bandpass
    const vent = this.buildLayer('ventilation', noise, { type: 'bandpass', freq: 520, q: 1.2 })
    this.startWander(vent, 400, 900)
    // hum: detuned mains-ish pair
    const humGain = ctx.createGain()
    humGain.gain.value = DEFAULT_SCENE_GAINS.hum
    humGain.connect(dest)
    for (const f of [50, 100.4]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      osc.connect(humGain)
      osc.start()
      this.trackOsc(osc)
    }
    this.layerGains.set('hum', humGain)
    // machinery / impacts / pulses are event-driven; gains gate their level
    for (const id of ['machinery', 'impacts', 'pulses'] as AmbienceLayerId[]) {
      const gain = ctx.createGain()
      gain.gain.value = DEFAULT_SCENE_GAINS[id]
      gain.connect(dest)
      this.layerGains.set(id, gain)
    }
    // machine character hum
    const machineGain = ctx.createGain()
    machineGain.gain.value = 0
    machineGain.connect(dest)
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = 60
    const sub = ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.value = 30
    osc.connect(machineGain)
    sub.connect(machineGain)
    osc.start()
    sub.start()
    this.trackOsc(osc)
    this.trackOsc(sub)
    this.machineGain = machineGain
    this.machineOsc = osc
    this.machineSub = sub

    this.schedulerId = window.setInterval(() => this.tick(), 1000)
  }

  private oscillators: OscillatorNode[] = []
  private wandering: { filter: BiquadFilterNode; timer: number }[] = []

  private trackOsc(osc: OscillatorNode): void {
    this.oscillators.push(osc)
  }

  private makeNoiseSource(): AudioBufferSourceNode {
    const src = this.ctx.createBufferSource()
    const length = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    src.buffer = buffer
    src.loop = true
    src.start()
    return src
  }

  private buildLayer(
    id: AmbienceLayerId,
    source: AudioBufferSourceNode,
    filterOpts: { type: BiquadFilterType; freq: number; q?: number },
  ): BiquadFilterNode {
    const filter = this.ctx.createBiquadFilter()
    filter.type = filterOpts.type
    filter.frequency.value = filterOpts.freq
    filter.Q.value = filterOpts.q ?? 0.8
    const gain = this.ctx.createGain()
    gain.gain.value = DEFAULT_SCENE_GAINS[id]
    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.dest)
    this.layerGains.set(id, gain)
    return filter
  }

  private startWander(filter: BiquadFilterNode, min: number, max: number): void {
    const wander = () => {
      if (this.disposed) return
      const target = min + Math.random() * (max - min)
      filter.frequency.setTargetAtTime(target, this.ctx.currentTime, 4 + Math.random() * 6)
      this.wandering.push({ filter, timer: 0 })
    }
    wander()
    const id = window.setInterval(wander, 9000)
    this.wandering.push({ filter, timer: id })
  }

  setScene(profile: SceneProfile): void {
    if (this.disposed) return
    const t = this.ctx.currentTime
    const sensoryScale = this.reducedSensory() ? 0.4 : 1
    for (const id of LAYERS) {
      const gain = this.layerGains.get(id)
      if (!gain) continue
      const base = DEFAULT_SCENE_GAINS[id]
      const target = (profile.gains[id] ?? 0) * base * sensoryScale
      gain.gain.setTargetAtTime(target, t, 1.4)
    }
    this.intensity = {
      machinery: profile.events?.machinery ?? 1,
      impacts: profile.events?.impacts ?? 1,
      pulses: profile.events?.pulses ?? 1,
    }
    if (this.machineGain && this.machineOsc && this.machineSub) {
      const machine = profile.machine
      const target = machine ? machine.gain * 0.035 * sensoryScale : 0
      this.machineGain.gain.setTargetAtTime(target, t, 1.2)
      if (machine) {
        this.machineOsc.frequency.setTargetAtTime(machine.freq, t, 1.5)
        this.machineSub.frequency.setTargetAtTime(machine.freq / 2, t, 1.5)
      }
    }
  }

  private tick(): void {
    if (this.disposed) return
    const now = this.ctx.currentTime
    const sensory = this.reducedSensory()
    // distant machinery thump — expected roughly every 8–20 s at intensity 1
    if (!sensory && Math.random() < 0.07 * this.intensity.machinery) {
      this.thump(now)
    }
    // rare metal impact — expected roughly every 50 s
    if (!sensory && Math.random() < 0.02 * this.intensity.impacts) {
      this.impact(now)
    }
    // terminal pulse
    if (Math.random() < 0.045 * this.intensity.pulses) {
      this.pulse(now)
    }
  }

  private thump(when: number): void {
    const gain = this.layerGains.get('machinery')
    if (!gain) return
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    const f = 52 + Math.random() * 36
    osc.frequency.setValueAtTime(f, when)
    osc.frequency.exponentialRampToValueAtTime(f * 0.7, when + 0.5)
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0, when)
    env.gain.linearRampToValueAtTime(0.5 + Math.random() * 0.4, when + 0.03)
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.9)
    osc.connect(env).connect(gain)
    osc.start(when)
    osc.stop(when + 1)
  }

  private impact(when: number): void {
    const gain = this.layerGains.get('impacts')
    if (!gain) return
    const osc = this.ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180 + Math.random() * 120, when)
    osc.frequency.exponentialRampToValueAtTime(60, when + 0.6)
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0, when)
    env.gain.linearRampToValueAtTime(0.7, when + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0001, when + 1.4)
    osc.connect(env).connect(gain)
    osc.start(when)
    osc.stop(when + 1.5)
  }

  private pulse(when: number): void {
    const gain = this.layerGains.get('pulses')
    if (!gain) return
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 1200 + Math.random() * 1400
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0, when)
    env.gain.linearRampToValueAtTime(0.5, when + 0.006)
    env.gain.exponentialRampToValueAtTime(0.0001, when + 0.09)
    osc.connect(env).connect(gain)
    osc.start(when)
    osc.stop(when + 0.12)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    if (this.schedulerId !== null) window.clearInterval(this.schedulerId)
    for (const { filter, timer } of this.wandering) {
      void filter
      if (timer) window.clearInterval(timer)
    }
    const t = this.ctx.currentTime
    for (const gain of this.layerGains.values()) {
      gain.gain.setTargetAtTime(0, t, 0.3)
    }
    this.machineGain?.gain.setTargetAtTime(0, t, 0.3)
    window.setTimeout(() => {
      try {
        this.machineOsc?.stop()
        this.machineSub?.stop()
        for (const osc of this.oscillators) osc.stop()
        for (const gain of this.layerGains.values()) gain.disconnect()
        this.machineGain?.disconnect()
      } catch {
        /* nodes may already be stopped */
      }
    }, 1200)
  }
}

class AudioEngineImpl {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambienceBus: GainNode | null = null
  private interactionBus: GainNode | null = null
  private machineBus: GainNode | null = null
  private ambience: AmbienceGraph | null = null
  private currentScene: string | null = null
  private settings: Settings | null = null
  private unlocked = false

  /** Must be called from a user-gesture handler. Idempotent. */
  unlock(settings: Settings): void {
    this.setSettings(settings)
    if (this.unlocked) {
      void this.ctx?.resume()
      return
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) {
      console.warn('[institute] audio unavailable: no AudioContext implementation')
      return
    }
    const ctx = new Ctor()
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -14
    limiter.knee.value = 24
    limiter.ratio.value = 12
    limiter.attack.value = 0.004
    limiter.release.value = 0.24
    const master = ctx.createGain()
    limiter.connect(master)
    master.connect(ctx.destination)

    const bus = (gainValue: number) => {
      const gain = ctx.createGain()
      gain.gain.value = gainValue
      gain.connect(limiter)
      return gain
    }
    this.ctx = ctx
    this.masterGain = master
    this.ambienceBus = bus(0.9)
    this.interactionBus = bus(0.9)
    this.machineBus = bus(0.9)
    this.unlocked = true
    void ctx.resume()
    this.applySettings(settings)
  }

  setSettings(settings: Settings): void {
    this.settings = settings
    if (this.unlocked) this.applySettings(settings)
  }

  private applySettings(settings: Settings): void {
    if (!this.ctx || !this.masterGain || !this.ambienceBus || !this.interactionBus || !this.machineBus) return
    const t = this.ctx.currentTime
    const masterLevel = settings.muted ? 0 : settings.master
    this.masterGain.gain.setTargetAtTime(masterLevel, t, 0.03)
    const sensory = settings.reducedSensory ? 0.55 : 1
    this.ambienceBus.gain.setTargetAtTime(settings.ambience * sensory, t, 0.05)
    this.interactionBus.gain.setTargetAtTime(settings.interaction * sensory, t, 0.05)
    this.machineBus.gain.setTargetAtTime(settings.interaction * sensory, t, 0.05)
  }

  get ready(): boolean {
    return this.unlocked && this.ctx !== null
  }

  play(name: SfxName, params: SfxParams = {}, bus: 'interaction' | 'machine' = 'interaction'): void {
    const ctx = this.ctx
    const dest = bus === 'machine' ? this.machineBus : this.interactionBus
    if (!ctx || !dest || !this.unlocked) return
    const settings = this.settings
    if (settings?.reducedSensory && (name === 'warning' || name === 'surveillance')) {
      params = { ...params, gain: (params.gain ?? 1) * 0.4 }
    }
    renderSfx(name, { ctx, destination: dest, when: ctx.currentTime + 0.01 }, params)
  }

  startAmbience(sceneId: string = BASE_SCENE): void {
    if (!this.ctx || !this.ambienceBus) return
    if (!this.ambience) {
      this.ambience = new AmbienceGraph(this.ctx, this.ambienceBus, () => this.settings?.reducedSensory ?? false)
    }
    this.setScene(sceneId)
  }

  setScene(sceneId: string): void {
    const profile = SCENES[sceneId] ?? SCENES[BASE_SCENE]
    if (this.currentScene === profile.id) return
    this.currentScene = profile.id
    this.ambience?.setScene(profile)
  }

  stopAmbience(): void {
    this.ambience?.dispose()
    this.ambience = null
    this.currentScene = null
  }

  currentSceneId(): string | null {
    return this.currentScene
  }
}

export const audio = new AudioEngineImpl()

export { BASE_SCENE } from './scenes'

/** Contamination events announce themselves acoustically, scaled by severity. */
export function playContaminationSting(severity: 1 | 2 | 3): void {
  audio.play('contamination', { gain: 0.5 + severity * 0.25 })
}

export function playSfx(name: SfxName, params?: SfxParams, bus?: 'interaction' | 'machine'): void {
  audio.play(name, params, bus)
}

export type { SfxName }
