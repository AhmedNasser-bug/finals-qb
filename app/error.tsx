"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[MOLD] Runtime Exception:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="border border-destructive/40 bg-destructive/5 rounded p-8 max-w-lg w-full text-center space-y-6 shadow-2xl" role="alert">
        <div className="inline-flex p-3 rounded-full bg-destructive/10 border border-destructive/20 text-destructive mb-2">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono text-destructive tracking-widest uppercase font-bold">
            RUNTIME EXCEPTION // PROTOCOL INTERRUPT
          </p>
          <h1 className="text-xl font-mono font-bold text-foreground">
            SYSTEM ANOMALY DETECTED
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            An unexpected error interrupted the execution environment.
          </p>
        </div>
        {error.message && (
          <div className="p-3 bg-panel border border-border rounded text-left overflow-hidden">
            <p className="text-[11px] font-mono text-muted-foreground break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">
                DIGEST: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            RETRY EXECUTION
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-border text-foreground hover:bg-muted transition-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            SYSTEM ROOT
          </Link>
        </div>
      </div>
    </div>
  )
}
