import { useState } from 'react'

import { exportResearchRecord, importResearchRecord, resetResearchRecord, useRecord } from '@/state/record'
import { downloadRecordJson } from '@/state/persistence'
import { bumpMetric, pushTicker } from '@/state/lab'
import { institution } from '@/institution/engine'
import { audio } from '@/audio/engine'
import { Btn } from './ui'
import './recorddata.css'

/** Export / import / reset controls — shared by Settings and the Record page. */
export function RecordDataControls() {
  const record = useRecord()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [importState, setImportState] = useState<string | null>(null)

  const doExport = () => {
    const text = exportResearchRecord()
    const stamp = new Date().toISOString().slice(0, 10)
    downloadRecordJson(`research-record-${stamp}.json`, text)
    audio.play('unlock')
    pushTicker('RESEARCH RECORD EXPORTED. THE FILE IS A COPY. THE INSTITUTE KEEPS THE ORIGINAL.')
  }

  const doImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = importResearchRecord(String(reader.result))
      setImportState(result.ok ? 'RECORD IMPORTED. CONTINUITY RESTORED.' : result.reason)
      audio.play(result.ok ? 'unlock' : 'invalid')
    }
    reader.readAsText(file)
  }

  const doReset = () => {
    resetResearchRecord()
    setConfirmingReset(false)
    bumpMetric('resets')
    audio.play('reset')
    const message = institution.emit('reset')
    if (message) pushTicker(message)
  }

  return (
    <div className="recorddata">
      <div className="recorddata__actions">
        <Btn onClick={doExport}>EXPORT RECORD</Btn>
        <label className="recorddata__import">
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) doImport(file)
              e.target.value = ''
            }}
          />
          IMPORT RECORD
        </label>
        {!confirmingReset ? (
          <Btn variant="danger" onClick={() => setConfirmingReset(true)}>
            RESET RESEARCH RECORD
          </Btn>
        ) : (
          <span className="recorddata__confirm">
            <span>ERASE ALL RESEARCH DATA? {record.counters.sessions} SESSIONS ON FILE.</span>
            <Btn variant="danger" onClick={doReset}>
              CONFIRM ERASURE
            </Btn>
            <Btn variant="ghost" onClick={() => setConfirmingReset(false)}>
              CANCEL
            </Btn>
          </span>
        )}
      </div>
      {importState && <p className="recorddata__state">{importState}</p>}
    </div>
  )
}
