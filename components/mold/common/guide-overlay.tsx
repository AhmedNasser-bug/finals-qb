"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId =
  | "overview"
  | "quick-start"
  | "game-modes"
  | "the-science"
  | "scoring"
  | "ai-import"
  | "tips"
  | "project-links"

interface GuideOverlayProps {
  open: boolean
  onClose: () => void
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", label: "IMPORT", desc: "Load a subject JSON via AI or file upload" },
  { num: "02", label: "CONFIGURE", desc: "Pick a mode and calibrate your session" },
  { num: "03", label: "ENGAGE", desc: "Answer questions, use hints, build streaks" },
  { num: "04", label: "ANALYZE", desc: "Review your grade, accuracy, and errors" },
  { num: "05", label: "MASTER", desc: "Repeat with spaced intervals until S+" },
] as const

const TOC_ITEMS: { id: SectionId; label: string; icon: string }[] = [
  { id: "overview",      label: "OVERVIEW",        icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { id: "quick-start",   label: "QUICK START",     icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "game-modes",    label: "GAME MODES",      icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { id: "the-science",   label: "THE SCIENCE",     icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5m4 0h10m-4 7v-7m0 0h4m-4 0H9" },
  { id: "scoring",       label: "SCORING & GRADES", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "ai-import",     label: "AI IMPORT WIZARD", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" },
  { id: "tips",          label: "TIPS & TRICKS",   icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "project-links", label: "PROJECT LINKS",   icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
]

const GAME_MODES = [
  { mode: "SPEEDRUN",      limit: "5:00",       diff: "◆◆◆◇", diffColor: "text-primary", bestFor: "Pressure training" },
  { mode: "BLITZ",         limit: "2:00",       diff: "◆◆◇◇", diffColor: "text-primary", bestFor: "Daily warm-up" },
  { mode: "HARDCORE",      limit: "∞",          diff: "◆◆◆◆", diffColor: "text-destructive", bestFor: "Deep mastery (hard only)" },
  { mode: "SURVIVAL",      limit: "Decreasing", diff: "◆◆◆◆", diffColor: "text-destructive", bestFor: "Resilience training" },
  { mode: "PRACTICE",      limit: "∞",          diff: "Custom", diffColor: "text-muted-foreground", bestFor: "Targeted weak-spot drills" },
  { mode: "FULL REVISION", limit: "∞",          diff: "◆◆◆◇", diffColor: "text-primary", bestFor: "Systematic end-to-end review" },
  { mode: "FLASHCARDS",    limit: "∞",          diff: "◆◇◇◇", diffColor: "text-emerald-400", bestFor: "Rapid terminology drills" },
]

const CITATIONS = [
  {
    title: "The Testing Effect",
    authors: "Roediger & Karpicke",
    year: "2006",
    journal: "Journal of Experimental Psychology",
    finding: "Active retrieval testing yields ~50% better long-term retention vs. passive re-reading. The act of recall — not re-exposure — builds durable memory traces.",
  },
  {
    title: "Spaced Practice",
    authors: "Cepeda et al.",
    year: "2008",
    journal: "Psychological Science",
    finding: "Distributing practice over time more than doubles retention at a final test compared to massed study sessions (cramming). Gaps between sessions are a feature, not a bug.",
  },
  {
    title: "Desirable Difficulties",
    authors: "Bjork",
    year: "1994",
    journal: "Memory & Cognition",
    finding: "Introducing friction during learning — harder retrieval, interleaving, reduced feedback — creates deeper encoding and dramatically higher transfer of knowledge.",
  },
  {
    title: "Immediate Corrective Feedback",
    authors: "Hattie & Timperley",
    year: "2007",
    journal: "Review of Educational Research",
    finding: "Post-error corrective feedback (d = 0.73) is the single highest-leverage learning intervention. Knowing why you were wrong beats knowing the right answer.",
  },
  {
    title: "Metacognitive Monitoring",
    authors: "Dunlosky & Metcalfe",
    year: "2009",
    journal: "Metacognition",
    finding: "Tracking what you know vs. don't know prevents the illusion of knowing — a critical failure mode in passive study that quiz engines systematically counteract.",
  },
]

const GRADES = [
  { grade: "S+", min: "≥ 97%", color: "text-primary" },
  { grade: "S",  min: "≥ 93%", color: "text-primary" },
  { grade: "A+", min: "≥ 90%", color: "text-emerald-400" },
  { grade: "A",  min: "≥ 87%", color: "text-emerald-400" },
  { grade: "B+", min: "≥ 80%", color: "text-sky-400" },
  { grade: "C+", min: "≥ 70%", color: "text-orange-400" },
  { grade: "D+", min: "≥ 60%", color: "text-orange-600" },
  { grade: "F",  min: "< 60%", color: "text-destructive" },
]

const TIPS = [
  { label: "USE HINTS SPARINGLY", body: "Hints trigger Socratic nudges, not answers. Use them to unblock, not replace, the retrieval effort." },
  { label: "FLASHCARDS FIRST", body: "Drill the Flashcards mode before MCQ modes. Vocabulary fluency dramatically reduces cognitive load during questions." },
  { label: "REVIEW YOUR ERRORS", body: "After each session, study wrong answers in the Results screen. Metacognitive mapping turns mistakes into active insights." },
  { label: "VARY YOUR MODE", body: "Interleaving modes (Speedrun → Practice → Full Revision) creates stronger transfer than repeatedly running the same mode." },
  { label: "WATCH YOUR STREAK", body: "Streak is a proxy for flow state. A streak drop early signals a knowledge gap — treat it as a diagnostic signal, not a penalty." },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function GuideOverlay({ open, onClose }: GuideOverlayProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview")
  const [activeStep, setActiveStep] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement | null>>>({})
  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus inside overlay
  useEffect(() => {
    if (open) {
      overlayRef.current?.focus()
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (typeof window === "undefined") return
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Intersection observer to track active section
  useEffect(() => {
    if (!open) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 }
    )
    const els = Object.values(sectionRefs.current)
    els.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [open])

  function scrollToSection(id: SectionId) {
    setActiveSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function scrollToStep(index: number) {
    setActiveStep(index)
    const map: SectionId[] = ["ai-import", "game-modes", "overview", "scoring", "the-science"]
    scrollToSection(map[index] ?? "overview")
  }

  const registerSection = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="User Guide"
      tabIndex={-1}
      className="fixed inset-0 z-[60] bg-background flex flex-col animate-fade-in outline-none"
    >
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="flex-none flex items-center justify-between px-6 h-14 bg-panel border-b-2 border-primary/40 shrink-0 z-10">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5 w-56">
          <StackIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase leading-none">FINALIST</p>
            <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-0.5">MASTERY PROTOCOL</p>
          </div>
        </div>

        {/* Center: Title */}
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-primary tracking-[0.2em] uppercase text-sm">USER GUIDE</span>
          <span className="font-mono text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 tracking-widest">[v2.0]</span>
        </div>

        {/* Right: Close */}
        <div className="flex justify-end w-56">
          <button
            onClick={onClose}
            aria-label="Close user guide"
            className="flex items-center gap-2 px-3 py-1.5 border border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all font-mono text-xs tracking-widest uppercase focus-ring cursor-pointer"
          >
            CLOSE
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── BREADCRUMB STEPPER ──────────────────────────────────────────── */}
      <div className="flex-none bg-panel border-b border-border/50 py-4 px-6 hidden md:block shrink-0">
        <div className="max-w-5xl mx-auto flex items-start justify-between relative">
          {/* Connecting dashed line */}
          <div
            aria-hidden="true"
            className="absolute top-4 left-[10%] right-[10%] h-px border-t border-dashed border-primary/25 z-0"
          />
          {STEPS.map((step, i) => (
            <button
              key={step.num}
              onClick={() => scrollToStep(i)}
              aria-label={`Go to step ${step.num}: ${step.label}`}
              className={cn(
                "flex flex-col items-center gap-1.5 relative z-10 bg-panel px-3 cursor-pointer transition-all duration-200 group focus-ring",
                i === activeStep ? "" : "opacity-50 hover:opacity-80"
              )}
            >
              <div className={cn(
                "w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border transition-all duration-200",
                i === activeStep
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(254,204,23,0.4)]"
                  : "bg-panel border-border text-muted-foreground group-hover:border-primary/50"
              )}>
                {step.num}
              </div>
              <span className={cn(
                "font-mono text-[9px] tracking-[0.15em] uppercase font-bold",
                i === activeStep ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
              <span className="font-sans text-[9px] text-muted-foreground/60 text-center leading-tight max-w-[90px] hidden lg:block">
                {step.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN BODY ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR TOC */}
        <nav
          aria-label="Guide table of contents"
          className="w-56 flex-none bg-[#0d0e11] border-r border-border/50 flex flex-col overflow-y-auto hidden md:flex shrink-0"
        >
          <div className="p-5">
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-4">
              CONTENTS // INDEX
            </p>
            <ul className="space-y-0.5" role="list">
              {TOC_ITEMS.map(({ id, label, icon }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150 font-mono text-[11px] tracking-wide cursor-pointer focus-ring group",
                      activeSection === id
                        ? "border-l-2 border-primary text-primary bg-primary/5"
                        : "border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={icon} />
                    </svg>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom signature */}
          <div className="mt-auto p-5 border-t border-border/30">
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase leading-relaxed">
              FINALIST<br />MASTERY PROTOCOL<br />v2.0 // 2025
            </p>
          </div>
        </nav>

        {/* RIGHT SCROLLABLE CONTENT */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-background"
          aria-live="polite"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 space-y-20">
            {/* 01: Overview */}
            <OverviewSection register={registerSection} />

            {/* 02: Quick Start */}
            <QuickStartSection register={registerSection} />

            {/* 03: Game Modes */}
            <GameModesSection register={registerSection} />

            {/* 04: The Science */}
            <ScienceSection register={registerSection} />

            {/* 05: Scoring */}
            <ScoringSection register={registerSection} />

            {/* 06: AI Import Wizard */}
            <AIImportSection register={registerSection} />

            {/* 07: Tips */}
            <TipsSection register={registerSection} />

            {/* 08: Project Links */}
            <ProjectLinksSection register={registerSection} />
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[10px] text-primary/40 tracking-wider">──</span>
      <span className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase font-bold shrink-0">
        SECTION {num} // {title}
      </span>
      <div className="flex-1 h-px bg-primary/15" />
    </div>
  )
}

function OverviewSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="overview" ref={register("overview")} aria-labelledby="h-overview">
      <SectionHeader num="01" title="OVERVIEW" />
      <h1 id="h-overview" className="font-sans text-3xl lg:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Mastery Through Desirable Difficulty.
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mb-8">
        FINALIST is not a casual study tool. It is a high-fidelity learning terminal built on peer-reviewed cognitive science — spaced repetition, active retrieval, and metacognitive feedback — packaged in a zero-tracking, offline-first engine.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { val: "7", label: "STUDY MODES" },
          { val: "100%", label: "OFFLINE" },
          { val: "0 B", label: "DATA SENT" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-panel border border-border/50 p-5 flex flex-col gap-2 hover:border-primary/30 transition-colors duration-200">
            <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
            <span className="font-mono text-4xl font-light text-primary leading-none">{val}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function QuickStartSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="quick-start" ref={register("quick-start")} aria-labelledby="h-quickstart">
      <SectionHeader num="02" title="QUICK START" />
      <h2 id="h-quickstart" className="sr-only">Quick Start Guide</h2>
      <div className="space-y-3">
        {[
          {
            num: "01",
            title: "Open the Import Wizard",
            body: 'Click IMPORT in the top nav or on the subject selection screen. The 5-step wizard opens — start at "Preset & Topic."',
          },
          {
            num: "02",
            title: "Configure your subject",
            body: "Set your topic name, select a pedagogical preset (Balanced, Conceptual, etc.), and calibrate the difficulty bias and question volume.",
          },
          {
            num: "03",
            title: "Generate JSON with any AI",
            body: "Copy the generated AI prompt. Paste it into ChatGPT, Claude, Gemini, or any capable LLM. It returns a fully structured FullSubjectData JSON blob.",
          },
          {
            num: "04",
            title: "Paste & validate",
            body: "Paste the AI response into the wizard's final step. FINALIST validates every field in real-time — question count, difficulty spread, achievement conditions — and shows a full preview.",
          },
          {
            num: "05",
            title: "Select a mode and start",
            body: "From the home screen, pick any of the 7 study modes. Configure time limit, hints, and question count. Press INITIALIZE PROTOCOL to begin.",
          },
        ].map((step) => (
          <div key={step.num} className="flex gap-4 p-5 bg-panel border border-border/40 hover:border-primary/25 transition-colors duration-200">
            <div className="shrink-0 w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-primary">{step.num}</span>
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-1">{step.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function GameModesSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="game-modes" ref={register("game-modes")} aria-labelledby="h-gamemodes">
      <SectionHeader num="03" title="GAME MODES" />
      <h2 id="h-gamemodes" className="sr-only">Game Modes Reference</h2>
      <div className="mb-6 p-4 bg-[#0d0e11] border border-border/40">
        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-3">// INTERFACE PREVIEW — MODE SELECTOR</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["SPEEDRUN", "BLITZ", "HARDCORE", "SURVIVAL"].map((m, i) => (
            <div key={m} className={cn(
              "border p-2.5 font-mono text-[10px] tracking-wider text-center",
              i === 0 ? "border-primary/60 bg-primary/5 text-primary shadow-[0_0_8px_rgba(254,204,23,0.15)]" : "border-border/40 text-muted-foreground/50"
            )}>
              {m}
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-panel border-b-2 border-primary/30">
              {["MODE", "TIME LIMIT", "DIFFICULTY", "BEST FOR"].map((h) => (
                <th key={h} className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {GAME_MODES.map((row, i) => (
              <tr key={row.mode} className={cn("transition-colors hover:bg-panel/50", i % 2 === 0 ? "bg-background" : "bg-panel/30")}>
                <td className="py-3 px-4 font-mono text-xs font-bold text-foreground">{row.mode}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{row.limit}</td>
                <td className={cn("py-3 px-4 font-mono text-xs", row.diffColor)}>{row.diff}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ScienceSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="the-science" ref={register("the-science")} aria-labelledby="h-science">
      <SectionHeader num="04" title="THE SCIENCE" />
      <h2 id="h-science" className="sr-only">Research Foundation</h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
        Every design decision in FINALIST maps to peer-reviewed cognitive science. These are the five studies that form its pedagogical foundation.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {CITATIONS.map((c) => (
          <div key={c.title} className="bg-[#0d0e11] border-l-[3px] border-primary p-5 flex flex-col gap-3 hover:bg-panel/50 transition-colors duration-200">
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-1">{c.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {c.authors} <span className="text-primary/60">·</span> {c.year}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.finding}</p>
            <div className="pt-3 border-t border-border/30">
              <span className="font-mono text-[9px] text-primary/60 tracking-[0.15em] uppercase">{c.journal}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ScoringSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="scoring" ref={register("scoring")} aria-labelledby="h-scoring">
      <SectionHeader num="05" title="SCORING & GRADES" />
      <h2 id="h-scoring" className="sr-only">Scoring and Grade System</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-panel border border-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 bg-[#0d0e11]">
            <p className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.2em] uppercase">GRADE THRESHOLDS</p>
          </div>
          <table className="w-full" role="table">
            <thead className="sr-only">
              <tr><th>Grade</th><th>Min Accuracy</th></tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {GRADES.map((g) => (
                <tr key={g.grade} className="hover:bg-primary/3 transition-colors">
                  <td className="py-3 px-5">
                    <span className={cn("font-mono text-xl font-bold tracking-tight", g.color)}>{g.grade}</span>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-muted-foreground tracking-widest">{g.min} ACCURACY</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#0d0e11] border border-border/40 p-5 flex flex-col gap-3">
          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase">// INTERFACE PREVIEW — RESULTS SCREEN</p>
          <div className="flex flex-col items-center gap-4 flex-1 justify-center py-4">
            <div className="w-20 h-20 border-2 border-primary/60 flex items-center justify-center shadow-[0_0_20px_rgba(254,204,23,0.2)]">
              <span className="font-mono text-3xl font-bold text-primary">S+</span>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {[["ACC", "97%"], ["STREAK", "12"], ["TIME", "4:22"]].map(([label, val]) => (
                <div key={label} className="border border-border/40 p-2 text-center">
                  <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest">{label}</p>
                  <p className="font-mono text-sm font-bold text-foreground">{val}</p>
                </div>
              ))}
            </div>
            <div className="w-full border border-border/30 py-1.5 text-center font-mono text-[10px] text-muted-foreground/50 tracking-widest">
              [ HOME ] &nbsp; [ PLAY AGAIN ]
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-panel border border-border/30 font-mono text-xs text-muted-foreground">
        <span className="text-primary/70">// </span>
        Accuracy = correct ÷ (correct + wrong). Skipped questions do not count against you — only answered ones.
      </div>
    </section>
  )
}

function AIImportSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="ai-import" ref={register("ai-import")} aria-labelledby="h-import">
      <SectionHeader num="06" title="AI IMPORT WIZARD" />
      <h2 id="h-import" className="sr-only">AI Import Wizard Guide</h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
        The 5-step wizard generates a structured JSON subject file using any capable LLM. No API key required — you copy a prompt, paste the AI response back.
      </p>
      <div className="mb-6 bg-[#0d0e11] border border-border/40 p-4">
        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-3">// INTERFACE PREVIEW — IMPORT WIZARD</p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {["PRESET", "BIAS", "VOLUME", "PROMPT", "LOAD"].map((s, i) => (
            <div key={s} className="flex items-center shrink-0">
              <div className={cn(
                "border px-3 py-1.5 font-mono text-[10px] tracking-widest",
                i === 3 ? "border-primary/60 bg-primary/5 text-primary" : "border-border/30 text-muted-foreground/40"
              )}>
                {String(i + 1).padStart(2, "0")} {s}
              </div>
              {i < 4 && <div className="w-6 h-px bg-primary/20 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[
          { step: "01", title: "PRESET & TOPIC", body: 'Enter your subject name and pick a pedagogical preset. "Balanced" is recommended for most subjects.' },
          { step: "02", title: "SUBJECT BIAS", body: "Calibrate the split between Theoretical (conceptual understanding) and Technical (applied problem-solving) questions." },
          { step: "03", title: "VOLUME CALIBRATION", body: "Set total question count (10–100), flashcard count, and difficulty distribution (Easy / Medium / Hard %)." },
          { step: "04", title: "PROMPT GENERATION", body: "Copy the ready-made AI prompt. Replace nothing — your configuration is already embedded. Paste into any LLM." },
          { step: "05", title: "LOAD & VALIDATE", body: "Paste the AI response JSON. FINALIST validates schema, question count, difficulty spread, and achievement conditions in real-time." },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 p-4 bg-panel border border-border/30 hover:border-primary/20 transition-colors">
            <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">{s.step}</span>
            <div>
              <p className="font-mono text-[10px] font-bold text-foreground tracking-widest uppercase mb-1">{s.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TipsSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="tips" ref={register("tips")} aria-labelledby="h-tips">
      <SectionHeader num="07" title="TIPS & TRICKS" />
      <h2 id="h-tips" className="sr-only">Tips and Tricks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIPS.map((tip) => (
          <div key={tip.label} className="p-5 bg-panel border border-border/40 hover:border-primary/25 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
              <p className="font-mono text-[10px] font-bold text-primary tracking-[0.15em] uppercase">{tip.label}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProjectLinksSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="project-links" ref={register("project-links")} aria-labelledby="h-links">
      <SectionHeader num="08" title="PROJECT LINKS" />
      <h2 id="h-links" className="sr-only">Project Links</h2>
      <div className="space-y-3">
        {[
          {
            label: "GitHub Repository",
            href: "https://github.com/AhmedNasser-bug/finals-qb",
            sub: "github.com/AhmedNasser-bug/finals-qb",
            desc: "Full source code, roadmap, and open issues.",
          },
          {
            label: "Report an Issue",
            href: "https://github.com/AhmedNasser-bug/finals-qb/issues",
            sub: "github.com/AhmedNasser-bug/finals-qb/issues",
            desc: "Found a bug or have a feature request? Open a GitHub Issue.",
          },
          {
            label: "Contribution Guide",
            href: "https://github.com/AhmedNasser-bug/finals-qb/blob/main/CONTRIBUTORS.md",
            sub: "CONTRIBUTORS.md",
            desc: "How to contribute subjects, bug fixes, or new study modes.",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 p-5 bg-panel border border-border/40 hover:border-primary/40 hover:bg-primary/3 transition-all duration-200 group"
          >
            <div>
              <p className="font-mono text-xs font-bold text-foreground group-hover:text-primary tracking-wide uppercase mb-1 transition-colors">
                {link.label}
              </p>
              <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-1.5">{link.sub}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
            </div>
            <ExternalLinkIcon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 shrink-0 mt-1 transition-colors" aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="mt-10 pt-8 border-t border-border/20 text-center">
        <p className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.2em] uppercase">
          FINALIST MASTERY PROTOCOL · v2.0 · Offline-first · Zero tracking
        </p>
      </div>
    </section>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-3.5 h-3.5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
