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
  Palette,
  LayoutGrid,
  HelpCircle,
  MessageSquarePlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { GuideLink } from "@/components/mold/common/guide-link"
import { StudyExportsBundle } from "./side-nav-blocks/study-exports-bundle"

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
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
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
  onShowThemeModal,
  onShowLayoutModal,
}: SideNavBarProps) {
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
          <button type="button"
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

          <button type="button"
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

          <button type="button"
            onClick={onShowEncyclopedia}
            title="Open interactive subject encyclopedia and key terminology definitions"
            aria-label="Open interactive subject encyclopedia and key terminology definitions"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> <span>Encyclopedia</span>
          </button>

          <button type="button"
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

        {/* ── Section: Subject & Question Bank ── */}
        <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
          <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
            SUBJECT BANK
          </span>
          <button type="button"
            onClick={onChangeSubject}
            title="Switch to another subject module in your library"
            aria-label="Switch to another subject module in your library"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> <span>Switch Subject</span>
          </button>
          
          <button type="button"
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

          <button type="button"
            onClick={onImportNew}
            title="Import new custom subject from a JSON document"
            aria-label="Import new custom subject from a JSON document"
            className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> <span>Import JSON</span>
          </button>
        </div>

        {/* ── Section: Appearance & Workspaces ── */}
        <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
          <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
            APPEARANCE
          </span>
          {onShowThemeModal && (
            <button type="button"
              onClick={onShowThemeModal}
              title="Change color theme palette and phosphor aesthetic"
              aria-label="Open color theme switcher modal"
              className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
            >
              <Palette className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Themes</span>
            </button>
          )}
          {onShowLayoutModal && (
            <button type="button"
              onClick={onShowLayoutModal}
              title="Switch page workspace layout architecture"
              aria-label="Open page layout switcher modal"
              className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Layouts</span>
            </button>
          )}
        </div>

        {/* ── Section: Bundled Export & Study Materials ── */}
        <StudyExportsBundle
          onDownloadHtml={onDownloadHtml}
          onDownloadPdf={onDownloadPdf}
          onDownloadSolvedPdf={onDownloadSolvedPdf}
        />
      </nav>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-auto pt-3 border-t border-border/60 flex flex-col gap-2">
        <a
          href="https://docs.google.com/forms/d/1LrdMb8QiGbB01tDw6DJd-tQl_ix3ldxaSND-4vkKJJc/edit"
          target="_blank"
          rel="noopener noreferrer"
          title="Submit Feedback & Feature Requests (opens Google Form)"
          aria-label="Submit Feedback Form (opens in new tab)"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all font-mono text-[9px] uppercase font-bold tracking-wider rounded focus-ring group"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
          <span>FEEDBACK FORM</span>
        </a>

        <button type="button"
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
