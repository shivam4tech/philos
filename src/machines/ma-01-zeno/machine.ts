/** MA-01 — halving math (pure). */
export const TOTAL_HALVINGS = 12

/** Remaining distance after n authored halvings of a 100-unit bar. */
export function remainingAfter(n: number, total = 100): number {
  return total / Math.pow(2, n)
}

export function progressAfter(n: number, total = 100): number {
  return total - remainingAfter(n, total)
}

export const DECLARATION =
  'THE INSTITUTE HAS DECIDED THE BAR HAS ARRIVED. ARRIVAL BY DECREE IS RECOGNIZED TRAVERSAL.'
