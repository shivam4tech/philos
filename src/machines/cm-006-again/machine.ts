/**
 * CM-006 — the recorded life (pure data + deterministic replay).
 */

export interface LifeScene {
  id: string
  moment: string
  detail: string
  choices: { id: string; label: string }[]
}

export interface LifeOutcome {
  sceneId: string
  choiceId: string
  line: string
}

export const SCENES: LifeScene[] = [
  {
    id: 'morning',
    moment: 'MORNING',
    detail: 'THE DAY BEGINS, UNASKED.',
    choices: [
      { id: 'rise', label: 'RISE' },
      { id: 'lie', label: 'LIE THERE' },
    ],
  },
  {
    id: 'message',
    moment: 'A MESSAGE ARRIVES',
    detail: 'FROM SOMEONE YOU OWE WORDS.',
    choices: [
      { id: 'reply', label: 'REPLY NOW' },
      { id: 'delay', label: 'DELAY' },
    ],
  },
  {
    id: 'breakfast',
    moment: 'BREAKFAST',
    detail: 'THE BODY REQUESTS ATTENTION.',
    choices: [
      { id: 'proper', label: 'EAT PROPERLY' },
      { id: 'coffee', label: 'COFFEE ONLY' },
      { id: 'forget', label: 'FORGET' },
    ],
  },
  {
    id: 'street',
    moment: 'THE STREET',
    detail: 'TWO ROUTES TO THE SAME PLACE.',
    choices: [
      { id: 'long', label: 'THE LONG WAY' },
      { id: 'short', label: 'THE SHORT WAY' },
    ],
  },
  {
    id: 'colleague',
    moment: 'A COLLEAGUE SPEAKS',
    detail: 'THE CLAIM IS WRONG AND YOU BOTH KNOW IT.',
    choices: [
      { id: 'speak', label: 'SPEAK' },
      { id: 'silent', label: 'SAY NOTHING' },
    ],
  },
  {
    id: 'lie',
    moment: 'A CONVENIENT UNTRUTH',
    detail: 'NO ONE WOULD CHECK.',
    choices: [
      { id: 'lie', label: 'LIE' },
      { id: 'truth', label: 'THE TRUTH, AWKWARDLY' },
    ],
  },
  {
    id: 'risk',
    moment: 'AN UNTESTED PATH',
    detail: 'IT COULD COST THE AFTERNOON. IT COULD COST MORE.',
    choices: [
      { id: 'risk', label: 'TAKE IT' },
      { id: 'keep', label: 'KEEP WHAT IS YOURS' },
    ],
  },
  {
    id: 'evening',
    moment: 'EVENING',
    detail: 'THERE IS STILL LIGHT OF A KIND.',
    choices: [
      { id: 'sky', label: 'LOOK AT THE SKY' },
      { id: 'screen', label: 'LOOK AT THE SCREEN' },
    ],
  },
  {
    id: 'sorrow',
    moment: 'A FRIEND SPEAKS OF SORROW',
    detail: 'THE SORROW IS NOT YOURS. THE MOMENT IS.',
    choices: [
      { id: 'listen', label: 'LISTEN FULLY' },
      { id: 'nod', label: 'NOD ALONG' },
      { id: 'leave', label: 'LEAVE' },
    ],
  },
  {
    id: 'desire',
    moment: 'AN OLD DESIRE RETURNS',
    detail: 'IT HAS BEEN WAITING. IT IS PATIENT.',
    choices: [
      { id: 'ignore', label: 'IGNORE IT' },
      { id: 'indulge', label: 'INDULGE IT' },
      { id: 'examine', label: 'EXAMINE IT' },
    ],
  },
  {
    id: 'night',
    moment: 'NIGHT',
    detail: 'THE BODY FILES ITS COMPLAINT.',
    choices: [
      { id: 'sleep', label: 'SLEEP' },
      { id: 'notyet', label: 'NOT YET' },
    ],
  },
  {
    id: 'door',
    moment: 'THE DOOR',
    detail: 'BEHIND YOU: THE DAY. AHEAD: THE SAME ARRANGEMENT, GENERALLY.',
    choices: [
      { id: 'return', label: 'RETURN' },
      { id: 'leave', label: 'LEAVE' },
    ],
  },
]

