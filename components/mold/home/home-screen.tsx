"use client"

import { useState, useEffect, useMemo } from "react"

import { PerformanceTable } from "@/components/mold/home/performance-table"
import { GameRunner } from "@/components/mold/game/game-runner"
import { AchievementGallery } from "@/components/mold/achievement/achievement-gallery"
import { EncyclopediaOverlay } from "@/components/mold/common/encyclopedia-overlay"
import dynamic from "next/dynamic"
import { Footer } from "@/components/mold/common/footer"
import { useAchievements } from "@/lib/achievement-engine"
import { toSubjectData } from "@/lib/subject-persistence"
import { downloadSubjectHtml, downloadSubjectPdf, downloadSubjectSolvedPdf } from "@/lib/subject/subject-sharing"

const SubjectImporter = dynamic(
  () => import("@/components/mold/subject/subject-importer").then((mod) => mod.SubjectImporter),
  { ssr: false }
)

const AddQuestionsWizard = dynamic(
  () => import("@/components/mold/home/add-questions-wizard").then((mod) => mod.AddQuestionsWizard),
  { ssr: false }
)

import { TopNavBar } from "@/components/mold/home/top-nav-bar"
import { SideNavBar } from "@/components/mold/home/side-nav-bar"
import { BottomMobileNav } from "@/components/mold/home/bottom-mobile-nav"
import { HeaderWell } from "@/components/mold/home/header-well"
import { StatsScreen } from "@/components/mold/home/stats-screen"
import { useStats } from "@/lib/game/stats-context"
import { usePageLayout } from "@/lib/layouts/layout-context"
import { ThemeSwitcherModal } from "@/components/mold/common/theme-switcher-modal"
import { LayoutSwitcherModal } from "@/components/mold/common/layout-switcher-modal"
import { MobileBottomNavBar } from "@/components/mold/home/home-screen-components"
import { MainContentGrid } from "@/components/mold/home/home-screen-blocks"
import type { AppView } from "@/components/mold/home/home-screen-types"

import {
  type GameModeId,
  type SetupConfig,
  type GameConfig,
  type RunRecord,
} from "@/lib/mold-types"
import type { FullSubjectData } from "@/lib/mold-types"

import { useSafeAuth } from "@/lib/user-storage"

interface HomeScreenProps {
  /** The currently active FullSubjectData, chosen by the root orchestrator. */
  activeSubject: FullSubjectData
  /** All subjects in the store — passed down so the importer can check for duplicate ids. */
  allSubjectIds: string[]
  /** Called when the user imports a new subject from the home screen header. */
  onAddSubject: (subject: FullSubjectData) => void
  /** Called when the user clicks "Change Subject" in the header. */
  onChangeSubject: () => void
}

