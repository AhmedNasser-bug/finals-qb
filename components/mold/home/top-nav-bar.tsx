"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"

import {
  Palette,
  LayoutGrid,
  BookOpen,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Activity,
  MessageSquarePlus,
  Menu,
  X,
  FolderDown,
  ExternalLink,
} from "lucide-react"
import { GuideLink } from "@/components/mold/common/guide-link"
import { MobileTopNavDrawer } from "@/components/mold/home/mobile-top-nav-drawer"
import { isAudioMuted, toggleAudioMute } from "@/lib/audio/sound-engine"
import { useColorTheme } from "@/lib/themes/theme-context"
import { usePurchases } from "@/lib/revenuecat/purchases-context"

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
  const { hasAiEntitlement, openPaywall } = usePurchases()
  const [tipIndex, setTipIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMuted(isAudioMuted())
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }
      if (e.key === "m" || e.key === "M") {
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

  // Auto-close mobile drawer on click outside or Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [mobileMenuOpen])

  return (
    <nav className="flex justify-between items-center w-full px-3 sm:px-6 h-16 bg-panel fixed top-0 z-50 border-b border-border/60 shadow-[0_0_15px_hsla(var(--primary),0.03)] select-none">
      {/* Left branding block */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <ProtocolIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <div>
          <p className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase leading-none">FINALIST</p>
          <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">STUDY SYSTEM</p>
        </div>
      </div>

      {/* Center: guide feed + pulsating GUIDE button */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md lg:max-w-2xl xl:max-w-[900px] mx-4">
        {/* Feed bar — clickable to cycle tips */}
        <button type="button"
          onClick={() => setTipIndex((prev) => (prev + 1) % GUIDANCE_TIPS.length)}
          title="Click to cycle next study tip"
          aria-label="Cycle to next study recommendation"
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
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* AI Pass Button */}
        <button
          onClick={() => openPaywall()}
          title={hasAiEntitlement ? "Finalists AI Active — Tap to view details" : "Upgrade to Finalists AI — Tap to unlock"}
          aria-label={hasAiEntitlement ? "Finalists AI Active" : "Upgrade to Finalists AI"}
          type="button"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest uppercase rounded transition-all focus-ring cursor-pointer min-h-[30px] select-none shrink-0 ${
            hasAiEntitlement
              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_10px_hsla(160,84%,39%,0.15)]"
              : "border border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-black shadow-[0_0_12px_hsla(var(--primary),0.2)] group"
          }`}
        >
          <Sparkles className={`w-3 h-3 ${hasAiEntitlement ? "text-emerald-400" : "text-primary group-hover:text-black"}`} aria-hidden="true" />
          <span>{hasAiEntitlement ? "AI PASS" : "AI PASS"}</span>
        </button>

        {/* Active Subject Badge (desktop only) */}
        {activeSubjectName && (
          <span
            className="hidden lg:inline-flex text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase truncate max-w-[140px] xl:max-w-[200px] rounded"
            title={activeSubjectName}
          >
            {activeSubjectName}
          </span>
        )}

        {/* Loaded Subjects Count (large desktop only) */}
        {loadedSubjectsCount !== undefined && (
          <span className="hidden xl:inline-flex text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase shrink-0 rounded">
            {loadedSubjectsCount} SUBJECT{loadedSubjectsCount !== 1 ? "S" : ""} LOADED
          </span>
        )}

        {/* Audio Toggle (desktop/tablet) */}
        <button type="button"
          onClick={() => setMuted(toggleAudioMute())}
          title={muted ? "Unmute audio synthesizer (Press M)" : "Mute audio synthesizer (Press M)"}
          aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
          className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Volume2 className="w-4 h-4 text-primary" aria-hidden="true" />
          )}
        </button>

        {/* Quick Mode Toggle (Light/Dark) (desktop/tablet) */}
        <button type="button"
          onClick={toggleMode}
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
        >
          {themeMode === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-primary" aria-hidden="true" />
          )}
        </button>

        {/* Color Palette Modal Trigger (desktop/tablet) */}
        {onShowThemeModal && (
          <button type="button"
            onClick={onShowThemeModal}
            title="Change color theme palette"
            aria-label="Open color theme switcher"
            className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
          >
            <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
          </button>
        )}

        {/* Workspace Layout Grid Trigger (desktop) */}
        {onShowLayoutModal && (
          <button type="button"
            onClick={onShowLayoutModal}
            title="Switch workspace page layout"
            aria-label="Open page layout switcher"
            className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden md:flex items-center justify-center shrink-0 rounded"
          >
            <LayoutGrid className="w-4 h-4 text-primary" aria-hidden="true" />
          </button>
        )}

        {/* Import Subject JSON Trigger (desktop) */}
        {onImportNew && (
          <button type="button"
            onClick={onImportNew}
            title="Import New Subject JSON"
            aria-label="Import new subject from JSON file"
            className="p-1.5 border border-border text-primary/80 hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden md:flex items-center justify-center shrink-0 rounded"
          >
            <span className="font-mono text-[9px] font-bold px-1 uppercase tracking-wider">IMPORT</span>
          </button>
        )}

        {/* Analytics Telemetry Lab Link (desktop/tablet) */}
        <Link
          href="/analytics"
          title="Open Microsoft Clarity & Lighthouse Analytics Lab"
          aria-label="Open Telemetry and Lighthouse Analytics Lab"
          className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
        >
          <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
        </Link>

        {/* Feedback Submission Form */}
        <a
          href="https://docs.google.com/forms/d/1LrdMb8QiGbB01tDw6DJd-tQl_ix3ldxaSND-4vkKJJc/edit"
          target="_blank"
          rel="noopener noreferrer"
          title="Submit Feedback & Feature Requests (opens Google Form)"
          aria-label="Submit Feedback Form (opens in new tab)"
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest uppercase rounded border border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all focus-ring cursor-pointer min-h-[30px] select-none group shadow-[0_0_12px_hsla(var(--primary),0.15)] shrink-0"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-primary group-hover:text-black transition-colors shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">FEEDBACK</span>
        </a>

        {/* Mobile Menu Drawer Toggle (mobile only) */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-top-nav-drawer"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="sm:hidden p-1.5 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0 rounded"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4 text-primary" aria-hidden="true" />
          ) : (
            <Menu className="w-4 h-4 text-primary" aria-hidden="true" />
          )}
        </button>

        {/* Clerk Auth Section */}
        {hasClerk && (
          <div className="flex items-center border-l border-zinc-800/60 pl-2 sm:pl-3 min-h-[28px] shrink-0">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className="text-[10px] font-mono font-bold text-primary border border-primary/20 bg-primary/5 px-2 py-1 hover:bg-primary/10 transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer">
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

      {/* Floating Mobile Drawer */}
      {mobileMenuOpen && (
        <MobileTopNavDrawer
          mobileMenuRef={mobileMenuRef}
          activeSubjectName={activeSubjectName}
          loadedSubjectsCount={loadedSubjectsCount}
          muted={muted}
          setMuted={setMuted}
          toggleAudioMute={toggleAudioMute}
          themeMode={themeMode}
          toggleMode={toggleMode}
          onShowThemeModal={onShowThemeModal}
          setMobileMenuOpen={setMobileMenuOpen}
          onShowLayoutModal={onShowLayoutModal}
          onImportNew={onImportNew}
        />
      )}
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
