"use client"

import { useState, useEffect, useRef } from "react"
import { decodeSubject, clearShareHash } from "@/lib/subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"

interface ShareReceiverProps {
  /** The raw Base64url payload extracted from the URL hash. */
  payload: string
  /** Called when the user accepts the import. */
  onAccept: (subject: FullSubjectData) => void
  /** Called when the user declines or closes. */
  onDecline: () => void
}

type DecodeState = "decoding" | "ready" | "error"

export function ShareReceiver({ payload, onAccept, onDecline }: ShareReceiverProps) {
  const [state, setState]     = useState<DecodeState>("decoding")
  const [subject, setSubject] = useState<FullSubjectData | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus inside overlay
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    const previousFocus = document.activeElement as HTMLElement

    const focusableElements = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (focusableElements.length > 0) {
      firstFocusable.focus()
    } else {
      el.focus()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }

    el.addEventListener('keydown', onKeyDown)

    return () => {
      el.removeEventListener('keydown', onKeyDown)
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus()
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    decodeSubject(payload).then((result) => {
      if (cancelled) return
      if ("error" in result) {
        setState("error")
        setError(result.error)
      } else {
        setState("ready")
        setSubject(result.subject)
      }
    })

    return () => { cancelled = true }
  }, [payload])

  // Escape to decline
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleDecline()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  function handleAccept() {
    if (!subject) return
    clearShareHash()
    onAccept(subject)
  }

  function handleDecline() {
    clearShareHash()
    onDecline()
  }

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="receiver-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in outline-none"
    >
      <div className="w-full max-w-md bg-panel border border-border rounded flex flex-col shadow-xl animate-slide-up">

        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-mono tracking-widest text-primary uppercase mb-1">
            Incoming Subject
          </p>
          <h2 id="receiver-title" className="text-base font-semibold text-foreground">
            {state === "decoding"
              ? "Decoding shared subject..."
              : state === "error"
              ? "Unable to decode subject"
              : subject?.name ?? "Subject received"}
          </h2>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {state === "decoding" && (
            <div role="status" aria-live="polite" className="flex items-center gap-3 text-xs font-mono text-muted-foreground animate-pulse py-2">
              <SpinnerIcon aria-hidden="true" />
              Decompressing and validating data...
            </div>
          )}

          {state === "error" && (
            <>
              <p className="text-xs font-mono text-destructive border border-destructive/30 rounded px-3 py-2 bg-destructive/5 leading-relaxed">
                {error}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The share link may be corrupted or truncated. Ask the sender to use the file download option instead.
              </p>
              <button
                onClick={handleDecline}
                aria-label="Dismiss error"
                className="w-full py-2.5 rounded border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Dismiss
              </button>
            </>
          )}

          {state === "ready" && subject && (
            <>
              {/* Subject preview */}
              <div className="flex flex-col gap-2 border border-border rounded p-4 bg-background">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {subject.config.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <StatPill label="Questions" value={subject.questions.length} />
                  <StatPill label="Flashcards" value={subject.flashcards?.length ?? 0} />
                  <StatPill label="Achievements" value={subject.achievements?.length ?? 0} />
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                This subject will be added to your local library. No data leaves your device.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDecline}
                  title="Decline and dismiss subject"
                  className="flex-1 py-2.5 rounded border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  title="Accept and add subject to your local library"
                  className="flex-1 py-2.5 rounded border border-primary/50 bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Add to Library
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-panel text-muted-foreground">
      {label}: <span className="text-foreground">{value}</span>
    </span>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
