/**
 * CM-008 — private ostension episodes and the criterion-collapse dialogue.
 */

export interface SensationEpisode {
  id: string
  /** the sign for the private sensation */
  sign: string
  context: string
  /** whether the sensation genuinely recurs (known to the machine, not the user) */
  sameAsFirst: boolean
}

export const SIGN = '△Q7'

export const EPISODES: SensationEpisode[] = [
  { id: 's1', sign: SIGN, context: 'AFTER A LOUD NOISE STOPS', sameAsFirst: true },
  { id: 's2', sign: SIGN, context: 'IN A ROOM THAT SMELLS OF RAIN', sameAsFirst: true },
  { id: 's3', sign: SIGN, context: 'AFTER SOMETHING SWEET', sameAsFirst: false },
  { id: 's4', sign: SIGN, context: 'WHEN THE LIGHT FAILS LATE IN THE DAY', sameAsFirst: true },
  { id: 's5', sign: SIGN, context: 'WITH NO CAUSE YOU CAN NAME', sameAsFirst: true },
  { id: 's6', sign: SIGN, context: 'AFTER A LONG WALK', sameAsFirst: false },
]

export const CRITERION_CHALLENGES = [
  {
    prompt: 'BY WHAT CRITERION DO YOU JUDGE THIS EPISODE THE SAME?',
    options: [
      {
        id: 'seems',
        label: 'IT SEEMS THE SAME',
        response:
          'IF WHATEVER SEEMS RIGHT IS RIGHT, THE DISTINCTION BETWEEN “RIGHT” AND “SEEMS RIGHT” HAS COLLAPSED. TRY AGAIN.',
        accepted: false,
      },
      {
        id: 'memory',
        label: 'I REMEMBER THE FIRST ONE',
        response:
          'A MEMORY IMAGE CANNOT CARRY ITS OWN CORRECTNESS. WHAT CHECKS THE MEMORY? TRY AGAIN.',
        accepted: false,
      },
      {
        id: 'table',
        label: 'IT TAKES TABLE SALT WITHOUT PROTEST',
        response:
          'A CHECK THAT COULD IN PRINCIPLE BE PERFORMED AGAIN, BY ANYONE. THE CRITERION IS ADMITTED. NOTE WHAT HAS HAPPENED: IT IS PRACTICE NOW.',
        accepted: true,
      },
    ],
  },
]

export const USE_EXERCISES = [
  {
    prompt: 'ANOTHER (SIMULATED PARTICIPANT M.) WRITES “△Q7” AFTER A LOUD NOISE STOPS. CORRECT USE?',
    options: [
      { id: 'correct', label: 'CORRECT', response: 'THE USE IS ACKNOWLEDGED. THE RULE NOW LIVES IN TWO PRACTICES.' },
      { id: 'wrong', label: 'INCORRECT', response: 'ON WHAT GROUND? THE GROUND, WHEN YOU LOOK AT IT, IS USE. YOURS AND THEIRS.' },
    ],
  },
  {
    prompt: 'M. WRITES “△Q7” FOR THE TASTE OF PEACHES. CORRECT USE?',
    options: [
      { id: 'wrong', label: 'INCORRECT', response: 'AGREED — BY A RULE THE TWO OF YOU NOW HOLD IN COMMON. THAT IS WHAT AGREEMENT MEANS HERE.' },
      { id: 'correct', label: 'CORRECT', response: 'THEN THE SIGN HAS NO DISCRIMINATION. M. AND YOU AGREE SO FAR THAT NOTHING IS SAID.' },
    ],
  },
]

export const LINES = {
  intro: 'YOU CURRENTLY EXPERIENCE:',
  fixInstruction: 'CONCENTRATE. HOLD THE SENSATION. FIX THE SIGN TO IT.',
  fixed: 'THE SIGN IS FIXED TO THE SENSATION. NOTEBOOK ENTRY SAVED. THE SIGN HAS NO USE YET.',
  privateAttempt: 'THE SENSATION IS YOURS. THE SIGN, SO FAR, IS PRIVATE.',
  criteriaEstablished: 'THE SYMBOL HAS BECOME A WORD. ITS CORRECTNESS NOW LIVES IN PRACTICE.',
  refusal: 'KEPT PRIVATE. WHATEVER SEEMS RIGHT WILL BE RIGHT. THE NOTEBOOK IS NOW A RECORD OF SEEMINGS.',
  chainDone: 'THE RULE IS A CHAIN OF FURTHER RULES. THE PRACTICE HOLDS ANYWAY. THAT IS THE TENSION, FILED.',
}

/* Wittgenstein × Derrida: each stabilizing rule spawns further distinctions */
export const CHAIN_QUESTIONS = [
  {
    question: 'WHAT COUNTS AS “AFTER” THE NOISE? IMMEDIATELY? WITHIN A MINUTE?',
    options: ['WITHIN SECONDS', 'WITHIN THE HOUR', 'THE TEMPORAL BORDER IS THE RULE’S PROBLEM'],
  },
  {
    question: 'HOW LOUD MUST THE NOISE HAVE BEEN? THRESHOLDS ARE YOURS TO SET.',
    options: ['LOUD ENOUGH TO FLINCH', 'LOUD ENOUGH TO NOTICE', 'THE THRESHOLD SHIFTS WITH USE'],
  },
  {
    question: 'DOES THE RAIN-SMELL CASE COUNT AS THE SAME CONTEXT, OR A NEIGHBORING ONE?',
    options: ['SAME CONTEXT', 'NEIGHBORING CONTEXT', 'CONTEXTS NEST WITHOUT END'],
  },
  {
    question: 'M. USES △Q7 IN A CASE YOU NEVER SETTLED. WHAT NOW?',
    options: ['THE USE FAILS', 'THE USE EXTENDS THE RULE', 'THE RULE WAS ALWAYS THIS OPEN'],
  },
]
