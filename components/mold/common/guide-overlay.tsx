"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  SectionHeader,
  OverviewSection,
  QuickStartSection,
  GameModesSection,
  ScienceSection,
  ScoringSection,
  AIImportSection,
  TipsSection,
  ProjectLinksSection,
  StackIcon,
  CloseIcon,
  ExternalLinkIcon
} from "./guide-overlay-sections"



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
      role="dialog"
      aria-modal="true"
      aria-label="User Guide"
      className="fixed inset-0 z-[60] bg-background flex flex-col animate-fade-in"
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

