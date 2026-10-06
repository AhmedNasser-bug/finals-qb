import { Terminal as TerminalIcon, BarChart3, BookOpen, Trophy, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { GuideLink } from "@/components/mold/common/guide-link"

interface NavigationSectionProps {
  activeView: "home" | "stats"
  onShowDashboard: () => void
  onShowStats: () => void
  onShowEncyclopedia: () => void
  onShowGallery: () => void
}

export function NavigationSection({
  activeView,
  onShowDashboard,
  onShowStats,
  onShowEncyclopedia,
  onShowGallery,
}: NavigationSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
        NAVIGATION
      </span>
      <button
        onClick={onShowDashboard}
        title="Navigate to Dashboard (Mode Selection and Session Configuration)"
        aria-label="Navigate to Dashboard mode selection and session setup"
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded transition-all focus-ring",
          activeView === "home"
            ? "bg-primary text-primary-foreground font-bold border-glow"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <TerminalIcon className="w-3.5 h-3.5" aria-hidden="true" /> <span>Dashboard</span>
      </button>

      <button
        onClick={onShowStats}
        title="View comprehensive study statistics, daily missions, and performance history"
        aria-label="View comprehensive study statistics, daily missions, and performance history"
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded transition-all focus-ring",
          activeView === "stats"
            ? "bg-primary text-primary-foreground font-bold border-glow"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" /> <span>Statistics</span>
      </button>

      <button
        onClick={onShowEncyclopedia}
        title="Open interactive subject encyclopedia and key terminology definitions"
        aria-label="Open interactive subject encyclopedia and key terminology definitions"
        className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
      >
        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> <span>Encyclopedia</span>
      </button>

      <button
        onClick={onShowGallery}
        title="View unlocked trophies, badges, and mastery achievements"
        aria-label="View unlocked trophies, badges, and mastery achievements"
        className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
      >
        <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> <span>Achievements</span>
      </button>

      <GuideLink
        source="side_nav"
        title="Open comprehensive user usage guide, game modes manual, and cognitive strategies"
        aria-label="Open comprehensive user usage guide"
        className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
      >
        <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" /> <span>User Guide</span>
      </GuideLink>
    </div>
  )
}
