"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"

import { Palette, LayoutGrid, BookOpen } from "lucide-react"
import { GuideLink } from "@/components/mold/common/guide-link"

interface TopNavBarProps {
  activeSubjectName?: string
  loadedSubjectsCount?: number
  onShowEncyclopedia?: () => void
  onShowGallery?: () => void
  onImportNew?: () => void
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
}

const GUIDANCE_TIPS = [
  "TIP: Tap HINT to get a helpful clue before checking the answer.",
  "TIP: Use Flashcards mode to learn terms before taking multiple-choice quizzes.",
  "TIP: Check your study statistics on the dashboard to track your best streaks.",
  "TIP: Storing your latest 50 quizzes keeps the app running fast.",
  "TIP: Spacing out your reviews helps you remember concepts twice as long.",
  "TIP: Quizzing yourself builds stronger recall than just reading notes.",
  "TIP: Short, focused quizzes help prevent study burnout.",
  "TIP: Reviewing your incorrect answers helps you learn from mistakes.",
  "PROJECT: Source files and dev instructions are hosted at github.com/AhmedNasser-bug/finals-qb",
  "TIP: All your study progress is saved privately on your device."
]

export function TopNavBar({
  activeSubjectName,
  loadedSubjectsCount,
  onShowEncyclopedia,
  onShowGallery,
  onImportNew,
  onShowThemeModal,
  onShowLayoutModal,
}: TopNavBarProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="flex justify-between items-center w-full px-6 h-16 bg-panel fixed top-0 z-50 border-b border-border/60 shadow-[0_0_15px_hsla(var(--primary),0.03)] select-none">
      {/* Left branding block */}
      <div className="flex items-center gap-2.5">
        <ProtocolIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase leading-none">FINALIST</p>
          <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">STUDY SYSTEM</p>
        </div>
      </div>

      {/* Center: guide feed + pulsating GUIDE button */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md lg:max-w-2xl xl:max-w-[900px] mx-4">
        {/* Feed bar — clickable to cycle tips */}
        <button
          onClick={() => setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)}
          title="Click to cycle next study tip"
          aria-label="Cycle to next study recommendation"
          type="button"
          className="flex items-center text-left gap-3 bg-secondary/80 border border-primary/35 hover:border-primary/60 px-3.5 py-2 flex-1 min-w-0 cursor-pointer select-none group transition-all duration-300 shadow-[0_0_12px_hsla(var(--primary),0.03)] hover:shadow-[0_0_20px_hsla(var(--primary),0.12)] border-glow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_hsla(var(--primary),0.4)]" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-widest text-primary uppercase font-bold bg-primary/10 border border-primary/40 px-2 py-0.5 transition-colors group-hover:bg-primary/25 group-hover:border-primary rounded">
              STUDY TIPS
            </span>
          </div>
          <p className="font-mono text-[10px] lg:text-xs text-foreground group-hover:text-primary font-semibold tracking-wide transition-colors leading-relaxed truncate">
            {GUIDANCE_TIPS[tipIndex]}
          </p>
        </button>

        {/* Pulsating GUIDE link */}
        <GuideLink
          source="top_nav"
          title="Open comprehensive user guide and learning strategies"
          aria-label="Open comprehensive user guide"
          className="flex items-center gap-1.5 px-2.5 py-2 border border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/70 transition-all duration-200 group cursor-pointer focus-ring shrink-0 relative rounded"
        >
          {/* outer pulse ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-primary/20 animate-pulse pointer-events-none rounded"
          />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_6px_hsla(var(--primary),0.6)] shrink-0" aria-hidden="true" />
          <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-primary uppercase group-hover:text-foreground transition-colors">
            GUIDE
          </span>
        </GuideLink>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {activeSubjectName && (
          <span
            className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase truncate max-w-[120px] sm:max-w-[200px] rounded"
            title={activeSubjectName}
          >
            {activeSubjectName}
          </span>
        )}

        {loadedSubjectsCount !== undefined && (
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase shrink-0 rounded">
            {loadedSubjectsCount} SUBJECT{loadedSubjectsCount !== 1 ? "S" : ""} LOADED
          </span>
        )}

        {onShowThemeModal && (
          <button
            onClick={onShowThemeModal}
            title="Change color theme palette"
            aria-label="Open color theme switcher"
            className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] flex items-center justify-center shrink-0 rounded"
          >
            <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
          </button>
        )}

        {onShowLayoutModal && (
          <button
            onClick={onShowLayoutModal}
            title="Switch workspace page layout"
            aria-label="Open page layout switcher"
            className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
          >
            <LayoutGrid className="w-4 h-4 text-primary" aria-hidden="true" />
          </button>
        )}

        {onImportNew && (
          <button
            onClick={onImportNew}
            title="Import New Subject JSON"
            aria-label="Import new subject from JSON file"
            className="p-1.5 border border-border text-primary/80 hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
          >
            <span className="font-mono text-[9px] font-bold px-1 uppercase tracking-wider">IMPORT</span>
          </button>
        )}

        {/* Mobile GUIDE link */}
        <GuideLink
          source="mobile_top_nav"
          title="Open comprehensive user guide"
          aria-label="Open comprehensive user guide"
          className="md:hidden p-2 border border-primary/30 text-primary hover:text-primary hover:border-primary/60 transition-all focus-ring cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 relative rounded"
        >
          <span aria-hidden="true" className="absolute inset-0 border border-primary/15 animate-pulse pointer-events-none rounded" />
          <BookIcon className="w-4 h-4" aria-hidden="true" />
        </GuideLink>

        {hasClerk && (
          <div className="flex items-center border-l border-zinc-800/60 pl-3 min-h-[28px]">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[10px] font-mono font-bold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 hover:bg-primary/10 transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer">
                  SIGN IN
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-6 h-6 border border-primary/30 rounded-none",
                    userButtonTrigger: "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
                  }
                }}
              />
            </Show>
          </div>
        )}
      </div>
    </nav>
  )
}

function ProtocolIcon({ className, 'aria-hidden': ariaHidden }: { className?: string, 'aria-hidden'?: boolean | "true" | "false" }) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}
