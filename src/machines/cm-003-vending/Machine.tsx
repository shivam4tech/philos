import { useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable, useFx, fireFx } from '@/interact/micro'
import { Microlabel } from '@/shell/ui'
import { DISPLAY_LINES, DRINKS, MEDIATIONS, SECRET_DEMAND_THRESHOLD } from './machine'
import './vending.css'

export default function Machine() {
  const api = useMachine()
  const [display, setDisplay] = useState<string>(DISPLAY_LINES.idle)
  const [selected, setSelected] = useState<string | null>(null)
  const [mediationIndex, setMediationIndex] = useState<number>(-1)
  const [dispensing, setDispensing] = useState(false)
  const [returned, setReturned] = useState(false)
  const [demands, setDemands] = useState(0)
  const [canRef] = useFx<HTMLDivElement>()
  const machineRef = useRef<HTMLDivElement | null>(null)

  /* COMMODITY CONTAMINATION (Hegel × Marx): the wage relation gates dispensing */
  const contaminated = api.contaminantId === 'marx'
  const [allocations, setAllocations] = useState(0)
  const [wageShare, setWageShare] = useState(40)

  const allocate = () => {
    const next = allocations + 1
    setAllocations(next)
    api.play('contradiction', 0.5)
    setDisplay(
      next >= 3
        ? 'EXCHANGE COMPLETED. THE COMMODITY FORM REMAINS.'
        : `ALLOCATION ${next} OF 3 RECORDED. THE LEDGER REMAINS OPEN.`,
    )
    if (next >= 3) {
      window.setTimeout(dispense, 900)
    }
  }

  const selectDrink = (drink: (typeof DRINKS)[number]) => {
    if (mediationIndex >= 0 || dispensing) return
    setSelected(drink.label)
    setMediationIndex(-1)
    setDisplay(DISPLAY_LINES.immediate(drink.label))
    api.play('toggle', 0.8)
  }

  const demand = () => {
    const nextDemands = demands + 1
    setDemands(nextDemands)
    if (nextDemands === SECRET_DEMAND_THRESHOLD) {
      api.secret('immediacy-demanded', 'UR-005', 'IMMEDIACY DEMANDED')
    }
    if (!selected) {
      setDisplay(DISPLAY_LINES.noSelection)
      api.play('invalid', 0.5)
      return
    }
    if (contaminated) {
      if (mediationIndex < 0) {
        setMediationIndex(0)
        setDisplay('PRICE DECOMPOSED. ALLOCATE THE WAGE RELATION TO PROCEED.')
        api.play('surveillance', 0.5)
      }
      return
    }
    const next = mediationIndex + 1
    if (next >= MEDIATIONS.length) {
      dispense()
      return
    }
    setMediationIndex(next)
    setDisplay(DISPLAY_LINES.mediating(next + 1, MEDIATIONS.length))
    api.play('contradiction', 0.6)
    fireFx(machineRef.current, 'pulse')
  }

  const dispense = () => {
    setDispensing(true)
    setDisplay(DISPLAY_LINES.dispense)
    api.play('power-on', 0.7)
    window.setTimeout(() => {
      api.play('complete', 0.6)
      setReturned(true)
      fireFx(canRef.current, 'slam')
      api.complete(contaminated ? 'vending:contaminated-session' : 'vending:dispensed')
    }, 1400)
  }

  const mediation = mediationIndex >= 0 ? MEDIATIONS[mediationIndex] : null

  return (
    <div className="vending">
      <div className="vending__machine" ref={machineRef}>
        <div className="vending__display" role="status">
          <span className="vending__displaytext">{display}</span>
        </div>

        <div className="vending__shelf">
          {DRINKS.map((drink) => (
            <VendButton
              key={drink.id}
              label={drink.label}
              price={drink.price}
              active={selected === drink.label}
              disabled={mediationIndex >= 0 || dispensing}
              onSelect={() => selectDrink(drink)}
            />
          ))}
        </div>

        <div className="vending__mediations">
          {contaminated && selected && mediationIndex >= 0 ? (
            <div className="vending__ledger">
              <Microlabel signal>PRICE DECOMPOSITION — WHERE THE 2.0 WENT</Microlabel>
              <ul className="vending__ledgerlist">
                <li><span>MATERIALS</span><span>0.5</span></li>
                <li><span>MACHINERY (DEPRECIATION)</span><span>0.3</span></li>
                <li><span>RENT</span><span>0.2</span></li>
                <li><span>REMAINDER: LABOR ↔ PROFIT</span><span>1.0</span></li>
              </ul>
              <label className="vending__wageslider">
                <span>WAGES {wageShare}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={wageShare}
                  onChange={(e) => setWageShare(Number(e.target.value))}
                  aria-label="Allocate remainder between wages and profit"
                />
                <span>PROFIT {100 - wageShare}%</span>
              </label>
              <p className="vending__medline">
                {wageShare < 30
                  ? 'PRODUCTION IS ASSUMED. WHO MAINTAINS THE MACHINERY IS NOT YOUR ACCOUNTING PROBLEM, THE LEDGER NOTES.'
                  : 'THE ALLOCATION IS RECORDED. THE RELATION THAT REQUIRED IT IS NOT ALTERED BY IT.'}
              </p>
              {allocations < 3 && (
                <button className="vending__demand vending__demand--ledger" onClick={allocate}>
                  CONFIRM ALLOCATION ({allocations + 1} / 3)
                </button>
              )}
            </div>
          ) : (
            <>
              {mediation !== null && (
                <div className="vending__mediation" key={mediation.id}>
                  <Microlabel signal>COMPARTMENT {mediationIndex + 1} / {MEDIATIONS.length}</Microlabel>
                  <p className="vending__term">{mediation.term}</p>
                  <p className="vending__medline">{mediation.line}</p>
                </div>
              )}
              {returned && (
                <div className="vending__return">
                  <div className="vending__can" ref={canRef}>
                    <span>A1</span>
                    <ul>
                      {MEDIATIONS.map((m) => (
                        <li key={m.id}>{m.term}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="vending__returnline">{DISPLAY_LINES.returned}</p>
                </div>
              )}
            </>
          )}
        </div>

        <button className="vending__demand" onClick={demand} disabled={dispensing}>
          JUST GIVE ME THE DRINK
        </button>

        <div className="vending__grille" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function VendButton({
  label,
  price,
  active,
  disabled,
  onSelect,
}: {
  label: string
  price: string
  active: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const props = usePressable({ sfx: false, disabled })
  return (
    <button className={`vending__drink${active ? ' is-selected' : ''}`} {...props} onClick={onSelect} disabled={disabled}>
      <span className="vending__drinklabel">{label}</span>
      <span className="vending__drinkprice">{price}</span>
    </button>
  )
}
