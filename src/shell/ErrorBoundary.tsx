import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import { navigate } from '@/router/router'
import { Btn } from './ui'
import './errorboundary.css'

interface Props {
  children: ReactNode
  /** changes to this value remount the boundary (clears the error state) */
  resetKey?: string
  label?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // meaningful technical logging stays in the console (dev + prod)
    console.error('[institute] apparatus failure', error, info.componentStack)
  }

  override componentDidUpdate(prevProps: Props): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  override render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="apperror" role="alert">
        <p className="microlabel microlabel--signal">FACILITY EXCEPTION</p>
        <h1>APPARATUS FAILED TO INITIALIZE</h1>
        <p className="apperror__cause">
          CAUSE:
          <br />
          POSSIBLY METAPHYSICAL. PROBABLY JAVASCRIPT.
        </p>
        <p className="apperror__detail">{error.message}</p>
        <div className="apperror__actions">
          <Btn variant="primary" onClick={() => this.setState({ error: null })}>
            RESTART APPARATUS
          </Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              this.setState({ error: null })
              navigate({ name: 'catalogue' })
            }}
          >
            RETURN TO CATALOGUE
          </Btn>
        </div>
      </div>
    )
  }
}
