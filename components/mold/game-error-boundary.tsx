// GameErrorBoundary — catches errors thrown inside GameEngineProvider
// and renders a recoverable error screen instead of a blank crash.
"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"

interface Props {
  onReturnHome: () => void
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to Sentry or equivalent in production
    console.error("[MOLD] GameErrorBoundary caught:", error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
        <div className="border border-red-500/40 bg-red-500/5 rounded p-6 max-w-md w-full text-center space-y-4">
          <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
            SYSTEM FAULT
          </p>
          <p className="text-sm font-mono text-foreground">
            The game engine encountered an unrecoverable error.
          </p>
          {this.state.message && (
            <p className="text-xs font-mono text-muted-foreground break-all">
              {this.state.message}
            </p>
          )}
          <button
            onClick={this.props.onReturnHome}
            className="mt-2 px-4 py-2 text-xs font-mono tracking-widest border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded"
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
    )
  }
}
