"use client"

import {
  Terminal as TerminalIcon,
  BookOpen,
  Trophy,
  RotateCcw,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type GameModeId } from "@/lib/mold-types"

type AppView = "home" | "game" | "stats"

interface BottomMobileNavProps {
  view: AppView
  setView: (view: AppView) => void
  handleModeSelect: (id: GameModeId) => void
  setShowEncyclopedia: (show: boolean) => void
  setShowGallery: (show: boolean) => void
  onChangeSubject: () => void
}

export function BottomMobileNav({
  view,
  setView,
  handleModeSelect,
  setShowEncyclopedia,
  setShowGallery,
  onChangeSubject,
}: BottomMobileNavProps) {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-panel/95 backdrop-blur-md border-t border-border z-50 flex justify-around items-center px-2 select-none" role="contentinfo">
      <button type="button"
        onClick={() => {
          setView("home")
          handleModeSelect("speedrun")
        }}
        title="Open Core Dashboard"
        aria-label="Open Core Dashboard"
        aria-current={view === "home" ? "page" : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] min-w-[48px] px-2 py-1",
          view === "home" 
            ? "text-primary before:absolute before:top-0 before:h-0.5 before:w-8 before:bg-primary before:rounded-full before:shadow-[0_0_8px_hsl(var(--primary))]" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <TerminalIcon className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[9px] font-bold tracking-wider">CORE</span>
      </button>

      <button type="button"
        onClick={() => setView("stats")}
        title="Open Stats Dashboard"
        aria-label="Open Stats Dashboard"
        aria-current={view === "stats" ? "page" : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] min-w-[48px] px-2 py-1",
          view === "stats" 
            ? "text-primary before:absolute before:top-0 before:h-0.5 before:w-8 before:bg-primary before:rounded-full before:shadow-[0_0_8px_hsl(var(--primary))]" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <BarChart3 className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[9px] font-bold tracking-wider">STATS</span>
      </button>

      <button type="button"
        onClick={() => setShowEncyclopedia(true)}
        title="Open Encyclopedia"
        aria-label="Data: Open Encyclopedia"
        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] min-w-[48px] px-2 py-1"
      >
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[9px] font-bold tracking-wider">DATA</span>
      </button>

      <button type="button"
        onClick={() => setShowGallery(true)}
        title="Open Achievement Gallery"
        aria-label="Achs: Open Achievement Gallery"
        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] min-w-[48px] px-2 py-1"
      >
        <Trophy className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[9px] font-bold tracking-wider">ACHS</span>
      </button>

      <button type="button"
        onClick={onChangeSubject}
        title="Switch Subject"
        aria-label="Switch Subject"
        className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] min-w-[48px] px-2 py-1"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[9px] font-bold tracking-wider">SWITCH</span>
      </button>
    </footer>
  )
}
