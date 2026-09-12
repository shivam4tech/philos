import type { TextualApparatus } from '@/archive/content'
import { Microlabel } from './ui'
import './textualapparatus.css'

const SECTIONS: Array<{
  key: keyof Pick<
    TextualApparatus,
    | 'primarySource'
    | 'conceptualProblem'
    | 'whatTheMachineDid'
    | 'whatTheMachineDistorted'
    | 'whyDistortionMatters'
    | 'competingReading'
    | 'questionsForTheText'
    | 'implementationNotes'
  >
  index: string
  title: string
  isArray?: boolean
}> = [
  { key: 'primarySource', index: '01', title: 'PRIMARY SOURCE', isArray: true },
  { key: 'conceptualProblem', index: '02', title: 'CONCEPTUAL PROBLEM' },
  { key: 'whatTheMachineDid', index: '03', title: 'WHAT THE MACHINE DID' },
  { key: 'whatTheMachineDistorted', index: '04', title: 'WHAT THE MACHINE DISTORTED' },
  { key: 'whyDistortionMatters', index: '05', title: 'WHY THAT DISTORTION MATTERS' },
  { key: 'competingReading', index: '06', title: 'COMPETING READING' },
  { key: 'questionsForTheText', index: '07', title: 'QUESTIONS TO TAKE BACK TO THE TEXT', isArray: true },
  { key: 'implementationNotes', index: '08', title: 'IMPLEMENTATION NOTES' },
]

/**
 * The scholarly layer. Pre-completion, sections 03–08 are sealed: the
 * apparatus must be operated before its interpretation is released.
 */
export function TextualApparatusView({
  content,
  sealed,
  title,
}: {
  content: TextualApparatus
  sealed: boolean
  title: string
}) {
  return (
    <div className="apparatus-text">
      <header className="apparatus-text__head">
        <Microlabel>Textual apparatus — {title}</Microlabel>
        {sealed && (
          <p className="apparatus-text__sealed">
            DOCUMENTATION SEALED. SECTIONS 03–08 ARE RELEASED AFTER AN OBSERVED SESSION.
          </p>
        )}
      </header>
      {SECTIONS.map((section) => {
        const value = content[section.key]
        const isArray = section.isArray
        const filled = isArray ? (value as string[]).length > 0 : (value as string) !== ''
        if (!filled) return null
        const isLocked = sealed && Number(section.index) >= 3
        return (
          <section key={section.key} className={`apparatus-text__section${isLocked ? ' is-sealed' : ''}`}>
            <h3 className="apparatus-text__sectiontitle">
              <span className="apparatus-text__index">{section.index}</span> {section.title}
            </h3>
            {isLocked ? (
              <p className="apparatus-text__locked">SECTION SEALED UNTIL FIRST OBSERVED SESSION.</p>
            ) : isArray ? (
              <ul className="apparatus-text__list">
                {(value as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="apparatus-text__body">{value as string}</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
