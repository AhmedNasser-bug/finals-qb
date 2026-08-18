"use client"

import { 
  Terminal as TerminalIcon, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Plus,
  BarChart3,
  Sparkles,
  Download,
  FileText
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
  onDownloadPdf: () => void
  onDownloadSolvedPdf: () => void
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
  onDownloadPdf,
  onDownloadSolvedPdf,
}: SideNavBarProps) {
  return (
    <aside className="hidden md:flex flex-col gap-2 p-4 w-64 h-[calc(100vh-64px)] bg-panel border-r border-border fixed left-0 top-16 z-40 select-none">
      <div className="mb-6 px-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary border-glow">
            <TerminalIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">STUDY PROFILE</div>
            <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-tighter truncate">
              ID: {subjectId.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5" aria-label="Main application navigation">
        <button 
          onClick={onShowDashboard}
          title="Navigate to Dashboard (Mode Selection and Session Configuration)"
          aria-label="Navigate to Dashboard mode selection and session setup"
          className={cn(
            "flex items-center gap-3 p-3 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded transition-all focus-ring",
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
            "flex items-center gap-3 p-3 font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded transition-all focus-ring",
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
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> <span>Encyclopedia</span>
        </button>

        <button 
          onClick={onShowGallery}
          title="View unlocked trophies, badges, and mastery achievements"
          aria-label="View unlocked trophies, badges, and mastery achievements"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> <span>Achievements</span>
        </button>
        <button 
          onClick={onChangeSubject}
          title="Switch to another subject module in your library"
          aria-label="Switch to another subject module in your library"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> <span>Switch Subject</span>
        </button>
        <button 
          onClick={onImportNew}
          title="Import new custom subject from a JSON document"
          aria-label="Import new custom subject from a JSON document"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" /> <span>Import JSON</span>
        </button>
        <button 
          onClick={onAddQuestions}
          title="Open AI Pedagogical Question Generator Wizard"
          aria-label="Open AI Pedagogical Question Generator Wizard"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Add questions</span>
        </button>
        <button 
          onClick={onDownloadHtml}
          title="Export offline interactive HTML study package"
          aria-label="Export offline interactive HTML study package"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> <span>Download Q&A Sheet</span>
        </button>
        <button 
          onClick={onDownloadPdf}
          title="Generate clean printable PDF question sheet"
          aria-label="Generate clean printable PDF question sheet"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <FileText className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Questions PDF</span>
        </button>
        <button 
          onClick={onDownloadSolvedPdf}
          title="Generate complete solved PDF with explanations, hints, and diagrams"
          aria-label="Generate complete solved PDF with explanations, hints, and diagrams"
          className="flex items-center gap-3 text-muted-foreground p-3 hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> <span>Solved Questions PDF</span>
        </button>
      </nav>

      <div className="mt-auto pt-4 border-t border-border/60">
        <button 
          onClick={onInitialize}
          title="Launch active game session (Press Enter)"
          aria-label="Start active quiz session"
          className="w-full bg-secondary/80 hover:bg-primary/15 text-primary hover:border-primary/60 border border-border font-mono text-[10px] py-3.5 tracking-[0.2em] transition-all font-bold cursor-pointer rounded focus-ring"
        >
          START QUIZ
        </button>
      </div>
    </aside>
  )
}
