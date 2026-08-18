"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Terminal as TerminalIcon, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Plus,
  BarChart3,
  Sparkles,
  FileText,
  FileCode,
  FileCheck,
  ChevronDown,
  ChevronRight,
  FolderDown,
  HelpCircle
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
  const [exportExpanded, setExportExpanded] = useState(true)

  return (
    <aside className="hidden md:flex flex-col gap-3 p-4 w-64 h-[calc(100vh-64px)] bg-panel border-r border-border fixed left-0 top-16 z-40 select-none overflow-y-auto">
      {/* Subject Identity Header */}
      <div className="px-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary border-glow shrink-0">
            <TerminalIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">STUDY PROFILE</div>
            <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-tighter truncate">
              ID: {subjectId.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-3 flex-1" aria-label="Main application navigation">
        {/* ── Section: Views & Progression ── */}
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

          <Link
            href={subjectId ? `/guide?subject=${encodeURIComponent(subjectId)}` : "/guide"}
            title="Open comprehensive user usage guide, game modes manual, and cognitive strategies"
            aria-label="Open comprehensive user usage guide"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" /> <span>User Guide</span>
          </Link>
        </div>

        {/* ── Section: Subject & Question Bank ── */}
        <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
          <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
            SUBJECT BANK
          </span>
          <button 
            onClick={onChangeSubject}
            title="Switch to another subject module in your library"
            aria-label="Switch to another subject module in your library"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> <span>Switch Subject</span>
          </button>
          
          <button 
            onClick={onAddQuestions}
            title="Open AI Pedagogical Question Generator Wizard"
            aria-label="Open AI Pedagogical Question Generator Wizard"
            className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span>Add questions</span>
            </div>
            <span className="font-mono text-[8px] font-bold px-1 py-0.2 border border-primary/30 bg-primary/10 text-primary rounded tracking-wider">
              AI
            </span>
          </button>

          <button 
            onClick={onImportNew}
            title="Import new custom subject from a JSON document"
            aria-label="Import new custom subject from a JSON document"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> <span>Import JSON</span>
          </button>
        </div>

        {/* ── Section: Bundled Export & Study Materials ── */}
        <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
          <button
            type="button"
            onClick={() => setExportExpanded(!exportExpanded)}
            aria-expanded={exportExpanded}
            aria-controls="study-exports-bundle"
            title="Toggle Export Study Materials menu"
            className="flex items-center justify-between px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-full text-left rounded focus-ring"
          >
            <div className="flex items-center gap-2">
              <FolderDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                STUDY EXPORTS
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[8px] text-muted-foreground/70 bg-secondary px-1 py-0.2 rounded border border-border">
                3
              </span>
              {exportExpanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          </button>

          {exportExpanded && (
            <div id="study-exports-bundle" className="flex flex-col gap-1 pl-2 border-l-2 border-primary/20 ml-3.5 py-0.5 animate-slide-up">
              <button 
                onClick={onDownloadHtml}
                title="Export offline interactive HTML study package"
                aria-label="Export offline interactive HTML study package"
                className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3 h-3 text-sky-400 shrink-0" aria-hidden="true" />
                  <span className="truncate">HTML Sheet</span>
                </div>
                <span className="font-mono text-[8px] px-1 py-0.2 text-sky-400 bg-sky-400/10 border border-sky-400/20 rounded">
                  HTML
                </span>
              </button>

              <button 
                onClick={onDownloadPdf}
                title="Generate clean printable PDF question sheet"
                aria-label="Generate clean printable PDF question sheet"
                className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                  <span className="truncate">Questions PDF</span>
                </div>
                <span className="font-mono text-[8px] px-1 py-0.2 text-primary bg-primary/10 border border-primary/20 rounded">
                  PDF
                </span>
              </button>

              <button 
                onClick={onDownloadSolvedPdf}
                title="Generate complete solved PDF with explanations, hints, and diagrams"
                aria-label="Generate complete solved PDF with explanations, hints, and diagrams"
                className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="truncate">Solved PDF</span>
                </div>
                <span className="font-mono text-[8px] px-1 py-0.2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded">
                  SOLVED
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-auto pt-3 border-t border-border/60">
        <button 
          onClick={onInitialize}
          title="Launch active game session (Press Enter)"
          aria-label="Start active quiz session"
          className="w-full bg-secondary/80 hover:bg-primary/15 text-primary hover:border-primary/60 border border-border font-mono text-[10px] py-3 tracking-[0.2em] transition-all font-bold cursor-pointer rounded focus-ring"
        >
          START QUIZ [↵]
        </button>
      </div>
    </aside>
  )
}
