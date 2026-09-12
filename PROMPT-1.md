You are the lead engineer, interaction designer, game designer, sound designer, and product architect for a complete browser-based project called:

# CONCEPTUAL MACHINES LAB

### Institute for Applied Metaphysics

Build the complete working application, not a mockup, wireframe, landing page, or prototype.

The central idea is:

> Philosophy should be experienced as executable conceptual machinery rather than presented as inspirational content.

This must NOT resemble:

* a philosophy blog
* a quote website
* a course website
* a “Which philosopher are you?” quiz
* a generic edtech platform
* a collection of summaries
* AI-generated chatbot philosophy
* gamified flashcards
* a childish educational game

It should feel like an unusual high-quality indie browser game, interactive art installation, fictional laboratory, and philosophical archive combined.

The audience includes people who actually read philosophy.

The philosophical layer therefore needs to be based on primary texts, distinctions, arguments, problems, and scholarly interpretations rather than simplified “Nietzsche says be yourself” material.

There must be absolutely NO runtime dependency on:

* OpenAI
* Anthropic
* Gemini
* local LLMs
* external AI inference
* paid APIs
* generative AI services

Everything should work deterministically through authored logic, procedural systems, state machines, local content, browser APIs, and prewritten philosophical material.

The finished application must be capable of being deployed as a normal static/web application.

---

# 1. AUTONOMOUS EXECUTION RULE

Do not stop after scaffolding.

Do not ask me to complete TODOs.

Do not leave placeholder screens.

Do not produce “Phase 2 ideas” instead of implementing them.

Work through the complete product.

You may:

* install appropriate open-source packages
* restructure the repository
* create components
* create local assets
* create procedural effects
* implement Web Audio systems
* add tests
* add scripts
* create data files
* refactor aggressively when justified

If this repository already contains an application, inspect it first and preserve useful architecture rather than unnecessarily starting over.

Make sensible technical decisions independently.

At the end there should be a polished product I can actually launch and interact with.

---

# 2. PRODUCT FANTASY

The visitor has discovered a strange institution.

The institution contains experimental apparatuses designed to instantiate philosophical problems.

The laboratory may or may not be legitimate.

Its tone should move between:

* academic seriousness
* institutional bureaucracy
* cosmic absurdity
* dry humor
* technological eeriness
* philosophical unease

Do NOT make everything a joke.

Some machines can be funny.

Some should become genuinely strange, contemplative, frustrating, beautiful, or disturbing.

Think of the difference between:

“Funny philosophy website”

and:

“Someone built a secret laboratory in which philosophical arguments have been turned into machines.”

We want the second.

---

# 3. VISUAL IDENTITY

Create a sophisticated original identity.

Possible aesthetic mixture:

* obscure scientific laboratory
* university basement computer terminal
* 1970s research institute
* contemporary experimental game UI
* CRT instrumentation without going full retro cliché
* museum/archive metadata
* brutalist control systems
* dark modern interfaces
* technical diagrams
* archival labels
* restrained glitch effects
* strange machinery

Avoid excessive:

* neon cyberpunk
* gradients everywhere
* glassmorphism
* generic SaaS cards
* giant rounded rectangles
* stock illustrations
* fake terminal interfaces covering everything

The site should still feel contemporary and premium.

Typography should support hierarchy such as:

INSTITUTE FOR APPLIED METAPHYSICS

APPARATUS CM-004

BROKEN TOOL

OPERATIONAL STATUS:
UNFORTUNATELY FUNCTIONING

Make the fictional institutional language part of the experience.

---

# 4. SITE STRUCTURE

Build the following major areas.

## A. ENTRANCE

The initial page should feel like entering the institution.

Do not immediately dump a dashboard.

Possible sequence:

institution mark

CONCEPTUAL MACHINES LAB

[ ENTER FACILITY ]

When pressed:

* subtle environmental audio begins only after user interaction
* interface wakes up
* laboratory lights/systems activate
* navigation becomes accessible

Respect browser autoplay rules.

Include a clearly accessible mute option.

---

## B. MACHINE CATALOGUE

