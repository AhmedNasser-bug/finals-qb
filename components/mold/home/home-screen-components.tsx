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
    <nav aria-label="Main mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131313] border-t border-border z-50 flex justify-around items-center px-4 select-none">
      <button
        title="Core"
        aria-label="Core"
        onClick={() => {
          setView("home")
          handleModeSelect("speedrun")
        }}
        className={cn(
          "flex flex-col items-center gap-1 cursor-pointer transition-colors focus-ring p-1",
          view === "home" ? "text-primary" : "text-[var(--tw-hex-fecc17)]/40"
        )}
      >
        <TerminalIcon className="w-4 h-4" />
        <span className="font-mono text-[8px] font-bold">CORE</span>
      </button>

      <button
        title="Stats"
        aria-label="Stats"
        onClick={() => setView("stats")}
        className={cn(
          "flex flex-col items-center gap-1 cursor-pointer transition-colors focus-ring p-1",
          view === "stats" ? "text-primary" : "text-[var(--tw-hex-fecc17)]/40"
        )}
      >
        <BarChart3 className="w-4 h-4" />
        <span className="font-mono text-[8px] font-bold">STATS</span>
      </button>

      <button
        title="Data"
        aria-label="Data"
        onClick={() => setShowEncyclopedia(true)}
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <BookOpen className="w-4 h-4" />
        <span className="font-mono text-[8px] font-bold">DATA</span>
      </button>

      <button
        title="Achievements"
        aria-label="Achievements"
        onClick={() => setShowGallery(true)}
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <Trophy className="w-4 h-4" />
        <span className="font-mono text-[8px] font-bold">ACHS</span>
      </button>

      <button
        title="Switch Subject"
        aria-label="Switch Subject"
        onClick={onChangeSubject}
        className="flex flex-col items-center gap-1 text-[var(--tw-hex-fecc17)]/40 hover:text-primary transition-colors cursor-pointer p-1"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="font-mono text-[8px] font-bold">SWITCH</span>
      </button>
    </nav>
  )
}
