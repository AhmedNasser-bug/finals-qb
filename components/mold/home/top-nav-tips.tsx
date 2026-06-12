"use client"

import { useState, useEffect } from "react"

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

interface TopNavTipsProps {
  onShowGuide: () => void
}

export function TopNavTips({ onShowGuide }: TopNavTipsProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden md:flex items-center gap-2 flex-1 max-w-md lg:max-w-2xl xl:max-w-[900px] mx-4">
      {/* Feed bar — clickable to cycle tips */}
      <button
        onClick={() => setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)}
        title="Click to cycle next study tip"
        aria-label="Cycle next study tip"
        type="button"
        className="flex items-center text-left gap-3 bg-black/90 border border-[#fecc17]/35 hover:border-[#fecc17]/60 px-3.5 py-2 flex-1 min-w-0 cursor-pointer select-none group transition-all duration-300 shadow-[0_0_12px_rgba(254,204,23,0.03)] hover:shadow-[0_0_20px_rgba(254,204,23,0.12)] border-glow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-[#fecc17] rounded-full animate-pulse shadow-[0_0_8px_rgba(254,204,23,0.4)]" />
          <span className="font-mono text-[9px] tracking-widest text-[#fecc17] uppercase font-bold bg-[#fecc17]/10 border border-[#fecc17]/40 px-2 py-0.5 transition-colors group-hover:bg-[#fecc17]/25 group-hover:border-[#fecc17]">
            STUDY TIPS
          </span>
        </div>
        <p className="font-mono text-[10px] lg:text-xs text-[#e5e2e1] group-hover:text-[#fecc17] font-semibold tracking-wide transition-colors leading-relaxed truncate">
          {GUIDANCE_TIPS[tipIndex]}
        </p>
      </button>

      {/* Pulsating GUIDE button */}
      <button
        onClick={onShowGuide}
        title="Open User Guide"
        aria-label="Open User Guide"
        className="flex items-center gap-1.5 px-2.5 py-2 border border-[#fecc17]/30 bg-[#fecc17]/5 hover:bg-[#fecc17]/15 hover:border-[#fecc17]/70 transition-all duration-200 group cursor-pointer focus-ring shrink-0 relative"
      >
        {/* outer pulse ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 border border-[#fecc17]/20 animate-pulse pointer-events-none"
        />
        <span className="w-1.5 h-1.5 bg-[#fecc17] rounded-full animate-pulse shadow-[0_0_6px_rgba(254,204,23,0.6)] shrink-0" aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#fecc17] uppercase group-hover:text-white transition-colors">
          GUIDE
        </span>
      </button>
    </div>
  )
}
