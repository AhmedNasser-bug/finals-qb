"use client"

import { useState } from "react"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"
import { GuideOverlay } from "@/components/mold/common/guide-overlay"
import { TopNavTips } from "./top-nav-tips"

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
  // Guide state lives here — no prop drilling needed anywhere
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      <nav className="flex justify-between items-center w-full px-6 h-16 bg-[#0d0e11] fixed top-0 z-50 border-b border-border/50 shadow-[0_0_15px_rgba(254,204,23,0.02)] select-none">
        {/* Left branding block */}
        <div className="flex items-center gap-2.5">
          <ProtocolIcon className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-[#fecc17] uppercase leading-none">FINALIST</p>
            <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">STUDY SYSTEM</p>
          </div>
        </div>

        {/* Center: guide feed + pulsating GUIDE button */}
        <TopNavTips onShowGuide={() => setShowGuide(true)} />

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {activeSubjectName && (
            <span
              className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase truncate max-w-[120px] sm:max-w-[200px]"
              title={activeSubjectName}
            >
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
              className="p-1.5 border border-zinc-800 text-[#fecc17]/60 hover:text-primary hover:bg-zinc-800/40 hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[28px] hidden sm:flex items-center justify-center shrink-0"
            >
              <span className="font-mono text-[9px] font-bold px-1 uppercase tracking-wider">IMPORT</span>
            </button>
          )}

          {/* Mobile GUIDE button */}
          <button
            onClick={() => setShowGuide(true)}
            title="Open User Guide"
            aria-label="Open User Guide"
            className="md:hidden p-1.5 border border-[#fecc17]/30 text-[#fecc17]/70 hover:text-primary hover:border-primary/60 transition-all focus-ring cursor-pointer min-h-[28px] flex items-center justify-center shrink-0 relative"
          >
            <span aria-hidden="true" className="absolute inset-0 border border-[#fecc17]/15 animate-pulse pointer-events-none" />
            <BookIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

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

      {/* Guide overlay — mounted here, z-[60] sits above the nav z-50 */}
      <GuideOverlay open={showGuide} onClose={() => setShowGuide(false)} />
    </>
  )
}

function ProtocolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
