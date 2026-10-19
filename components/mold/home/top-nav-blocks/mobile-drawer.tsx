import React, { RefObject } from 'react'
import Link from 'next/link'
import {
  VolumeX,
  Volume2,
  Sun,
  Moon,
  Palette,
  LayoutGrid,
  FolderDown,
  Activity,
  BookOpen,
  MessageSquarePlus,
  ExternalLink,
} from 'lucide-react'
import { GuideLink } from '@/components/mold/common/guide-link'

export interface MobileDrawerProps {
  mobileMenuOpen: boolean
  mobileMenuRef: RefObject<HTMLDivElement | null>
  activeSubjectName?: string
  loadedSubjectsCount?: number
  muted: boolean
  toggleAudioMute: () => boolean
  setMuted: (muted: boolean) => void
  themeMode: 'light' | 'dark'
  toggleMode: () => void
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
  onImportNew?: () => void
  setMobileMenuOpen: (open: boolean) => void
}

export function MobileDrawer({
  mobileMenuOpen,
  mobileMenuRef,
  activeSubjectName,
  loadedSubjectsCount,
  muted,
  toggleAudioMute,
  setMuted,
  themeMode,
  toggleMode,
  onShowThemeModal,
  onShowLayoutModal,
  onImportNew,
  setMobileMenuOpen,
}: MobileDrawerProps) {
  if (!mobileMenuOpen) return null

  return (
    <div
      ref={mobileMenuRef}
      id="mobile-top-nav-drawer"
      role="region"
      aria-label="Mobile navigation menu"
      className="fixed top-16 left-0 right-0 w-full max-h-[calc(100vh-4rem)] overflow-y-auto bg-panel/95 backdrop-blur-md border-b border-border/80 shadow-2xl p-4 sm:hidden z-50 animate-slide-up flex flex-col gap-3 font-mono select-none"
    >
      {/* Active Subject and Count card */}
      {(activeSubjectName || loadedSubjectsCount !== undefined) && (
        <div className="flex items-center justify-between p-2.5 bg-secondary/60 border border-border/60 rounded">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-none">ACTIVE SUBJECT</p>
              <p className="text-xs font-bold text-foreground truncate mt-1">{activeSubjectName || "Default Subject"}</p>
            </div>
          </div>
          {loadedSubjectsCount !== undefined && (
            <span className="text-[9px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 tracking-wider uppercase shrink-0 rounded">
              {loadedSubjectsCount} LOADED
            </span>
          )}
        </div>
      )}

      {/* Controls Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => setMuted(toggleAudioMute())}
          aria-label={muted ? "Unmute audio synthesizer" : "Mute audio synthesizer"}
          className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold">AUDIO</span>
          {muted ? (
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <VolumeX className="w-3.5 h-3.5" aria-hidden="true" /> OFF
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] text-primary">
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> ON
            </span>
          )}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={toggleMode}
          aria-label={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold">THEME</span>
          <span className="flex items-center gap-1 text-[9px] text-primary">
            {themeMode === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> LIGHT
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> DARK
              </>
            )}
          </span>
        </button>

        {/* Color Palette modal trigger */}
        {onShowThemeModal && (
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onShowThemeModal()
            }}
            aria-label="Open color theme switcher"
            className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
          >
            <span className="text-[10px] tracking-wider uppercase font-bold">PALETTES</span>
            <Palette className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </button>
        )}

        {/* Page layout switcher */}
        {onShowLayoutModal && (
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onShowLayoutModal()
            }}
            aria-label="Open page layout switcher"
            className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
          >
            <span className="text-[10px] tracking-wider uppercase font-bold">LAYOUT</span>
            <LayoutGrid className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </button>
        )}

        {/* Import subject JSON */}
        {onImportNew && (
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onImportNew()
            }}
            aria-label="Import new subject from JSON file"
            className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
          >
            <span className="text-[10px] tracking-wider uppercase font-bold">IMPORT JSON</span>
            <FolderDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </button>
        )}

        {/* Telemetry and Analytics Lab Link */}
        <Link
          href="/analytics"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Open Telemetry and Lighthouse Analytics Lab"
          className="flex items-center justify-between p-2.5 bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary text-foreground text-left transition-all rounded focus-ring cursor-pointer"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold">ANALYTICS LAB</span>
          <Activity className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
        </Link>
      </div>

      {/* Full-width action links */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
        {/* Guide Link */}
        <GuideLink
          source="mobile_drawer"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/30 hover:bg-primary/15 text-primary transition-all rounded focus-ring cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-wider uppercase">USER GUIDE & STRATEGIES</span>
          </div>
          <span className="text-[9px] tracking-wider text-muted-foreground uppercase">READ</span>
        </GuideLink>

        {/* Feedback Submission Form */}
        <a
          href="https://docs.google.com/forms/d/1LrdMb8QiGbB01tDw6DJd-tQl_ix3ldxaSND-4vkKJJc/edit"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Submit Feedback Form (opens in new tab)"
          className="flex items-center justify-between p-2.5 bg-primary/10 border border-primary/50 hover:bg-primary hover:text-black text-primary transition-all rounded group focus-ring cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-primary group-hover:text-black transition-colors" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-wider uppercase">SUBMIT FEEDBACK</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-primary group-hover:text-black transition-colors" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