/** Deterministic outcome lines — the same choice always yields the same line. */
export const OUTCOMES: Record<string, string> = {
  'morning:rise': 'YOU RISE. THE ROOM IS EXACTLY AS LEFT.',
  'morning:lie': 'YOU LIE THERE. TIME PASSES ANYWAY.',
  'message:reply': 'YOU REPLY. THE REPLY IS SHORTER THAN THE SILENCE WAS.',
  'message:delay': 'YOU DELAY. THE MESSAGE WAITS WITH PATIENCE THAT ACCUSES.',
  'breakfast:proper': 'YOU EAT PROPERLY. NOTHING CHANGES, SLOWLY.',
  'breakfast:coffee': 'COFFEE ONLY. THE MORNING AGREES TO PROCEED.',
  'breakfast:forget': 'YOU FORGET. THE BODY FILES A COMPLAINT FOR LATER.',
  'street:long': 'THE LONG WAY. YOU SEE A YARD YOU WILL NEVER ENTER AGAIN.',
  'street:short': 'THE SHORT WAY. YOU ARRIVE WITH MINUTES YOU DO NOT USE.',
  'colleague:speak': 'YOU SPEAK. THE ROOM ADJUSTS. NO ONE THANKS YOU.',
  'colleague:silent': 'YOU SAY NOTHING. THE WRONG CLAIM SETTLES IN, COMFORTABLE.',
  'lie:lie': 'YOU LIE. IT WORKS, WHICH IS NOT THE SAME AS BEING FINE.',
  'lie:truth': 'THE TRUTH, AWKWARDLY. THE MOMENT BREAKS AND RESETS, HONESTLY.',
  'risk:risk': 'YOU TAKE IT. THE AFTERNOON IS SPENT. SOMETHING OPENS.',
  'risk:keep': 'YOU KEEP WHAT IS YOURS. THE PATH CLOSES WITHOUT SOUND.',
  'evening:sky': 'YOU LOOK AT THE SKY. THE SKY DOES NOT LOOK BACK, AND IT IS ENOUGH.',
  'evening:screen': 'YOU LOOK AT THE SCREEN. THE SCREEN LOOKS BACK. IT ALWAYS DOES.',
  'sorrow:listen': 'YOU LISTEN FULLY. THE LISTENING COSTS SOMETHING AND GIVES SOMETHING.',
  'sorrow:nod': 'YOU NOD ALONG. THE SORROW CONTINUES WITHOUT YOU.',
  'sorrow:leave': 'YOU LEAVE. THE LEAVING IS QUIETER THAN EXPECTED.',
  'desire:ignore': 'YOU IGNORE IT. IT FILES ITSELF UNDER LATER.',
  'desire:indulge': 'YOU INDULGE IT. RELIEF ARRIVES, STAYS BRIEFLY, LEAVES.',
  'desire:examine': 'YOU EXAMINE IT. IT IS SMALLER IN DAYLIGHT. IT IS STILL THERE.',
  'night:sleep': 'YOU SLEEP. THE DAY CLOSES WITHOUT COMMENT.',
  'night:notyet': 'NOT YET. THE HOURS BORROW THEMSELVES FROM TOMORROW.',
  'door:return': 'YOU RETURN. THE DOOR KNOWS YOU.',
  'door:leave': 'YOU LEAVE. THE ARRANGEMENT CONTINUES GENERALLY.',
}

export function outcomeFor(sceneId: string, choiceId: string): string {
  return OUTCOMES[`${sceneId}:${choiceId}`] ?? 'THE MOMENT PASSES.'
}

/** Verdict + replay annotations, deterministic per replay count. */
export const VERDICT = {
  completed: 'THIS LIFE HAS COMPLETED.',
  question: 'WOULD YOU WILL THIS SEQUENCE AGAIN, WITHOUT ALTERATION?',
  again: ['IT HAS RETURNED.', 'IDENTICAL.'],
  refused: ['THE SEQUENCE IS REFUSED.', 'IT HAS ALREADY OCCURRED.', 'THE REFUSAL IS PART OF IT.'],
}

export function replayAnnotations(replayCount: number): string[] {
  switch (replayCount) {
    case 1:
      return [
        'THE SAME COFFEE. YOU DID NOT NOTICE THE CUP THE FIRST TIME.',
        'THE LONG WAY PASSED THE SAME YARD.',
        'THE SORROW NODDED AT EXACTLY THE SAME WORD.',
      ]
    case 2:
      return [
        'YOU HESITATED FOR 0.4 SECONDS BEFORE THE SAME CHOICE.',
        'THE SKY WAS THIS EXACT SHADE OF UNREMARKABLE.',
        'NOTHING DEVIATES. THE DEVIATION WAS THE HOPE.',
      ]
    default:
      return [
        'THE SEQUENCE DOES NOT WEAR OUT.',
        'IDENTICAL, INCLUDING YOUR ATTENTION.',
      ]
  }
}
