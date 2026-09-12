/**
 * CM-003 — mediation chain data (pure).
 */

export interface Mediation {
  id: string
  term: string
  line: string
}

export const MEDIATIONS: Mediation[] = [
  {
    id: 'commodity',
    term: 'COMMODITY',
    line: 'THE DRINK IS ALREADY A COMMODITY. IT BECAME ONE BEFORE YOU ARRIVED.',
  },
  {
    id: 'currency',
    term: 'CURRENCY',
    line: 'YOUR COIN IS A CLAIM ON SOCIAL LABOR. THE MACHINE EXCHANGES CLAIMS, NOT OBJECTS.',
  },
  {
    id: 'property',
    term: 'PROPERTY',
    line: 'THE DRINK IS OWNED. THE MACHINE IS OWNED. YOU CURRENTLY OWN NOTHING HERE.',
  },
  {
    id: 'labor',
    term: 'LABOR',
    line: 'HANDS HAVE ALREADY MOVED THIS OBJECT. THEIR ABSENCE IS CALLED “PRICE”.',
  },
  {
    id: 'distribution',
    term: 'DISTRIBUTION',
    line: 'THE DRINK TRAVELED. ITS JOURNEY WAS INVISIBLE SO THAT ITS AVAILABILITY COULD SEEM NATURAL.',
  },
  {
    id: 'recognition',
    term: 'RECOGNITION',
    line: 'THE MACHINE ADDRESSES YOU AS A CUSTOMER. YOU ADDRESS IT AS A VENDOR. BOTH ROLES PRECEDE YOU.',
  },
  {
    id: 'request',
    term: 'THE REQUEST ITSELF',
    line: 'YOUR REQUEST IS NOT OUTSIDE THE MACHINE. IT IS COMPONENT 7 OF 9.',
  },
]

export const DRINKS = [
  { id: 'a1', label: 'COKE', price: '2.0' },
  { id: 'a2', label: 'WATER', price: '1.5' },
  { id: 'b1', label: 'COFFEE', price: '2.5' },
  { id: 'b2', label: 'TEA', price: '2.0' },
  { id: 'c1', label: '?????', price: '9.9' },
]

export const DISPLAY_LINES = {
  idle: 'SELECT PRODUCT',
  immediate: (drink: string) => `IMMEDIATE REQUEST DETECTED: ${drink}`,
  mediating: (n: number, total: number) => `MEDIATION ${n} OF ${total} EXPOSED`,
  dispense: 'DISPENSING.',
  returned: 'THE OBJECT RETURNS TRANSFORMED. IMMEDIACY WAS NEVER ON SALE.',
  noSelection: 'REQUEST AN OBJECT FIRST. IMMEDIACY REQUIRES CONTENT.',
}

export const SECRET_DEMAND_THRESHOLD = 5
