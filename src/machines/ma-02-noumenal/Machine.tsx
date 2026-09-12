import { useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import { MAX_INSPECTIONS, REPRESENTATIONS, WITHHELD } from './machine'
import './noumenal.css'

export default function Machine() {
  const api = useMachine()
  const [depth, setDepth] = useState(0)
  const [inspectorClicks, setInspectorClicks] = useState(0)
  const [completed, setCompleted] = useState(false)

  const inspect = () => {
    if (completed) return
    const next = depth + 1
    setDepth(next)
    api.play('semantic-shift', 0.5)
    if (next >= MAX_INSPECTIONS) {
      window.setTimeout(() => {
        setCompleted(true)
        api.play('complete', 0.5)
        api.complete('noumenal:inspection-withheld')
      }, 900)
    }
  }

  const inspectInspector = () => {
    const clicks = inspectorClicks + 1
    setInspectorClicks(clicks)
    api.play('tick', 0.4)
    if (clicks === 3) {
      api.secret('inspected-inspector', 'UR-016', 'INSPECTED INSPECTOR')
    }
  }

  return (
    <div className="noumenal">
      <header className="noumenal__head">
        <button className="noumenal__title" onClick={inspectInspector}>
          NOUMENAL INSPECTOR
        </button>
        <Microlabel>MINOR APPARATUS MA-02 — RAW-OBJECT PANE</Microlabel>
      </header>

      <div className="noumenal__stack">
        {REPRESENTATIONS.slice(0, depth).map((rep, i) => (
          <div key={i} className="noumenal__pane" style={{ marginLeft: i * 12 }}>
            <span className="noumenal__panetag">&lt;representation n={i + 1}&gt;</span>
            <p className="noumenal__panetext">{rep}</p>
            {i === depth - 1 && !completed && (
              <div className="noumenal__beneath">
                <span className="noumenal__panetag">&lt;pane beneath&gt;</span>
                <Btn onClick={inspect}>INSPECT RAW OBJECT</Btn>
              </div>
            )}
          </div>
        ))}
        {depth === 0 && (
          <div className="noumenal__pane">
            <span className="noumenal__panetag">&lt;raw-object-pane closed&gt;</span>
            <p className="noumenal__panetext">
              AN OBJECT IS PRESENT. IT IS GIVEN UNDER CONDITIONS. THE INSPECTOR CLAIMS IT CAN LOOK BENEATH THEM.
            </p>
            <Btn variant="primary" onClick={inspect}>
              INSPECT RAW OBJECT
            </Btn>
          </div>
        )}
      </div>

      {completed && <p className="noumenal__verdict">{WITHHELD}</p>}
    </div>
  )
}