Main catalogue presents apparatuses like research equipment rather than content cards.

Each machine has:

* code
* title
* philosophical source
* conceptual subject
* operational status
* estimated interaction duration
* discovered/not-discovered state

Example:

CM-003
THE WILL ENGINE

SOURCE:
Schopenhauer

SYSTEM:
Desire / Satisfaction / Boredom

STATUS:
Operational

SESSION:
4–8 min

Avoid Netflix-style thumbnail grids.

Experiment with:

* laboratory directory
* wall of instruments
* schematic map
* file drawers
* terminals
* equipment racks

But keep navigation understandable.

---

## C. MACHINE VIEW

Every philosophical machine gets a full-screen or near-full-screen experiential environment.

Remove unnecessary global UI while inside.

The user should feel that they have entered an apparatus.

Provide discreet:

* exit
* mute
* reset
* accessibility
* textual apparatus controls

Do not clutter the experiment.

---

## D. TEXTUAL APPARATUS

Every completed experiment exposes a deeper scholarly layer.

Use sections:

PRIMARY TEXT
MACHINE THESIS
WHAT WAS OPERATIONALIZED
WHAT WAS NOT OPERATIONALIZED
INTERPRETIVE PROBLEM
ALTERNATIVE READING
IMPLEMENTATION NOTE
REFERENCES

Use primary-text references rather than large copied passages.

Example:

Nietzsche
Die fröhliche Wissenschaft §341

Heidegger
Sein und Zeit §§15–16

Wittgenstein
Philosophische Untersuchungen §§243 onward

Use precise references where reasonably confident.

Do not fabricate quotations.

If using direct quotations, keep them brief and clearly sourced.

The textual apparatus should be serious enough that someone familiar with the text does not feel patronized.

---

# 5. GAME-FEEL SYSTEM

Create a reusable interaction engine used across the whole project.

The website should have the tactile responsiveness of a small game.

Implement:

## pointer response

* hover attraction where appropriate
* physical button depression
* resistance
* inertia
* subtle overshoot
* draggable objects
* cursor-dependent sound spatialization where useful

## motion

* spring transitions
* controlled easing
* mechanical transitions
* deliberate latency when philosophically meaningful
* tiny impact effects
* occasional screen shake only where appropriate

## environmental state

* machinery hum
* interference
* distant clicks
* electrical noises
* terminal chirps
* room ambience
* machinery startup/shutdown

## responsive audio

Interactions should generate different sounds depending on:

* click
* failure
* contradiction
* achievement
* machine state
* hover
* unlock
* reset
* environmental state

Do not create obnoxious arcade sound spam.

Sound should be restrained and atmospheric.

---

# 6. AUDIO ARCHITECTURE

Prefer browser-native Web Audio API for procedural effects where feasible.

You may create:

* oscillator-based UI tones
* low-frequency machinery hum
* filtered noise
* electrical pulses
* delay/reverb effects
* procedural clicks
* generative ambience

If local prerecorded audio is required, use only properly redistributable assets and document their license.

Avoid requiring network-loaded sound assets where possible.

Create an AudioManager / SoundEngine abstraction.

Support:

* master volume
* ambience volume
* interaction volume
* mute
* reduced sensory mode
* persisted preference

Audio must not start before user interaction.

---

# 7. GLOBAL PERSISTENCE

Use local persistence.

No account required.

Store:

* machines entered
* machines completed
* unusual outcomes discovered
* interpretation variants completed
* contamination effects unlocked
* total resets
* hidden discoveries
* sound preference
* accessibility preferences

Do not turn these into XP.

Use institutional terminology.

Example:

RESEARCH RECORD

Apparatuses observed: 7/12
Contradictions produced: 41
Unresolved phenomena: 3
Unauthorized states: 1

---

# 8. THE MOST IMPORTANT GLOBAL MECHANIC:

# CONTAMINATION

Completing philosophical machines should alter the laboratory itself.

This is fundamental.

The shell of the website gradually becomes philosophically unstable.

Examples:

After Heidegger:
occasionally a normal interface tool stops working and becomes conspicuous.

After Derrida:
certain definitions become clickable chains of further definitions.