export function HomeScreen({
  activeSubject,
  allSubjectIds,
  onAddSubject,
  onChangeSubject,
}: HomeScreenProps) {
  const { userId } = useSafeAuth()
  const [view, setView]               = useState<AppView>("home")
  const [activeConfig, setActiveConfig] = useState<GameConfig | null>(null)
  const [showGallery, setShowGallery]       = useState(false)
  const [showEncyclopedia, setShowEncyclopedia] = useState(false)
  const [showImporter, setShowImporter]     = useState(false)
  const [showAiWizard, setShowAiWizard]     = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showLayoutModal, setShowLayoutModal] = useState(false)

  const { activeLayout } = usePageLayout()
  const { runs, stats, recordSession } = useStats()
  const { achievements, syncSubjectAchievements } = useAchievements()

  // Seed achievement definitions from the active subject on mount.
  useEffect(() => {
    syncSubjectAchievements(activeSubject)
  }, [activeSubject.id, syncSubjectAchievements]) // eslint-disable-line react-hooks/exhaustive-deps
  
  const subjectData = toSubjectData(activeSubject)

  const [selectedMode, setSelectedMode] = useState<GameModeId>("speedrun")
  const [config, setConfig] = useState<SetupConfig>({
    timeLimitEnabled: true,
    hintsEnabled: false,
    questionCount: 20,
    selectedCategory: null,
  })

  // Memoize top achievements for high-contrast lock display
  const topAchievements = useMemo(() => {
    return achievements.slice(0, 3)
  }, [achievements])

  const unlockedCount = useMemo(() => {
    return achievements.filter((a) => a.unlockedAt !== null).length
  }, [achievements])

  const totalAchievementsCount = achievements.length

  const visualAccuracyPct = stats.averageScore || 0

  function handleConfigChange(patch: Partial<SetupConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  // Handle active mode selection card taps
  function handleModeSelect(id: GameModeId) {
    setSelectedMode(id)
    if (id !== "practice") {
      setConfig((prev) => ({ ...prev, selectedCategory: null }))
    }
  }

  function handleInitialize() {
    const gameConfig: GameConfig = {
      ...config,
      mode: selectedMode,
      subjectId: activeSubject.id,
    }
    setActiveConfig(gameConfig)
    setView("game")
  }

  // Home Screen Global Hotkeys (1-7 for Modes, Enter to Initialize)
  useEffect(() => {
    if (view !== "home" || showGallery || showEncyclopedia || showImporter || showAiWizard) return

    const handleHomeKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }

      const MODES_MAP: GameModeId[] = [
        "speedrun",
        "blitz",
        "hardcore",
        "survival",
        "practice",
        "flashcards",
        "full-revision",
      ]

      const keyNum = parseInt(e.key, 10)
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= MODES_MAP.length) {
        e.preventDefault()
        handleModeSelect(MODES_MAP[keyNum - 1])
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        handleInitialize()
        return
      }
    }

    window.addEventListener("keydown", handleHomeKeyDown)
    return () => window.removeEventListener("keydown", handleHomeKeyDown)
  }, [view, showGallery, showEncyclopedia, showImporter, showAiWizard, selectedMode, config, activeSubject.id])

  function handleRunSaved(run: RunRecord) {
    recordSession(run)
  }

  function handleReturnHome() {
    setView("home")
    setActiveConfig(null)
  }

  function handleImport(subject: FullSubjectData) {
    setShowImporter(false)
    onAddSubject(subject)
  }

  if (view === "game" && activeConfig) {
    return (
      <GameRunner
        config={activeConfig}
        subject={activeSubject}
        runs={runs}
        onReturnHome={handleReturnHome}
        onRunSaved={handleRunSaved}
      />
    )
  }

  const LayoutComponent = activeLayout.Component

  return (
    <>
      <LayoutComponent
        topNav={
          <TopNavBar
            activeSubjectId={activeSubject.id}
            activeSubjectName={activeSubject.name}
            onShowEncyclopedia={() => setShowEncyclopedia(true)}
            onShowGallery={() => setShowGallery(true)}
            onImportNew={() => setShowImporter(true)}
            onShowThemeModal={() => setShowThemeModal(true)}
            onShowLayoutModal={() => setShowLayoutModal(true)}
          />
        }
        sidebar={
          <SideNavBar
            subjectId={activeSubject.id}
            subjectName={activeSubject.name}
            activeView={view === "stats" ? "stats" : "home"}
            onShowDashboard={() => setView("home")}
            onShowStats={() => setView("stats")}
            onShowEncyclopedia={() => setShowEncyclopedia(true)}
            onShowGallery={() => setShowGallery(true)}
            onChangeSubject={onChangeSubject}
            onImportNew={() => setShowImporter(true)}
            onAddQuestions={() => setShowAiWizard(true)}
            onInitialize={handleInitialize}
            onDownloadHtml={() => downloadSubjectHtml(activeSubject)}
            onDownloadPdf={() => downloadSubjectPdf(activeSubject)}
            onDownloadSolvedPdf={() => downloadSubjectSolvedPdf(activeSubject)}
            onShowThemeModal={() => setShowThemeModal(true)}
            onShowLayoutModal={() => setShowLayoutModal(true)}
          />
        }
        mobileNav={
          <BottomMobileNav
            view={view}
            setView={setView}
            handleModeSelect={handleModeSelect}
            setShowEncyclopedia={setShowEncyclopedia}
            setShowGallery={setShowGallery}
            onChangeSubject={onChangeSubject}
          />
        }
        footer={<Footer rightText="BUILD 2026.06_CC" />}
      >
        {view === "stats" ? (
          <StatsScreen onReturnHome={() => setView("home")} />
        ) : (
          <>
            {/* Header Well */}
            <HeaderWell
              subjectName={activeSubject.name}
              description={activeSubject.config.description}
              runCount={runs.length}
              visualAccuracyPct={visualAccuracyPct}
            />

            <MainContentGrid
              selectedMode={selectedMode}
              handleModeSelect={handleModeSelect}
              handleInitialize={handleInitialize}
              config={config}
              handleConfigChange={handleConfigChange}
              categories={subjectData.categories}
              unlockedCount={unlockedCount}
              totalAchievementsCount={totalAchievementsCount}
              topAchievements={topAchievements}
              achievements={achievements}
              setShowGallery={setShowGallery}
            />

            {/* Performance runs table list below the main grid split */}
            <div className="flex items-center gap-4 py-8 select-none">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase font-bold">
                QUIZ HISTORY
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <PerformanceTable runs={runs} stats={stats} />
          </>
        )}
      </LayoutComponent>

      {showGallery && <AchievementGallery onClose={() => setShowGallery(false)} />}

      {showEncyclopedia && (
        <EncyclopediaOverlay
          subject={activeSubject}
          onClose={() => setShowEncyclopedia(false)}
        />
      )}

      {showImporter && (
        <SubjectImporter
          onImport={handleImport}
          onCancel={() => setShowImporter(false)}
          existingIds={allSubjectIds}
        />
      )}

      {showAiWizard && (
        <AddQuestionsWizard
          activeSubject={activeSubject}
          onMerge={(mergedSubject) => {
            setShowAiWizard(false)
            onAddSubject(mergedSubject)
          }}
          onCancel={() => setShowAiWizard(false)}
        />
      )}

      {showThemeModal && (
        <ThemeSwitcherModal onClose={() => setShowThemeModal(false)} />
      )}

      {showLayoutModal && (
        <LayoutSwitcherModal onClose={() => setShowLayoutModal(false)} />
      )}
    </>
  )
}
