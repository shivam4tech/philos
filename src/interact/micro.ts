import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'

import { audio } from '@/audio/engine'
import type { SfxName } from '@/audio/sfx'

/**
 * Micro-feedback library — physical button behavior, magnetic targets, and
 * one-shot visual effects. Restrained by design: not every element gets
 * every effect.
 */

export interface PressableOptions {
  /** sound on press; false disables */
  sfx?: SfxName | false
  /** sound on keyboard activation */
  keySfx?: SfxName | false
  disabled?: boolean
}

export interface PressableProps {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
  onKeyUp: (event: ReactKeyboardEvent<HTMLElement>) => void
}

/** Physical depression for buttons and interactive rows. */
export function usePressable(options: PressableOptions = {}): PressableProps {
  const { sfx = 'click', keySfx = 'click', disabled = false } = options
  const ref = useRef<HTMLElement | null>(null)

  const press = useCallback(() => {
    ref.current?.classList.add('is-pressed')
  }, [])
  const release = useCallback(() => {
    ref.current?.classList.remove('is-pressed')
    // force reflow so rapid re-presses restart the spring
    void ref.current?.offsetWidth
  }, [])

  return {
    onPointerDown(event) {
      ref.current = event.currentTarget
      if (disabled) return
      press()
      if (sfx) audio.play(sfx)
    },
    onPointerUp() {
      release()
    },
    onPointerLeave() {
      release()
    },
    onKeyDown(event) {
      ref.current = event.currentTarget
      if (disabled) return
      if (event.key === ' ' || event.key === 'Enter') {
        press()
        if (keySfx) audio.play(keySfx)
      }
    },
    onKeyUp(event) {
      if (event.key === ' ' || event.key === 'Enter') release()
    },
  }
}

/** One-shot visual effect classes: fx-shake, fx-bloom, fx-pulse, fx-slam. */
export type FxName = 'shake' | 'bloom' | 'pulse' | 'slam'

export function fireFx(element: HTMLElement | null, name: FxName): void {
  if (!element) return
  const className = `fx-${name}`
  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
  const remove = () => element.classList.remove(className)
  element.addEventListener('animationend', remove, { once: true })
}

export function useFx<T extends HTMLElement>(): [React.RefObject<T>, (name: FxName) => void] {
  const ref = useRef<T>(null)
  const fire = useCallback((name: FxName) => {
    fireFx(ref.current, name)
  }, [])
  return [ref, fire]
}

/** Magnetic attraction toward the pointer, bounded and spring-damped. */
export function useMagnetic<T extends HTMLElement>(strength = 0.18, maxOffset = 8): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy)
      const radius = Math.max(rect.width, rect.height)
      if (dist > radius * 1.6) {
        tx = 0
        ty = 0
        return
      }
      const falloff = 1 - Math.min(1, dist / (radius * 1.6))
      tx = Math.max(-maxOffset, Math.min(maxOffset, dx * strength * falloff))
      ty = Math.max(-maxOffset, Math.min(maxOffset, dy * strength * falloff))
    }

    const tick = () => {
      cx += (tx - cx) * 0.16
      cy += (ty - cy) * 0.16
      el.style.transform =
        Math.abs(cx) > 0.05 || Math.abs(cy) > 0.05
          ? `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
          : ''
      raf = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = window.requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [strength, maxOffset])

  return ref
}

/** First-gesture audio unlock (browser autoplay compliance). */
export function useAudioUnlock(): void {
  useEffect(() => {
    const unlock = () => {
      import('@/state/settings').then(({ getSettings }) => audio.unlock(getSettings()))
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])
}
