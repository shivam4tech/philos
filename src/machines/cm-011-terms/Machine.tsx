import { useEffect, useMemo, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import {
  ACCEPT_LABELS,
  CONTRACT_CLAUSES,
  DEPTH_FOR_COMPLETION,
  LINES,
  TERMS,
  type TermDef,
} from './machine'
import './terms.css'

interface OpenDef {
  term: string
  /** nesting depth for display indentation */
  depth: number
}

export default function Machine() {
  const api = useMachine()
  const [readTerms, setReadTerms] = useState<string[]>([])
  const [openStack, setOpenStack] = useState<OpenDef[]>([])
  const [acceptDepth, setAcceptDepth] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [selfReferenceFired, setSelfReferenceFired] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const byTerm = useMemo(() => new Map(TERMS.map((t) => [t.term, t])), [])
  const depth = readTerms.length
  const edges = useMemo(
    () => TERMS.filter((t) => readTerms.includes(t.term)).reduce((n, t) => n + t.references.length, 0),
    [readTerms],
  )
  const acceptLabel = ACCEPT_LABELS[Math.min(acceptDepth, ACCEPT_LABELS.length - 1)]

  const openTerm = (term: string, depth: number) => {
    setOpenStack((prev) => [...prev, { term, depth }])
    if (!readTerms.includes(term)) {
      setReadTerms((prev) => [...prev, term])
      api.play('semantic-shift', 0.5)
    } else {
      api.play('tick', 0.4)
    }
    if (readTerms.length + 1 >= DEPTH_FOR_COMPLETION && acceptDepth < 1) {
      setAcceptDepth(1)
    }
  }

  const closeTop = () => {
    setOpenStack((prev) => prev.slice(0, -1))
    api.play('tick', 0.3)
  }

  /* the ACCEPT button retreats as the graph grows */
  useEffect(() => {
    if (depth >= 4 && acceptDepth < 2) setAcceptDepth(2)
    if (depth >= 7 && acceptDepth < 3) setAcceptDepth(3)
    if (depth >= 10 && acceptDepth < 4) setAcceptDepth(4)
  }, [depth, acceptDepth])

  const accept = () => {
    if (depth < DEPTH_FOR_COMPLETION) {
      api.play('invalid', 0.5)
      setAcceptDepth((d) => Math.min(ACCEPT_LABELS.length - 1, Math.max(1, d + 1)))
      return
    }
    setAccepted(true)
    api.play('complete', 0.6)
    api.complete('terms:accept-depth-reached')
  }

  const submitDraft = (term: string) => {
    const text = (drafts[term] ?? '').trim().toUpperCase()
    if (text === term) {
      if (!selfReferenceFired) {
        setSelfReferenceFired(true)
        api.secret('circular-definition', 'UR-012', 'CIRCULAR DEFINITION')
      }
      api.play('contradiction', 0.5)
    } else if (text.length > 0) {
      api.play('tick', 0.4)
    }
    setDrafts((prev) => ({ ...prev, [term]: '' }))
  }

  return (
    <div className="terms">
      <header className="terms__head">
        <Microlabel>INSTITUTE SERVICE AGREEMENT — DRAFT {7 + acceptDepth}</Microlabel>
        <span className="terms__graphnote">
          {LINES.graphNote.replace('{NODES}', String(depth)).replace('{EDGES}', String(edges))}
        </span>
      </header>

      <div className="terms__body">
        <div className="terms__contract">
          <h2 className="terms__title">TERMS AND CONDITIONS</h2>
          <p className="terms__intro">{LINES.open}</p>
          {CONTRACT_CLAUSES.map((clause, i) => (
            <p key={i} className="terms__clause">
              <TermText text={clause} onOpen={(term) => openTerm(term, 0)} />
            </p>
          ))}

          <div className="terms__acceptwrap">
            <Btn variant="primary" onClick={accept}>
              {acceptLabel}
            </Btn>
            {acceptDepth > 0 && (
              <span className="terms__acceptnote">
                THE BUTTON HAS MOVED {acceptDepth} LAYER{acceptDepth === 1 ? '' : 'S'} DEEPER INTO THE DOCUMENT.
              </span>
            )}
          </div>
        </div>

        <div className="terms__definitions">
          <Microlabel>DEFINITIONS — EACH DEFINED IN OTHER TERMS</Microlabel>
          <div className="terms__defstack">
            {openStack.map((open, i) => {
              const def = byTerm.get(open.term) as TermDef
              const revised = def.revision !== undefined && readTerms.includes(def.revisionAfter ?? '')
              return (
                <div key={`${open.term}-${i}`} className="terms__def" style={{ marginLeft: open.depth * 14 }}>
                  <h3 className="terms__defterm">{def.term}</h3>
                  <p className="terms__deftext">
                    <TermText text={def.definition} onOpen={(term) => openTerm(term, open.depth + 1)} />
                  </p>
                  {revised && <p className="terms__revision">↳ {def.revision}</p>}
                  <input
                    className="terms__draft"
                    placeholder={`DEFINE ${def.term} IN YOUR OWN TERMS…`}
                    value={drafts[def.term] ?? ''}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [def.term]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && submitDraft(def.term)}
                    aria-label={`Define ${def.term} in your own terms`}
                  />
                </div>
              )
            })}
            {openStack.length === 0 && (
              <p className="terms__hint">NO DEFINITIONS OPEN. THE CONTRACT READS AS IF THAT WERE POSSIBLE.</p>
            )}
            {openStack.length > 0 && (
              <Btn variant="ghost" onClick={closeTop}>
                ← CLOSE TOP DEFINITION
              </Btn>
            )}
          </div>
        </div>
      </div>

      {accepted && (
        <div className="terms__verdict" role="status">
          <p>{LINES.completion}</p>
        </div>
      )}
    </div>
  )
}

/** Clause/definition text with clickable capitalized terms. */
function TermText({ text, onOpen }: { text: string; onOpen: (term: string) => void }) {
  const known = useMemo(() => new Set(TERMS.map((t) => t.term)), [])
  const parts = text.split(/(\b[A-ZÉÀ-ÿ][A-ZÉÀ-ÿ’-]*\b)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part === part.toUpperCase() && known.has(part.trim()) ? (
          <button key={i} className="terms__termlink" onClick={() => onOpen(part.trim())}>
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
