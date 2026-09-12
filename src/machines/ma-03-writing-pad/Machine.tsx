import { useCallback, useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import './pad.css'

/**
 * MA-03 — mystic writing pad. Two stacked canvases: the wax slab (permanent,
 * faint) and the celluloid sheet (visible, erasable). New strokes are bent by
 * what the slab still holds.
 */
export default function Machine() {
  const api = useMachine()
  const sheetRef = useRef<HTMLCanvasElement | null>(null)
  const slabRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [erases, setErases] = useState(0)
  const [strokes, setStrokes] = useState(0)
  const [completed, setCompleted] = useState(false)

  const ctxOf = (ref: React.RefObject<HTMLCanvasElement | null>) => ref.current?.getContext('2d') ?? null

  const sizeCanvases = useCallback(() => {
    for (const ref of [sheetRef, slabRef]) {
      const canvas = ref.current
      if (!canvas) continue
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) continue
      canvas.width = Math.max(200, rect.width)
      canvas.height = Math.max(160, rect.height)
    }
  }, [])

  useEffect(() => {
    sizeCanvases()
    window.addEventListener('resize', sizeCanvases)
    return () => window.removeEventListener('resize', sizeCanvases)
  }, [sizeCanvases])

  /* the slab's trace bends the next mark: sample the slab, offset the stroke */
  const drawTo = (x: number, y: number) => {
    const sheet = ctxOf(sheetRef)
    const slab = ctxOf(slabRef)
    const from = last.current
    if (!sheet || !from) return
    let dx = 0
    let dy = 0
    if (slab) {
      const sample = slab.getImageData(
        Math.max(0, Math.min(slab.canvas.width - 4, x - 2)),
        Math.max(0, Math.min(slab.canvas.height - 4, y - 2)),
        4,
        4,
      )
      let sum = 0
      for (let i = 0; i < sample.data.length; i += 4) sum += sample.data[i]
      const trace = sum / (4 * 255)
      if (trace > 0.05) {
        dx = (Math.random() - 0.5) * 6 * trace
        dy = (Math.random() - 0.5) * 6 * trace
      }
    }
    const line = (ctx: CanvasRenderingContext2D, ox: number, oy: number, color: string, width: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(from.x + ox, from.y + oy)
      ctx.lineTo(x + dx + ox, y + dy + oy)
      ctx.stroke()
    }
    line(sheet, 0, 0, '#e8e4da', 2.2)
    if (slab) line(slab, 0, 0, 'rgba(194, 84, 58, 0.16)', 2.6)
    last.current = { x: x + dx, y: y + dy }
  }

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    drawing.current = true
    last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setStrokes((s) => s + 1)
    api.play('key', 0.3)
  }
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    drawTo(e.clientX - rect.left, e.clientY - rect.top)
  }
  const onUp = () => {
    drawing.current = false
    last.current = null
  }

  const erase = () => {
    const sheet = ctxOf(sheetRef)
    if (sheet) {
      sheet.clearRect(0, 0, sheet.canvas.width, sheet.canvas.height)
    }
    const next = erases + 1
    setErases(next)
    api.play('reset', 0.35)
    if (next >= 3 && !completed && strokes > 0) {
      setCompleted(true)
      api.complete('writing:trace-remained')
    }
  }

  return (
    <div className="pad">
      <header className="pad__head">
        <Microlabel>MINOR APPARATUS MA-03 — MYSTIC WRITING PAD</Microlabel>
        <span className="pad__meta">ERASURES: {erases}</span>
      </header>

      <div className="pad__frame">
        <canvas ref={slabRef} className="pad__slab" aria-hidden="true" />
        <canvas
          ref={sheetRef}
          className="pad__sheet"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          aria-label="Writing surface"
        />
        {strokes === 0 && <p className="pad__hint">WRITE UPON THE PAD. THEN LIFT THE SHEET.</p>}
      </div>

      <footer className="pad__footer">
        <Btn variant="primary" onClick={erase}>
          LIFT THE SHEET (ERASE)
        </Btn>
        {completed && (
          <p className="pad__verdict">THE SLAB REMEMBERS. THE SHEET DOES NOT. THE NEXT MARKS WILL BE COUNTERSIGNED.</p>
        )}
      </footer>
    </div>
  )
}