After Nietzsche:
a previously encountered laboratory sequence may repeat exactly.

After Lacan:
the search field occasionally changes:
SEARCH
→ WHAT ARE YOU LOOKING FOR?
→ WHAT DO YOU EXPECT TO FIND?
→ WHO DO YOU EXPECT TO FIND IT FOR?

After Foucault:
the system begins revealing analytics about the visitor’s own behavior.

After Schopenhauer:
completion creates another institutional request.

After Hegel:
contradictory states become navigational transitions.

These effects should be infrequent enough to remain surprising.

Build a central contamination engine with:

* unlock conditions
* probabilities
* cooldowns
* route applicability
* persistence

Users should eventually wonder:

“Am I currently inside a machine?”

That is desirable.

---

# 9. BUILD THESE INITIAL MACHINES

Implement ALL of the following as actual interactive experiences.

Do not replace them with explanatory pages.

---

# CM-001 — THE WILL ENGINE

## Schopenhauer

Primary conceptual material:

* striving
* suffering
* satisfaction
* boredom
* re-emergence of desire

Interaction:

Create an idle/clicker-like system.

The user initially sees one need.

Example:

HUNGER
[ SATISFY ]

Satisfying it creates temporary relief.

Then another need appears.

Then more.

Food.
Comfort.
Recognition.
Security.
Novelty.
Possession.
Attention.
Meaning.
Escape.
Etc.

A satisfaction meter rises briefly and then decays.

The user discovers:

pain → striving → attainment → temporary relief → boredom → renewed striving

As progression continues, needs become more abstract.

The interface gets more elaborate.

Eventually the system becomes absurdly productive at generating wants.

Provide an obvious-looking:

[ END SESSION ]

Clicking it produces:

NEW DESIRE DETECTED:
DESIRE TO STOP DESIRING

Eventually allow a real cessation state only through a non-obvious interaction involving refraining from engagement for a period.

Do not simplify this into “Schopenhauer says desire bad.”

Textual apparatus should explain what has been operationalized and limitations of the model.

---

# CM-002 — DESIRE VERIFICATION TERMINAL

## Lacan

A CAPTCHA-inspired machine.

Opening:

VERIFY THAT YOUR DESIRE IS YOUR OWN.

Exercises include things such as:

SELECT ALL SQUARES CONTAINING WHAT YOU WANT.

Images/symbols shift as the cursor approaches.

Another:

WHAT DO YOU THINK THE OTHER WANTS YOU TO WANT?

Another:

IDENTIFY THE MISSING OBJECT.

The supposedly correct object continually becomes displaced.

Eventually the system starts distinguishing:

* need
* demand
* desire

The user should never receive a simplistic psychological diagnosis.

No personality test.

No fake psychoanalysis.

Mechanically evoke:

* lack
* displacement
* demand
* the Other
* objet petit a

Finish with something like:

VERIFICATION INCOMPLETE.
DESIRE REMAINS OPERATIONAL.

---

# CM-003 — DIALECTICAL VENDING UNIT

## Hegel

The user approaches a mundane vending machine.

They select a drink.

Instead of dispensing it immediately, the machine exposes mediations necessary for the supposedly immediate object.

User:
COKE

Machine:
IMMEDIATE REQUEST DETECTED

Then contradictions and dependencies emerge:
commodity
currency
recognition
production
distribution
property
machine-user relation
etc.

Avoid turning Hegel into the meme:

thesis → antithesis → synthesis

Do not use that schema as the central mechanic.

Design state transitions around:

* immediacy
* mediation
* determinate negation
* contradiction
* transformed return

The user repeatedly attempts:

JUST GIVE ME THE DRINK.

Eventually they discover their own request is now one component of the machine.

The final object may eventually dispense.

But it should no longer appear “immediate.”

---

# CM-004 — BROKEN TOOL

## Heidegger

Start with the cleanest and most transparent interface in the whole application.

Give user an ordinary practical task.

Perhaps organize several objects using tools.

Everything works effortlessly.

Do not mention Heidegger.

Gradually:

