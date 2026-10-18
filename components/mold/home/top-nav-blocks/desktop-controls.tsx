"use client"

import React from "react"
import Link from "next/link"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import {
  Palette,
  LayoutGrid,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Activity,
  MessageSquarePlus,
  Menu,
  X,
} from "lucide-react"

interface DesktopControlsProps {
  hasAiEntitlement: boolean
  openPaywall: () => void
  activeSubjectName?: string
  loadedSubjectsCount?: number
  muted: boolean
  setMuted: (val: boolean) => void
  toggleAudioMute: () => boolean
  themeMode: string
  toggleMode: () => void
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
  onImportNew?: () => void
  menuButtonRef: React.RefObject<HTMLButtonElement | null>
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  hasClerk: boolean
}

export function DesktopControls({
  hasAiEntitlement,
  openPaywall,
  activeSubjectName,
  loadedSubjectsCount,
  muted,
  setMuted,
  toggleAudioMute,
  themeMode,
  toggleMode,
  onShowThemeModal,
  onShowLayoutModal,
  onImportNew,
  menuButtonRef,
  mobileMenuOpen,
  setMobileMenuOpen,
  hasClerk,
}: DesktopControlsProps) {
  return (
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
        <span
          className="hidden xl:inline-flex text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase rounded"
          title={`${loadedSubjectsCount} total subjects loaded in memory`}
        >
          {loadedSubjectsCount} LOADED
        </span>
      )}

      {/* Audio Mute Toggle (desktop/tablet) */}
      <button type="button"
        onClick={() => setMuted(toggleAudioMute())}
        title={muted ? "Unmute Sound" : "Mute Sound"}
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
  )
}
