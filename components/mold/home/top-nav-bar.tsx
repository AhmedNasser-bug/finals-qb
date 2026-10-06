"use client"

import { useState, useEffect } from "react"
import { hasClerk } from "@/lib/user-storage"
import { isAudioMuted, toggleAudioMute } from "@/lib/audio/sound-engine"
import { useColorTheme } from "@/lib/themes/theme-context"

import { BrandingBlock, GuideFeed, Controls } from "./top-nav-bar-components"

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
  const { themeMode, toggleMode } = useColorTheme()
  const [tipIndex, setTipIndex] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setMuted(isAudioMuted())

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }

      if (e.key.toLowerCase() === "m") {
        e.preventDefault()
        setMuted(toggleAudioMute())
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="flex justify-between items-center w-full px-6 h-16 bg-panel fixed top-0 z-50 border-b border-border/60 shadow-[0_0_15px_hsla(var(--primary),0.03)] select-none">
      <BrandingBlock />

      <GuideFeed
        tipIndex={tipIndex}
        tips={GUIDANCE_TIPS}
        onCycleTip={() => setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)}
      />

      <Controls
        activeSubjectName={activeSubjectName}
        loadedSubjectsCount={loadedSubjectsCount}
        muted={muted}
        themeMode={themeMode}
        hasClerk={hasClerk}
        onToggleMute={() => setMuted(toggleAudioMute())}
        onToggleMode={toggleMode}
        onShowThemeModal={onShowThemeModal}
        onShowLayoutModal={onShowLayoutModal}
        onImportNew={onImportNew}
      />
    </nav>
  )
}