* drag handle catches
* cursor behaves strangely
* control fails
* button becomes unresponsive
* scrollbar gets stuck
* tooltips expose component names
* interface elements become visually conspicuous

The user becomes aware of things previously encountered transparently through use.

Build the experience around breakdown revealing equipment.

After the machine finishes, show:

THE EQUIPMENT HAS BECOME AN OBJECT.

Textual apparatus:
Being and Time §§15–16.

Treat ready-to-hand / present-at-hand carefully and avoid saying they simply mean “useful vs useless.”

---

# CM-005 — BRACKET

## Husserl

Begin with one ordinary object.

Use something visually simple:
chair
cup
lamp
table

Opening:

CHAIR

Button:

[ BRACKET ]

Repeated bracketing peels layers of assumptions and modes of givenness.

Separate interactive layers such as:

* asserted existence
* visual profile
* unseen sides
* horizon
* temporal retention
* protention
* bodily orientation
* perspective
* identity across changing appearances

Let the user rotate/change viewpoint.

The chair is never given from all profiles simultaneously.

Make this a phenomenological debugging console.

Do not frame epoché as simply “doubting whether the chair exists.”

Make that explicit in textual apparatus.

---

# CM-006 — AGAIN

## Nietzsche

Create a compact life-choice loop lasting perhaps 3–5 minutes.

Use mundane decisions rather than epic morality:
reply
delay
eat
walk
speak
lie
risk
ignore
look
leave
return

Store every action.

At the end:

THIS LIFE HAS COMPLETED.

WOULD YOU WILL THIS SEQUENCE AGAIN,
WITHOUT ALTERATION?

[ AGAIN ]
[ REFUSE ]

If AGAIN:
repeat exactly.

However:
subtle details become more noticeable.

Do not introduce a conventional “better ending.”

The user may start intentionally composing actions they would accept recurring.

Include interpretive modes in textual apparatus:

* cosmological reading
* existential/ethical reading
* selective/transformative reading

Reference The Gay Science §341.

Do not dictate one interpretation as unquestionably correct.

---

# CM-007 — NO WINDOWS

## Leibniz

Create a simulated social room populated by monads.

No monad directly reads another monad's internal state.

Yet their states evolve in perfect correspondence.

Visually show:
MONAD A
MONAD B
MONAD C

Each has an internal sequence.

Allow the user to intervene in one.

The others appear to respond, despite the system revealing:

CAUSAL CHANNELS:
0

Introduce a humorous social-feed layer where apparent conversation proceeds despite no direct transmission.

Use this to embody:

* windowlessness
* internal principle of change
* pre-established harmony

Do not caricature Leibniz merely as “everything predetermined.”

---

# CM-008 — PRIVATE ROOM

## Wittgenstein

Construct a mini multiplayer-like illusion locally with simulated participants.

No actual backend multiplayer required.

Each participant receives an apparently private symbol for an inner sensation.

Example:

YOU CURRENTLY EXPERIENCE:
△Q7

The player attempts to teach the system how the symbol should be used.

But any workable correctness criterion necessarily becomes public through rule-governed use.

Gradually the allegedly private language transforms into shared practice.

Focus on the philosophical problem around private ostensive definition and criteria.

Textual apparatus should reference Philosophical Investigations around §243 onward.

Do not turn this into “language is social” as a slogan.

---

# CM-009 — DIFFERENCE ENGINE

## Deleuze

One button:

[ REPEAT ]

Each repetition creates a subtly altered object.

The first twenty changes should be small.

Differences accumulate.

Eventually:

* categories emerge
* lineages form
* resemblance appears retrospectively
* identity becomes a statistical/artificial stabilization

Show a genealogy visualization.

Allow the user to choose a previous state and repeat from there.

No randomizer.

The action must always be called repetition.

Explore repetition producing difference rather than reproduction of identity.

---

# CM-010 — EXPENDITURE

## Bataille

Create a tiny economy.

The user accumulates surplus.

At first normal economic instincts work:
invest
save
expand productivity

Eventually production creates dangerous excess.

Storage capacity saturates.

The user must dispose of surplus.

