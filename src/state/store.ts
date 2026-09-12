import { useSyncExternalStore } from 'react'

/** Minimal typed reactive store. No dependencies, no ceremony. */
export interface Store<T> {
  get(): T
  set(updater: (prev: T) => T): void
  subscribe(listener: (state: T) => void): () => void
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<(state: T) => void>()
  return {
    get: () => state,
    set(updater) {
      const next = updater(state)
      if (next === state) return
      state = next
      for (const listener of listeners) listener(state)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get)
}

export function useSelector<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get()),
  )
}
