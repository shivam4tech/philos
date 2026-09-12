/**
 * Ambience scene profiles. The engine builds one physical layer graph and
 * crossfades layer gains between scenes; profiles are pure data.
 */

export type AmbienceLayerId =
  | 'roomTone'
  | 'hum'
  | 'ventilation'
  | 'machinery'
  | 'impacts'
  | 'pulses'

export interface SceneProfile {
  id: string
  label: string
  /** layer gain multipliers, 0–1 */
  gains: Partial<Record<AmbienceLayerId, number>>
  /** apparatus character hum */
  machine?: { freq: number; gain: number; wobble?: number }
  /** scheduled event intensity multipliers */
  events?: { machinery?: number; impacts?: number; pulses?: number }
}

function profile(
  id: string,
  label: string,
  gains: Partial<Record<AmbienceLayerId, number>>,
  machine?: SceneProfile['machine'],
  events?: SceneProfile['events'],
): SceneProfile {
  return { id, label, gains, machine, events }
}

export const SCENES: Record<string, SceneProfile> = {
  entrance: profile('entrance', 'vestibule (dark)', {
    roomTone: 0.5,
    hum: 0.15,
    machinery: 0.2,
    impacts: 0.3,
  }),
  shell: profile('shell', 'facility base', {
    roomTone: 1,
    hum: 0.5,
    ventilation: 0.7,
    machinery: 0.5,
    impacts: 0.6,
    pulses: 0.5,
  }),
  'will-engine': profile('will-engine', 'east wing / will', {
    roomTone: 0.9, hum: 0.5, ventilation: 0.5, machinery: 0.7, impacts: 0.7, pulses: 0.4,
  }, { freq: 52, gain: 0.5, wobble: 0.5 }, { machinery: 1.2, impacts: 0.8 }),
  verification: profile('verification', 'east wing / verification', {
    roomTone: 0.9, hum: 0.6, ventilation: 0.6, machinery: 0.3, impacts: 0.3, pulses: 0.7,
  }, { freq: 96, gain: 0.3, wobble: 0.8 }, { pulses: 1.3 }),
  'vending-hall': profile('vending-hall', 'central hall / vending', {
    roomTone: 1, hum: 0.5, ventilation: 0.8, machinery: 0.8, impacts: 1, pulses: 0.6,
  }, { freq: 120, gain: 0.35, wobble: 0.3 }, { machinery: 1, impacts: 1.4 }),
  workbench: profile('workbench', 'west wing / workbench', {
    roomTone: 0.9, hum: 0.4, ventilation: 0.6, machinery: 0.4, impacts: 0.5, pulses: 0.4,
  }, { freq: 65, gain: 0.3, wobble: 0.2 }),
  'bracket-console': profile('bracket-console', 'west wing / console', {
    roomTone: 0.9, hum: 0.4, ventilation: 0.4, machinery: 0.2, impacts: 0.2, pulses: 0.5,
  }, { freq: 80, gain: 0.25, wobble: 0 }, { pulses: 1 }),
  'recurrence-booth': profile('recurrence-booth', 'central hall / booth', {
    roomTone: 0.9, hum: 0.5, ventilation: 0.5, machinery: 0.4, impacts: 0.4, pulses: 0.8,
  }, { freq: 55, gain: 0.3, wobble: 0.1 }, { pulses: 1.2 }),
  'monad-room': profile('monad-room', 'service corridor / monads', {
    roomTone: 1, hum: 0.6, ventilation: 0.5, machinery: 0.3, impacts: 0.3, pulses: 0.2,
  }, { freq: 70, gain: 0.3, wobble: 0.6 }, { pulses: 0.3 }),
  'private-room': profile('private-room', 'lower archive / private', {
    roomTone: 0.9, hum: 0.35, ventilation: 0.4, machinery: 0.2, impacts: 0.2, pulses: 0.4,
  }, { freq: 45, gain: 0.25, wobble: 0.3 }),
  'difference-bench': profile('difference-bench', 'service corridor / difference', {
    roomTone: 0.9, hum: 0.5, ventilation: 0.5, machinery: 0.5, impacts: 0.5, pulses: 0.6,
  }, { freq: 85, gain: 0.3, wobble: 0.4 }, { pulses: 0.9 }),
  'expenditure-yard': profile('expenditure-yard', 'service corridor / expenditure', {
    roomTone: 1, hum: 0.5, ventilation: 0.6, machinery: 1, impacts: 1, pulses: 0.4,
  }, { freq: 100, gain: 0.4, wobble: 0.5 }, { machinery: 1.3, impacts: 1.3 }),
  'terms-office': profile('terms-office', 'lower archive / terms', {
    roomTone: 0.9, hum: 0.4, ventilation: 0.4, machinery: 0.2, impacts: 0.2, pulses: 0.7,
  }, { freq: 60, gain: 0.25, wobble: 0.2 }, { pulses: 1.1 }),
  'observation-room': profile('observation-room', 'service corridor / observation', {
    roomTone: 0.9, hum: 0.55, ventilation: 0.7, machinery: 0.3, impacts: 0.2, pulses: 0.5,
  }, { freq: 90, gain: 0.28, wobble: 0 }, { pulses: 0.8 }),
  'motion-test': profile('motion-test', 'restricted / motion', {
    roomTone: 0.8, hum: 0.4, ventilation: 0.3, machinery: 0.3, impacts: 0.3, pulses: 0.5,
  }, { freq: 50, gain: 0.3, wobble: 0.2 }),
  'zeno-bar': profile('zeno-bar', 'service corridor / zeno', {
    roomTone: 0.9, hum: 0.4, ventilation: 0.4, machinery: 0.3, impacts: 0.3, pulses: 0.9,
  }, { freq: 66, gain: 0.25, wobble: 0.2 }, { pulses: 1.4 }),
  'noumenal-desk': profile('noumenal-desk', 'west wing / inspector', {
    roomTone: 0.9, hum: 0.4, ventilation: 0.4, machinery: 0.2, impacts: 0.2, pulses: 0.6,
  }, { freq: 75, gain: 0.22, wobble: 0.3 }),
  'writing-pad': profile('writing-pad', 'east wing / pad', {
    roomTone: 0.9, hum: 0.35, ventilation: 0.4, machinery: 0.2, impacts: 0.2, pulses: 0.4,
  }, { freq: 58, gain: 0.22, wobble: 0.3 }),
  'still-room': profile('still-room', 'still room', {
    roomTone: 0.6, hum: 0.1, ventilation: 0.1, machinery: 0, impacts: 0, pulses: 0,
  }, { freq: 36, gain: 0.15, wobble: 0 }),
}

export const BASE_SCENE = 'shell'