Options emerge:
festival
monument
luxury
gift
spectacle
ritual
war
destruction
useless architecture

Give each expenditure different consequences.

Do NOT make “waste is good” the simplistic lesson.

Model tension around restricted vs general economy.

Reference The Accursed Share in textual apparatus.

---

# CM-011 — TERMS

## Derrida

Present terms and conditions.

[ ACCEPT ]

But important terms are clickable.

Click:
RESPONSIBILITY

Definition references:
INTENTION
SUBJECT
ACT
MEANING

Each definition opens further chains.

Definitions should sometimes modify earlier definitions.

Keep a graph of references.

The ACCEPT button gradually moves deeper into the semantic graph.

Do NOT reduce Derrida to:
“words have no meaning.”

Instead embody:

* differential relations
* deferral
* instability of closure
* dependence on traces/context

Eventually provide a completion event without pretending the semantic system reached ultimate grounding.

---

# CM-012 — OBSERVATION ROOM

## Foucault

Create a productivity/test interface.

Initially tell the user:

NO OBSERVER IS CURRENTLY PRESENT.

Let them complete mundane tasks.

Gradually show statistics:

Cursor hovered over EXIT: 2.4s

Time before compliance: 1.7s

Instruction deviations: 3

Self-corrections: 6

Predicted compliance: 72%

Do not claim actual external surveillance.

Use only local session behavior.

The point is that uncertainty regarding observation changes conduct.

Do not simplify Foucault into:
“being watched is scary.”

Textual apparatus should discuss disciplinary visibility, normalization, examination, and internalization of surveillance.

---

# 10. OPTIONAL SECRET MACHINE

Implement one hidden apparatus discoverable through unusual behavior.

Suggested:

CM-000
PARMENIDES MOTION TEST

The screen tells the user:

MOVE TO THE EXIT.

Arrow keys animate the world around the avatar, but mathematically the avatar's coordinates never change.

Add optional Zeno interference.

Keep it short and funny.

---

# 11. RESEARCH RECORD

Create a persistent personal research record.

Not a profile.

Not XP.

Example:

RESEARCH SUBJECT: UNREGISTERED

SESSIONS: 14
APPARATUSES COMPLETED: 8
FAILED VERIFICATIONS: 27
CONTRADICTIONS GENERATED: 11
RECURRENCES ACCEPTED: 3
UNAUTHORIZED SEMANTIC LOOPS: 1

The statistics should come from actual interactions.

---

# 12. ARCHIVE

Build an archive where users can browse machines intellectually.

Filters:

* thinker
* work
* concept
* mechanic
* completed/not completed

Do not expose major spoilers before machine completion.

Before completion:
minimal source metadata.

After completion:
full textual apparatus.

---

# 13. MACHINE DEPENDENCIES

Use a data-driven machine registry.

Each machine should declare roughly:

id
code
title
thinker
primaryWorks
concepts
duration
component
completionRules
contaminationUnlock
archiveContent
secretConditions
audioProfile

Do not hard-code the entire catalogue into one giant component.

---

# 14. STATE ARCHITECTURE

Separate:

global laboratory state

machine-local state

persistent research state

audio state

contamination state

accessibility settings

machine content metadata

Use clean typed models.

If React:
TypeScript mandatory.

State management can be lightweight.

Avoid unnecessary enterprise architecture.

---

# 15. ACCESSIBILITY

Game-like does not mean inaccessible.

Support:

* keyboard navigation
* visible focus
* reduced motion
* mute
* reduced sensory mode
* adequate contrast
* text scaling resilience
* semantic controls
* screen-reader labels where meaningful

Some philosophical interactions may intentionally frustrate expectations.

Do NOT make accessibility tools themselves part of the frustration.

---

# 16. MOBILE

Desktop is the richest version.

Mobile still needs to work properly.

Adapt machines appropriately.

Do not just shrink desktop layouts.

Touch interactions should be designed intentionally.

---

# 17. PERFORMANCE

Aim for smooth interaction on ordinary machines.

Use:

* transforms rather than layout thrashing
* lazy machine loading
* efficient event listeners
* requestAnimationFrame where needed
* cleanup of audio nodes/timers
* code splitting
* optimized assets

