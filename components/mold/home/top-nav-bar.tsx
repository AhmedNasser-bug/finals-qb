"use client"

import { useState, useEffect } from "react"
import { TopNavBranding } from "./top-nav-components/top-nav-branding"
import { TopNavGuideFeed, GUIDANCE_TIPS } from "./top-nav-components/top-nav-guide-feed"
import { TopNavControls } from "./top-nav-components/top-nav-controls"

interface TopNavBarProps {
  activeSubjectName?: string
  loadedSubjectsCount?: number
  onShowEncyclopedia?: () => void
  onShowGallery?: () => void
  onImportNew?: () => void
}

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
    <nav className="flex justify-between items-center w-full px-6 h-16 bg-panel fixed top-0 z-50 border-b border-border/60 shadow-[0_0_15px_hsla(var(--primary),0.03)] select-none">
      <TopNavBranding />
      <TopNavGuideFeed tipIndex={tipIndex} setTipIndex={setTipIndex} />
      <TopNavControls
        activeSubjectName={activeSubjectName}
        loadedSubjectsCount={loadedSubjectsCount}
        onImportNew={onImportNew}
      />
    </nav>
  )
}
