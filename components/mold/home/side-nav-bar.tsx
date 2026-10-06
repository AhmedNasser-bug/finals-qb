"use client"

import { useState } from "react"
import { 
  SubjectIdentity,
  NavigationSection,
  SubjectBankSection,
  AppearanceSection,
  ExportSection
} from "./side-nav-bar-components"

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
  const [exportExpanded, setExportExpanded] = useState(true)

  return (
    <aside className="hidden md:flex flex-col gap-3 p-4 w-64 h-[calc(100vh-64px)] bg-panel border-r border-border fixed left-0 top-16 z-40 select-none overflow-y-auto">
      <SubjectIdentity subjectId={subjectId} />

      <nav className="flex flex-col gap-3 flex-1" aria-label="Main application navigation">
        <NavigationSection
          activeView={activeView}
          onShowDashboard={onShowDashboard}
          onShowStats={onShowStats}
          onShowEncyclopedia={onShowEncyclopedia}
          onShowGallery={onShowGallery}
        />

        <SubjectBankSection
          onChangeSubject={onChangeSubject}
          onAddQuestions={onAddQuestions}
          onImportNew={onImportNew}
        />

        <AppearanceSection
          onShowThemeModal={onShowThemeModal}
          onShowLayoutModal={onShowLayoutModal}
        />

        <ExportSection
          exportExpanded={exportExpanded}
          onToggleExport={() => setExportExpanded(!exportExpanded)}
          onDownloadHtml={onDownloadHtml}
          onDownloadPdf={onDownloadPdf}
          onDownloadSolvedPdf={onDownloadSolvedPdf}
        />
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
