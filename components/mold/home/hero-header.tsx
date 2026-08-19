"use client"

import Image from "next/image"
import type { SubjectData, Achievement } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"

interface HeroHeaderProps {
  subject: SubjectData
  achievements: Achievement[]
  onTrophyClick?: () => void
  onChangeSubject?: () => void
  onImportNew?: () => void
  className?: string
}

export function HeroHeader({
  subject,
  achievements,
  onTrophyClick,
  onChangeSubject,
  onImportNew,
  className,
}: HeroHeaderProps) {
  const unlocked = achievements.filter((a) => a.unlockedAt !== null).length
  const total = achievements.length

  return (
    <header className={cn("border-b border-border bg-panel", className)}>
      {/* Unified Control Center Top Bar */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-border/50 bg-panel">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" aria-hidden="true" />
          <Image
            src="/logo.png"
            alt="Finalist"
            width={22}
            height={22}
            className="shrink-0 drop-shadow-[0_0_5px_hsl(var(--primary)/0.6)]"
            priority
          />
          <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold shrink-0">
            MASTERY_PROTOCOL //
          </span>
          <span className="text-xs font-mono font-bold text-foreground uppercase truncate max-w-[180px] sm:max-w-[280px]">
            {subject.name}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <span className="text-border select-none opacity-40">|</span>
          <span>{subject.totalQuestions} QUESTIONS</span>
          <span>{subject.categories.length} SECTORS</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {onChangeSubject && (
            <button
              onClick={onChangeSubject}
              title="Change active subject"
              aria-label="Switch active subject"
              className="text-[10px] font-mono font-bold px-3 py-1.5 border border-border bg-surface text-foreground/90 hover:border-primary/80 hover:text-primary transition-all duration-150 focus-ring min-h-[32px] cursor-pointer"
            >
              SWITCH SUBJECT
            </button>
          )}
          {onImportNew && (
            <button
              onClick={onImportNew}
              title="Import a new subject JSON file"
              aria-label="Import a new subject"
              className="text-[10px] font-mono font-bold px-3 py-1.5 border border-border bg-surface text-foreground/90 hover:border-primary/80 hover:text-primary transition-all duration-150 focus-ring min-h-[32px] cursor-pointer"
            >
              IMPORT NEW
            </button>
          )}

          {hasClerk && (
            <>
              <span className="text-border select-none opacity-40">|</span>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-[10px] font-mono text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 hover:bg-primary/10 transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer">
                    SIGN IN
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-5 h-5 border border-primary/30 rounded-none",
                      userButtonTrigger: "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
                    }
                  }} 
                />
              </Show>
            </>
          )}
        </div>
      </div>

      {/* Main hero */}
      <div className="px-6 py-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <p className="text-xs font-mono tracking-widest text-primary uppercase">
            SUBJECT_LOADED
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground text-balance leading-tight font-display break-words">
            {subject.name}
          </h1>
          <p className="text-sm text-muted-foreground text-pretty max-w-xl leading-relaxed">
            {subject.description}
          </p>
        </div>

        {/* Trophy counter */}
        <div className="flex items-center gap-3 mt-4 sm:mt-0 shrink-0">
          <div className="flex flex-col items-end gap-1" role="status" aria-live="polite">
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">ACHIEVEMENTS</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-primary leading-none">
              {unlocked}
              <span className="text-muted-foreground text-sm font-normal">/{total}</span>
            </p>
            {/* Visual Progress Track */}
            <div 
              className="w-20 sm:w-24 h-1 bg-secondary border border-border/50 rounded-full overflow-hidden mt-0.5" 
              aria-hidden="true"
            >
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${total > 0 ? (unlocked / total) * 100 : 0}%` }} 
              />
            </div>
          </div>
          {onTrophyClick ? (
            <button
              onClick={onTrophyClick}
              className={cn(
                "w-12 h-12 rounded border flex items-center justify-center text-xl transition-all duration-150 active:scale-95",
                unlocked === total
                  ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                  : "border-border bg-secondary text-muted-foreground hover:border-primary/60 hover:text-primary",
                "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
              title={`${unlocked} of ${total} achievements unlocked — click to view gallery`}
              aria-label={`View achievements gallery (${unlocked} of ${total} unlocked)`}
            >
              <TrophyIcon className="w-6 h-6" />
            </button>
          ) : (
            <div
              className={cn(
                "w-12 h-12 rounded border flex items-center justify-center text-xl",
                unlocked === total
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground"
              )}
              title={`${unlocked} of ${total} achievements unlocked`}
            >
              <TrophyIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
