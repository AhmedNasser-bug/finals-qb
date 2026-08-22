"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  TOC_ITEMS, 
  SectionId, 
  OverviewSection, 
  QuickStartSection, 
  GameModesSection, 
  ScienceSection, 
  ScoringSection, 
  FlashcardsSection, 
  AIImportSection, 
  ShortcutsSection, 
  TipsSection, 
  ProjectLinksSection 
} from "./guide-sections"
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  ChevronUp, 
  Terminal, 
  Github, 
  Sparkles,
  Layers
} from "lucide-react"
import { getActiveSubject } from "@/lib/active-subject-store"
import { loadSubjects } from "@/lib/subject-persistence"
import { resolveGuideReturnNavigation } from "@/lib/navigation/guide-url"

const STEPS = [
  { num: "01", label: "IMPORT", desc: "Load subject JSON or syllabus" },
  { num: "02", label: "CONFIGURE", desc: "Pick mode & difficulty" },
  { num: "03", label: "ENGAGE", desc: "Active recall & Socratic hints" },
  { num: "04", label: "ANALYZE", desc: "Cognitive telemetry & grade" },
  { num: "05", label: "MASTER", desc: "Spaced retrieval & heatmap" },
] as const

export function GuidePageContent() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<SectionId>("overview")
  const [activeStep, setActiveStep] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeSubjectName, setActiveSubjectName] = useState<string | null>(null)
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null)

  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement | null>>>({})

  // ── Sync Active Subject ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      const paramSubjectId = searchParams.get("subject")
      if (paramSubjectId) {
        setActiveSubjectId(paramSubjectId)
        const allSubjects = loadSubjects()
        const found = allSubjects.find((s) => s.id === paramSubjectId)
        if (found) {
          setActiveSubjectName(found.name || found.config.title)
          return
        }
      }

      const current = getActiveSubject()
      if (current) {
        setActiveSubjectId(current.id)
        setActiveSubjectName(current.name || current.config.title)
      }
    } catch {
      // safe fallback
    }
  }, [searchParams])

  // ── Track Scroll for Active Section & Back to Top ─────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    )

    const els = Object.values(sectionRefs.current)
    els.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const registerSection = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  function scrollToSection(id: SectionId) {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  function scrollToStep(index: number) {
    setActiveStep(index)
    const map: SectionId[] = ["ai-import", "game-modes", "overview", "scoring", "the-science"]
    scrollToSection(map[index] ?? "overview")
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Filtered TOC for search
  const filteredToc = useMemo(() => {
    if (!searchQuery.trim()) return TOC_ITEMS
    const query = searchQuery.toLowerCase()
    return TOC_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const nav = useMemo(() => resolveGuideReturnNavigation(searchParams), [searchParams])
  const returnHref = nav.href
  const returnLabel = nav.label
  const displaySourceName = nav.sourceName || activeSubjectName

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* ── TOP STICKY NAVIGATION BAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-panel/95 backdrop-blur border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Return to Console */}
        <div className="flex items-center gap-4">
          <Link
            href={returnHref}
            title={returnLabel}
            aria-label={returnLabel}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary/40 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{returnLabel}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs font-bold text-foreground tracking-widest uppercase">
              FINALIST // USER GUIDE
            </span>
            <span className="font-mono text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </div>

        {/* Right: Active Subject Badge & Shortcuts */}
        <div className="flex items-center gap-3">
          {displaySourceName && (
            <span 
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 uppercase tracking-wider rounded"
              title={`Originating Context: ${displaySourceName}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="truncate max-w-[160px]">{displaySourceName}</span>
            </span>
          )}

          <Link
            href="/subjects"
            title="Switch or import another academic subject"
            aria-label="Switch or import subject"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors rounded focus-ring"
          >
            <Layers className="w-3 h-3" aria-hidden="true" />
            <span>SUBJECTS</span>
          </Link>

          <a
            href="https://github.com/AhmedNasser-bug/finals-qb"
            target="_blank"
            rel="noopener noreferrer"
            title="Open GitHub Repository"
            aria-label="Open GitHub Repository"
            className="p-2 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors rounded focus-ring"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* ── HERO BANNER & PROTOCOL STEPPER ─────────────────────────────────── */}
      <div className="bg-panel border-b border-border/70 scanlines">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[10px]">
                <span className="bg-primary/10 text-primary border border-primary/40 px-2 py-0.5 font-bold uppercase tracking-widest rounded">
                  OPERATIONAL USAGE MANUAL
                </span>
                <span className="bg-secondary text-muted-foreground border border-border px-2 py-0.5 uppercase tracking-widest rounded">
                  SPACED RETRIEVAL KERNEL
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 uppercase tracking-widest rounded">
                  100% OFFLINE
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground uppercase">
                MOLD V2 // SYSTEM GUIDE & PEDAGOGICAL SPECIFICATION
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl font-sans leading-relaxed">
                Complete operational documentation for active retrieval protocols, SuperMemo SM-2 interval progression, 2D retention heatmap analysis, and Socratic AI subject authoring.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="lg:w-80 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Filter guide topics (e.g. modes, latex, sm-2)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d0e11] border border-border/80 text-foreground font-mono text-xs pl-9 pr-3 py-2.5 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/60 rounded"
                  aria-label="Filter documentation topics"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5-Step Protocol Lifecycle Stepper */}
          <div className="pt-6 border-t border-border/50">
            <div className="text-[10px] font-mono text-primary/70 uppercase tracking-widest font-bold mb-3">
              // THE 5-STEP PROTOCOL LIFECYCLE
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {STEPS.map((step, i) => (
                <button
                  key={step.num}
                  onClick={() => scrollToStep(i)}
                  className={cn(
                    "flex flex-col gap-1 p-3 bg-[#0d0e11] border text-left cursor-pointer transition-all duration-200 rounded group focus-ring",
                    i === activeStep
                      ? "border-primary bg-primary/5 shadow-[0_0_12px_rgba(254,204,23,0.15)]"
                      : "border-border/60 hover:border-primary/40 hover:bg-secondary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{step.num}</span>
                    <span className="font-mono text-[8px] text-muted-foreground/60 tracking-widest uppercase">STEP</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-foreground group-hover:text-primary transition-colors tracking-wide uppercase">
                    {step.label}
                  </span>
                  <span className="font-sans text-[10px] text-muted-foreground/80 leading-tight">
                    {step.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE HORIZONTAL PILL BAR ────────────────────────────────────── */}
      <div className="md:hidden sticky top-16 z-40 bg-[#0d0e11] border-b border-border/70 px-4 py-2.5 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {filteredToc.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "shrink-0 px-3 py-1 font-mono text-[10px] tracking-wider uppercase font-bold transition-all rounded",
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-[0_0_8px_rgba(254,204,23,0.3)]"
                : "bg-panel border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {item.num} {item.label}
          </button>
        ))}
      </div>

      {/* ── MAIN DUAL-COLUMN CONTENT ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-10 flex gap-8 flex-1">
        {/* LEFT STICKY TOC SIDEBAR (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 bg-panel border border-border/70 p-4 flex flex-col gap-4 rounded">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                TABLE OF CONTENTS
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/60">
                10 SECTIONS
              </span>
            </div>

            <nav className="flex flex-col space-y-1" aria-label="Table of contents">
              {filteredToc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 text-left font-mono text-[11px] tracking-wide transition-all rounded cursor-pointer group focus-ring",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground font-bold shadow-[0_0_10px_rgba(254,204,23,0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold",
                    activeSection === item.id ? "text-primary-foreground" : "text-primary/70"
                  )}>
                    {item.num}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions Card */}
            <div className="pt-3 border-t border-border/50 flex flex-col gap-2 font-mono text-[10px]">
              <Link
                href={returnHref}
                title={returnLabel}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/40 font-bold uppercase tracking-wider transition-colors rounded text-center truncate"
              >
                <ArrowLeft className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{returnLabel.replace("RETURN TO ", "RESUME ")}</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT DOCUMENTATION CONTENT */}
        <main className="flex-1 min-w-0 space-y-20 pb-24">
          <OverviewSection register={registerSection} />
          <QuickStartSection register={registerSection} />
          <GameModesSection register={registerSection} />
          <ScienceSection register={registerSection} />
          <ScoringSection register={registerSection} />
          <FlashcardsSection register={registerSection} />
          <AIImportSection register={registerSection} />
          <ShortcutsSection register={registerSection} />
          <TipsSection register={registerSection} />
          <ProjectLinksSection register={registerSection} />
        </main>
      </div>

      {/* ── FLOATING BACK TO TOP BUTTON ────────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground font-bold shadow-[0_0_16px_rgba(254,204,23,0.4)] hover:bg-primary/90 transition-all rounded focus-ring cursor-pointer animate-fade-in"
        >
          <ChevronUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
