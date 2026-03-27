"use client"

import { useState } from "react"
import { GAME_MODES } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { SubjectImporter } from "@/components/mold/subject-importer"
import type { FullSubjectData } from "@/lib/mold-types"

interface OnboardingScreenProps {
  onSubjectAdded: (subject: FullSubjectData) => void
}

type OnboardingStep = "welcome" | "add-subject"

export function OnboardingScreen({ onSubjectAdded }: OnboardingScreenProps) {
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [showImporter, setShowImporter] = useState(false)

  function handleImport(subject: FullSubjectData) {
    setShowImporter(false)
    onSubjectAdded(subject)
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">

        {/* Top bar */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-panel">
          <div className="flex items-center gap-3">
            <ProtocolIcon />
            <div>
              <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">
                MOLD V2
              </p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                MASTERY PROTOCOL
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded">
            NO SUBJECTS LOADED
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 gap-12">

          {step === "welcome" && (
            <>
              {/* Hero */}
              <div className="flex flex-col items-center text-center gap-4 max-w-xl">
                <div className="w-14 h-14 rounded border border-primary/30 bg-primary/10 flex items-center justify-center text-primary scanlines">
                  <TargetIcon />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance text-foreground">
                    Welcome to Mastery Protocol
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    A high-performance, offline-first quiz engine. Import any subject as a JSON
                    file and master it across 7 distinct study modes — no account, no server, no tracking.
                  </p>
                </div>
              </div>

              {/* Mode guide */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                    Study Modes
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GAME_MODES.map((mode) => (
                    <div
                      key={mode.id}
                      className={cn(
                        "flex gap-3 p-4 rounded border bg-panel",
                        mode.category === "challenge"
                          ? "border-red-400/20"
                          : "border-emerald-400/20"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 w-1.5 rounded-full self-stretch",
                        mode.category === "challenge" ? "bg-red-400/40" : "bg-emerald-400/40"
                      )} />
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{mode.label}</p>
                          <span className={cn(
                            "text-[10px] font-mono px-1.5 py-0.5 rounded-sm border leading-none shrink-0",
                            mode.category === "challenge"
                              ? "border-red-400/30 text-red-400"
                              : "border-emerald-400/30 text-emerald-400"
                          )}>
                            {mode.tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => setStep("add-subject")}
                  className="font-mono text-sm font-semibold tracking-widest uppercase px-8 py-3 rounded border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Get Started
                </button>
                <p className="text-xs text-muted-foreground font-mono">
                  You will import your first subject on the next step
                </p>
              </div>
            </>
          )}

          {step === "add-subject" && (
            <div className="w-full flex flex-col items-center gap-8">
              {/* Back link */}
              <div className="self-start">
                <button
                  onClick={() => setStep("welcome")}
                  className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                >
                  <ChevronLeftIcon />
                  Back
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col items-center text-center gap-3 max-w-lg">
                <h2 className="text-xl font-semibold tracking-tight text-foreground text-balance">
                  Add Your First Subject
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  MOLD V2 runs entirely in your browser. Subjects are stored as JSON and kept in
                  local storage — nothing is ever sent to a server.
                </p>
              </div>

              {/* How it works */}
              <div className="w-full max-w-lg flex flex-col gap-3">
                {ONBOARDING_STEPS.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded border border-border bg-panel">
                    <div className="shrink-0 w-7 h-7 rounded border border-border bg-background flex items-center justify-center">
                      <span className="text-xs font-mono font-semibold text-primary">{i + 1}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import CTA */}
              <button
                onClick={() => setShowImporter(true)}
                className="font-mono text-sm font-semibold tracking-widest uppercase px-8 py-3 rounded border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Import JSON Subject
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-3 flex items-center justify-between bg-panel">
          <span className="text-xs font-mono text-muted-foreground">MOLD V2 — MASTERY PROTOCOL</span>
          <span className="text-xs font-mono text-muted-foreground">OFFLINE FIRST</span>
        </footer>
      </div>

      {showImporter && (
        <SubjectImporter
          onImport={handleImport}
          onCancel={() => setShowImporter(false)}
          existingIds={[]}
        />
      )}
    </>
  )
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    title: "Copy the AI Prompt",
    body: 'Inside the importer, copy the ready-made prompt. Replace "[YOUR TOPIC HERE]" with your subject — e.g. "Human Anatomy", "JavaScript Fundamentals", "World War II".',
  },
  {
    title: "Generate JSON with any AI",
    body: "Paste the prompt into ChatGPT, Claude, Gemini, or any capable LLM. It will return a fully structured JSON dataset with 100+ questions, 40+ flashcards, and 10+ achievements matching the required schema.",
  },
  {
    title: "Paste and verify",
    body: "Copy the AI response and paste it into the importer. MOLD validates every field in real time — question count, difficulty spread, achievement conditions — and shows a preview before you confirm.",
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function ProtocolIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
