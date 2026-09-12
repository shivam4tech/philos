/**
 * CM-010 — the tiny economy. Restricted vs general economy as pure numbers.
 */

export interface ExpenditureForm {
  id: string
  label: string
  cost: number
  glory: number
  /** effect on production rate multiplier */
  productionDelta: number
  /** effect on pressure (the general economy) */
  pressureDelta: number
  consequence: string
}

export const FORMS: ExpenditureForm[] = [
  {
    id: 'festival',
    label: 'FESTIVAL',
    cost: 30,
    glory: 14,
    productionDelta: 0.15,
    pressureDelta: 4,
    consequence: 'CONSUMED WITH JOY. PRODUCTION RISES — FESTIVALS RECRUIT.',
  },
  {
    id: 'monument',
    label: 'MONUMENT',
    cost: 50,
    glory: 30,
    productionDelta: 0,
    pressureDelta: 8,
    consequence: 'CONSUMED INTO STONE. THE GLORY DOES NOTHING. THAT IS ITS DIGNITY.',
  },
  {
    id: 'luxury',
    label: 'LUXURY',
    cost: 15,
    glory: 6,
    productionDelta: 0,
    pressureDelta: 3,
    consequence: 'CONSUMED BEAUTIFULLY. THE ACCOUNTANT FILES IT UNDER “MORALE”.',
  },
  {
    id: 'gift',
    label: 'GIFT',
    cost: 20,
    glory: 10,
    productionDelta: -0.05,
    pressureDelta: 2,
    consequence: 'GIVEN AWAY. RECOGNITION ACCRUES AS A DEBT SOMEWHERE ELSE.',
  },
  {
    id: 'spectacle',
    label: 'SPECTACLE',
    cost: 40,
    glory: 20,
    productionDelta: 0.1,
    pressureDelta: 9,
    consequence: 'CONSUMED IN PUBLIC. ATTENTION ARRIVES AND IT LOOKS LIKE SURVEILLANCE.',
  },
  {
    id: 'ritual',
    label: 'RITUAL',
    cost: 25,
    glory: 12,
    productionDelta: -0.2,
    pressureDelta: 1,
    consequence: 'CONSUMED SLOWLY. THE SYSTEM PAUSES. THE PAUSE IS THE POINT.',
  },
  {
    id: 'war',
    label: 'WAR',
    cost: 80,
    glory: 40,
    productionDelta: -0.5,
    pressureDelta: 25,
    consequence: 'CONSUMED CATASTROPHICALLY. THE GENERAL ECONOMY IS ACKNOWLEDGED, NOT PLEASED.',
  },
  {
    id: 'architecture',
    label: 'USELESS ARCHITECTURE',
    cost: 60,
    glory: 34,
    productionDelta: -0.1,
    pressureDelta: 6,
    consequence: 'BUILT WITHOUT FUNCTION. THE RECEIPTS CALL IT “PRESTIGE”.',
  },
]

export const INITIAL_STATE = {
  surplus: 20,
  capacity: 100,
  /** units per tick */
  production: 4,
  pressure: 10,
  glory: 0,
}

export const CAPACITY_STEP = 40
export const INVEST_STEP = 1.2
export const SATURATION_WARNING = 0.85
export const FORMS_FOR_COMPLETION = 4
export const PRESSURE_FOR_COMPLETION = 60

export const LINES = {
  invest: 'PRODUCTION EXPANDED. SURPLUS WILL FOLLOW. SURPLUS WILL REQUIRE.',
  expand: 'STORAGE EXPANDED. FOR NOW.',
  saturating: 'STORAGE NEARLY FULL. GROWTH THAT CANNOT BE CONSUMED BECOMES PRESSURE.',
  saturated: 'STORAGE FULL. THE SURPLUS MUST BE SPENT. SPENDING IS NO LONGER OPTIONAL.',
  pressure: 'THE GENERAL ECONOMY HAS BEEN ACKNOWLEDGED.',
  complete: 'EXPENDITURE PERFORMED IN SEVERAL MODES. THE SYSTEM CONTINUES, HEAVIER.',
}
