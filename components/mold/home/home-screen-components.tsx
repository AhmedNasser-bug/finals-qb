import {
  Terminal as TerminalIcon,
  BarChart3,
  BookOpen,
  Trophy,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AppView } from "./home-screen-types"
import type { GameModeId } from "@/lib/mold-types"

interface MobileBottomNavBarProps {
  view: AppView
  setView: (view: AppView) => void
  handleModeSelect: (id: GameModeId) => void
  setShowEncyclopedia: (show: boolean) => void
  setShowGallery: (show: boolean) => void
  onChangeSubject: () => void
}

export function MobileBottomNavBar({
  view,
  setView,
  handleModeSelect,
  setShowEncyclopedia,
  setShowGallery,
  onChangeSubject,
}: MobileBottomNavBarProps) {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131313] border-t border-border z-50 flex justify-around items-center px-4 select-none">
      <button
        onClick={() => {
          setView("home")
          handleModeSelect("speedrun")
        }}
        aria-label="Core Game Mode"
        title="Core Game Mode"
        className={cn(
          "flex flex-col items-center gap-1 cursor-pointer transition-colors focus-ring p-1",
          view === "home" ? "text-primary" : "text-[var(--tw-hex-fecc17)]/40"
        )}
      >
        <TerminalIcon className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[8px] font-bold">CORE</span>
      </button>

      <button
        onClick={() => setView("stats")}
        aria-label="View Statistics"
        title="View Statistics"
        className={cn(
          "flex flex-col items-center gap-1 cursor-pointer transition-colors focus-ring p-1",
          view === "stats" ? "text-primary" : "text-[var(--tw-hex-fecc17)]/40"
        )}
      >
        <BarChart3 className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[8px] font-bold">STATS</span>
      </button>

      <button
        onClick={() => setShowEncyclopedia(true)}
        aria-label="View Data Encyclopedia"
        title="View Data Encyclopedia"
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[8px] font-bold">DATA</span>
      </button>

      <button
        onClick={() => setShowGallery(true)}
        aria-label="View Achievements"
        title="View Achievements"
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <Trophy className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[8px] font-bold">ACHS</span>
      </button>

      <button
        onClick={onChangeSubject}
        aria-label="Switch Subject"
        title="Switch Subject"
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span className="font-mono text-[8px] font-bold">SWITCH</span>
      </button>
    </footer>
  )
}
