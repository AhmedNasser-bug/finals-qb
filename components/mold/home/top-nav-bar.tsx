"use client"

import { useState, useEffect } from "react"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"

interface TopNavBarProps {
  activeSubjectName?: string
  loadedSubjectsCount?: number
  onShowEncyclopedia?: () => void
  onShowGallery?: () => void
  onImportNew?: () => void
}

const GUIDANCE_TIPS = [
  "USABILITY: Tap HINT to trigger Socratic nudges before revealing answers.",
  "USABILITY: Use Flashcards mode to drill system terminology before starting MCQ drills.",
  "USABILITY: Check your Session Stats grid on the dashboard to track peak learning streaks.",
  "USABILITY: Capping runs at 50 ensures local cache performs at sub-millisecond efficiency.",
  "RESEARCH: Spaced Repetition (Reddy et al.) optimizes intervals to double memory retention.",
  "RESEARCH: Active Retrieval testing (An et al.) builds stronger mental schema than passive study.",
  "RESEARCH: Modular micro-drills (Kaczmarek et al.) prevent cognitive load fatigue.",
  "RESEARCH: Metacognitive failure mapping (reviewing errors) turns mistakes into active insights.",
  "PROJECT: Source files and dev instructions are hosted at github.com/AhmedNasser-bug/finals-qb",
  "PROJECT: Offline-first architecture guarantees 100% data privacy with zero cloud synchronization."
]

export function TopNavBar({
  activeSubjectName,
  loadedSubjectsCount,
  onShowEncyclopedia,
  onShowGallery,
  onImportNew,
}: TopNavBarProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="flex justify-between items-center w-full px-6 h-16 bg-[#0d0e11] fixed top-0 z-50 border-b border-border/50 shadow-[0_0_15px_rgba(254,204,23,0.02)] select-none">
      {/* Left branding block: unified with subject-selector style */}
      <div className="flex items-center gap-2.5">
        <ProtocolIcon className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-[#fecc17] uppercase leading-none">FINALIST</p>
          <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">MASTERY PROTOCOL</p>
        </div>
      </div>

      {/* Center Socratic & study guidance feed */}
      <div 
        onClick={() => setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)}
        title="Click to cycle next study tip"
        className="hidden md:flex items-center gap-3.5 bg-black/90 border border-[#fecc17]/35 hover:border-[#fecc17] px-4.5 py-2 w-full max-w-md lg:max-w-2xl xl:max-w-[850px] rounded-xs cursor-pointer select-none group transition-all duration-300 shadow-[0_0_12px_rgba(254,204,23,0.03)] hover:shadow-[0_0_20px_rgba(254,204,23,0.12)] border-glow"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 bg-[#fecc17] rounded-full animate-pulse shadow-[0_0_8px_rgba(254,204,23,0.4)]" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#fecc17] uppercase font-bold bg-[#fecc17]/10 border border-[#fecc17]/40 px-2 py-0.5 rounded-xs transition-colors group-hover:bg-[#fecc17]/25 group-hover:border-[#fecc17]">
            GUIDE_FEED
          </span>
        </div>
        <p className="font-mono text-[10px] sm:text-[11px] lg:text-xs text-[#e5e2e1] group-hover:text-[#fecc17] font-semibold tracking-wide transition-colors leading-relaxed whitespace-nowrap">
          {GUIDANCE_TIPS[tipIndex]}
        </p>
      </div>

      {/* Right control block: unified active subject metadata pill & profile */}
      <div className="flex items-center gap-3">
        {activeSubjectName && (
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase truncate max-w-[120px] sm:max-w-[200px]" title={activeSubjectName}>
            {activeSubjectName}
          </span>
        )}

        {loadedSubjectsCount !== undefined && (
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase shrink-0">
            {loadedSubjectsCount} SUBJECT{loadedSubjectsCount !== 1 ? "S" : ""} LOADED
          </span>
        )}

        {onImportNew && (
          <button 
            onClick={onImportNew}
            title="Import New Subject JSON"
            className="p-1.5 border border-zinc-800 text-[#fecc17]/60 hover:text-primary hover:bg-zinc-800/40 hover:border-primary/40 transition-all rounded-xs focus-ring cursor-pointer min-h-[28px] hidden sm:flex items-center justify-center shrink-0"
          >
            <span className="font-mono text-[9px] font-bold px-1 uppercase tracking-wider">IMPORT</span>
          </button>
        )}
        
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

function ProtocolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}
