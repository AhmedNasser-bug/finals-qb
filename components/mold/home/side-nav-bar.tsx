"use client"

import { 
  Terminal as TerminalIcon, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Plus,
  BarChart3,
  Sparkles,
  Download
} from "lucide-react"

import { cn } from "@/lib/utils"

interface SideNavBarProps {
  subjectId: string
  activeView: "home" | "stats"
  onShowDashboard: () => void
  onShowStats: () => void
  onShowEncyclopedia: () => void
  onShowGallery: () => void
  onChangeSubject: () => void
  onImportNew: () => void
  onAddQuestions: () => void
  onInitialize: () => void
  onDownloadHtml: () => void
}

export function SideNavBar({
  subjectId,
  activeView,
  onShowDashboard,
  onShowStats,
  onShowEncyclopedia,
  onShowGallery,
  onChangeSubject,
  onImportNew,
  onAddQuestions,
  onInitialize,
  onDownloadHtml,
}: SideNavBarProps) {
  return (
    <aside className="hidden md:flex flex-col gap-2 p-4 w-64 h-[calc(100vh-64px)] bg-[#1c1b1b] border-r border-border fixed left-0 top-16 z-40 select-none">
      <div className="mb-6 px-3 border-b border-zinc-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[var(--tw-hex-fecc17)]/5 border border-[var(--tw-hex-fecc17)]/20 flex items-center justify-center text-primary border-glow">
            <TerminalIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#fecc17] font-bold">STUDY PROFILE</div>
            <div className="font-mono text-[8px] text-zinc-500 uppercase tracking-tighter truncate">
              ID: {subjectId.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        <button 
          onClick={onShowDashboard}
          title="Dashboard"
          aria-label="Dashboard"
          className={cn(
            "flex items-center gap-3 p-3 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm transition-all",
            activeView === "home" 
              ? "bg-[#fecc17] text-black font-bold border-glow" 
              : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
          )}
        >
          <TerminalIcon className="w-3.5 h-3.5" /> <span>Dashboard</span>
        </button>

        <button 
          onClick={onShowStats}
          className={cn(
            "flex items-center gap-3 p-3 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm transition-all",
            activeView === "stats" 
              ? "bg-[#fecc17] text-black font-bold border-glow" 
              : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
          )}
        >
          <BarChart3 className="w-3.5 h-3.5" /> <span>Statistics</span>
        </button>

        <button 
          onClick={onShowEncyclopedia}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <BookOpen className="w-3.5 h-3.5" /> <span>Encyclopedia</span>
        </button>

        <button 
          onClick={onShowGallery}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <Trophy className="w-3.5 h-3.5" /> <span>Achievements</span>
        </button>
        <button 
          onClick={onChangeSubject}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" /> <span>Switch Subject</span>
        </button>
        <button 
          onClick={onImportNew}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <Plus className="w-3.5 h-3.5" /> <span>Import JSON</span>
        </button>
        <button 
          onClick={onAddQuestions}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" /> <span>Add questions</span>
        </button>
        <button 
          onClick={onDownloadHtml}
          className="flex items-center gap-3 text-zinc-400 p-3 hover:bg-zinc-800/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded-sm"
        >
          <Download className="w-3.5 h-3.5" /> <span>Download Q&A Sheet</span>
        </button>
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-800/60">
        <button 
          onClick={onInitialize}
          className="w-full bg-[#131313] hover:bg-[var(--tw-hex-fecc17)]/5 text-primary hover:border-primary/60 border border-zinc-800 font-mono text-[10px] py-3.5 tracking-[0.2em] transition-all font-bold cursor-pointer hover-scale-premium"
        >
          START QUIZ
        </button>
      </div>
    </aside>
  )
}
