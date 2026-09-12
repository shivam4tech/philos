import { describe, expect, it } from 'vitest'
import { act } from 'react-dom/test-utils'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

import { App } from '@/App'
import { enterFacility, resetResearchRecord } from '@/state/record'
import { navigate } from '@/router/router'

async function renderApp(): Promise<{ root: Root; container: HTMLElement }> {
  const container = document.createElement('div')
  document.body.appendChild(container)
  let root: Root | null = null
  await act(async () => {
    root = createRoot(container)
    root.render(<App />)
  })
  return { root: root as unknown as Root, container }
}

function teardown({ root, container }: { root: Root; container: HTMLElement }): void {
  act(() => {
    root.unmount()
  })
  container.remove()
}

describe('application smoke', () => {
  it('renders the entrance for an unregistered visitor', async () => {
    resetResearchRecord()
    const mounted = await renderApp()
    try {
      expect(mounted.container.textContent).toContain('CONCEPTUAL MACHINES LAB')
      expect(mounted.container.textContent).toContain('INSTITUTE FOR APPLIED METAPHYSICS')
      expect(mounted.container.textContent).toContain('ENTER FACILITY')
    } finally {
      teardown(mounted)
    }
  })

  it('renders the facility shell once the visitor has entered', async () => {
    resetResearchRecord()
    enterFacility()
    navigate({ name: 'catalogue' }, { replace: true })

    const mounted = await renderApp()
    try {
      expect(mounted.container.textContent).toContain('MACHINE CATALOGUE')
      expect(mounted.container.textContent).toContain('THE WILL ENGINE')
      expect(mounted.container.textContent).toContain('AUDIO ON')
    } finally {
      teardown(mounted)
    }
  })
})