Avoid making the site hundreds of MB.

No unnecessary WebGL.

Use Canvas/WebGL only when it materially improves a machine.

---

# 18. ERROR STATES

Even real errors should fit the fictional institution without obscuring recovery.

Example:

APPARATUS FAILED TO INITIALIZE

CAUSE:
Possibly metaphysical.
Probably JavaScript.

[ RESTART APPARATUS ]

But log meaningful technical errors to console during development.

---

# 19. DESIGN DETAILS

Create:

* original favicon
* institution mark/logo made from CSS/SVG
* loading state
* machine-loading transition
* route transitions
* custom selection styling
* styled scrollbars where appropriate
* contextual cursor treatment
* responsive navigation
* audio panel
* accessibility panel
* reset research data function

Avoid gimmicks that impair usability.

---

# 20. HOME PAGE AFTER PROGRESSION

The laboratory must visibly evolve as research progresses.

Early state:
controlled
sterile
bureaucratic

Later state:
small contamination events
contradictory labels
unusual system notices
equipment behaving differently
references between machines
institutional instability

Never turn it into random glitch spam.

Progressive weirdness should be authored.

---

# 21. WRITING STYLE

Institution copy should be concise.

Examples:

PLEASE DO NOT ATTEMPT TO RESOLVE THE CONTRADICTION MANUALLY.

THE APPARATUS IS OPERATING WITHIN EXPECTED ONTOLOGICAL PARAMETERS.

THIS OBJECT HAS BECOME CONSPICUOUS.

DESIRE VERIFICATION FAILED SUCCESSFULLY.

NO CAUSAL INTERACTION WAS DETECTED.
CORRESPONDENCE REMAINS PERFECT.

Do not constantly wink at the user.

Mix humor with seriousness.

---

# 22. TESTING

Test:

routing
state persistence
reset behavior
machine completion
audio mute
autoplay restrictions
keyboard navigation
mobile layouts
contamination unlocks
archive unlocks
reload during machine
corrupt local storage fallback
reduced motion
reduced sensory setting

Add automated tests where useful.

Also manually exercise all twelve machines.

---

# 23. DEVELOPMENT PASSES

Internally work through these passes without stopping:

PASS 1
repository inspection + architecture

PASS 2
design system + laboratory shell

PASS 3
audio + interaction engine

PASS 4
research/persistence model

PASS 5
machines CM-001–CM-004

PASS 6
machines CM-005–CM-008

PASS 7
machines CM-009–CM-012

PASS 8
archive + textual apparatus

PASS 9
contamination engine

PASS 10
secret machine

PASS 11
mobile + accessibility

PASS 12
audio/game-feel polish

PASS 13
testing + bug fixing

PASS 14
production build

Do not wait for my approval between passes.

---

# 24. GIT

If Git is available:

Create sensible commits at major milestones.

Example:

feat: establish conceptual machines laboratory shell

feat: add audio and interaction systems

feat: implement first apparatus set

feat: complete philosophical machine catalogue

feat: add contamination and persistent research record

feat: finish archive and textual apparatus

polish: refine audiovisual feedback and accessibility

fix: resolve final production issues

Do not commit broken intermediate states when avoidable.

---

# 25. DEFINITION OF DONE

The task is not finished unless:

* application starts normally
* production build succeeds
* all 12 main apparatuses are interactive
* one secret apparatus exists
* machines have meaningful sound
* global ambience exists
* audio can be muted
* progress persists
* research record works
* contamination works
* archive works
* textual apparatus exists
* UI works on mobile and desktop
* no runtime AI is used
* no API keys are needed
* no obvious placeholder content exists
* no major console errors occur
* philosophical interactions precede explanations
* primary-text references are present
* the product feels like a coherent game/art experience rather than twelve unrelated demos

Build this as though it is a real small indie release, not a weekend coding exercise.

The desired emotional progression is:

curiosity
→ amusement
→ experimentation
→ recognition
→ conceptual confusion
→ philosophical reflection
→ suspicion that the laboratory itself is part of the experiment.
