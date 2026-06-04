"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Terminal as TerminalIcon, 
  BookOpen, 
  Trophy, 
  RotateCcw, 
  Plus, 
  Play, 
  Clock,
  BarChart3
} from "lucide-react"

import { ModeSelector } from "@/components/mold/home/mode-selector"
import { SetupPanel } from "@/components/mold/home/setup-panel"
import { PerformanceTable } from "@/components/mold/home/performance-table"
import { AchievementsPanel } from "@/components/mold/home/achievements-panel"
import { SessionStatsPanel } from "@/components/mold/home/session-stats-panel"
import { GameRunner } from "@/components/mold/game/game-runner"
import { AchievementGallery } from "@/components/mold/achievement/achievement-gallery"
import { EncyclopediaOverlay } from "@/components/mold/common/encyclopedia-overlay"
import { SubjectImporter } from "@/components/mold/subject/subject-importer"
import { Footer } from "@/components/mold/common/footer"
import { useAchievements } from "@/lib/achievement-engine"
import { toSubjectData } from "@/lib/subject-persistence"
import { cn } from "@/lib/utils"

import { TopNavBar } from "@/components/mold/home/top-nav-bar"
import { SideNavBar } from "@/components/mold/home/side-nav-bar"
import { BottomMobileNav } from "@/components/mold/home/bottom-mobile-nav"
import { HeaderWell } from "@/components/mold/home/header-well"
import { TelemetryPanel } from "@/components/mold/home/telemetry-panel"
import { StatsScreen } from "@/components/mold/home/stats-screen"
import { useStats } from "@/lib/game/stats-context"

import {
  type GameModeId,
  type SetupConfig,
  type GameConfig,
  type RunRecord,
} from "@/lib/mold-types"
import type { FullSubjectData } from "@/lib/mold-types"

import { useSafeAuth } from "@/lib/user-storage"

type AppView = "home" | "game" | "stats"

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

  return (
    <>
      <div className="min-h-screen bg-[#131313] flex flex-col text-[#e5e2e1] selection:bg-primary/20 selection:text-primary animate-fade-in relative">
        <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none" />

        {/* ─── TOP NAVIGATION BAR ────────────────────────────────────────────── */}
        <TopNavBar
          activeSubjectName={activeSubject.name}
          onShowEncyclopedia={() => setShowEncyclopedia(true)}
          onShowGallery={() => setShowGallery(true)}
          onImportNew={() => setShowImporter(true)}
        />

        {/* ─── SIDEBAR BAR (DESKTOP ONLY) ──────────────────────────────────────── */}
        <SideNavBar
          subjectId={activeSubject.id}
          activeView={view === "stats" ? "stats" : "home"}
          onShowDashboard={() => setView("home")}
          onShowStats={() => setView("stats")}
          onShowEncyclopedia={() => setShowEncyclopedia(true)}
          onShowGallery={() => setShowGallery(true)}
          onChangeSubject={onChangeSubject}
          onImportNew={() => setShowImporter(true)}
          onInitialize={handleInitialize}
        />

        {/* ─── MAIN CANVAS AREA ────────────────────────────────────────────── */}
        <main className="md:ml-64 pt-24 pb-20 px-4 sm:px-6 lg:px-12 min-h-screen flex-1">
          
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Telemetry, Modes, Setup, CTA */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Performance Telemetry panel */}
                  <TelemetryPanel />

                  {/* Modes Selection Grid */}
                  <div className="space-y-4">
                    <div className="border-b border-zinc-800/80 pb-2 select-none">
                      <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
                        01 // CHOOSE STUDY REGIME
                      </h2>
                    </div>
                    <ModeSelector selected={selectedMode} onSelect={handleModeSelect} onLaunch={handleInitialize} />
                  </div>

                  {/* Configuration panel (Setup Panel) */}
                  <div className="space-y-4">
                    <div className="border-b border-zinc-800/80 pb-2 select-none">
                      <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
                        02 // SPECIFY WORKLOAD PARAMETERS
                      </h2>
                    </div>
                    <div className="p-6 border border-border bg-[#101115] rounded">
                      <SetupPanel
                        config={config}
                        onChange={handleConfigChange}
                        selectedMode={selectedMode}
                        categories={subjectData.categories}
                      />
                    </div>
                  </div>

                  {/* Action initialize CTA */}
                  <button 
                    onClick={handleInitialize}
                    className="w-full h-16 bg-primary text-[#0a0b0d] font-headline font-black text-xl tracking-[0.25em] border-none flex items-center justify-center gap-4 shadow-[0_0_20px_hsla(var(--primary),0.1)] hover:shadow-[0_0_30px_hsla(var(--primary),0.25)] hover:-translate-y-0.5 transition-all active:translate-y-0.5 cursor-pointer uppercase select-none rounded focus-ring"
                  >
                    <span>INITIALIZE SESSION</span>
                    <Play className="w-5 h-5 fill-current shrink-0" />
                  </button>

                </div>

                {/* Right Column: Achievements, Subject Image, Session Stats */}
                <div className="lg:col-span-4 space-y-8 select-none">
                  
                  {/* Achievements panel */}
                  <AchievementsPanel
                    unlockedCount={unlockedCount}
                    totalAchievementsCount={totalAchievementsCount}
                    topAchievements={topAchievements}
                    hasMoreAchievements={achievements.length > 3}
                    totalCount={achievements.length}
                    onShowGallery={() => setShowGallery(true)}
                  />

                  {/* Session stats block */}
                  <SessionStatsPanel />

                </div>

              </div>

              {/* Performance runs table list below the main grid split */}
              <div className="flex items-center gap-4 py-8 select-none">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase font-bold">
                  HISTORICAL_RUNS_LOG
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <PerformanceTable runs={runs} stats={stats} />
            </>
          )}

        </main>

        {/* ─── BOTTOM NAVIGATION BAR (MOBILE ONLY) ────────────────────────────────── */}
        <BottomMobileNav
          view={view}
          setView={setView}
          handleModeSelect={handleModeSelect}
          setShowEncyclopedia={setShowEncyclopedia}
          setShowGallery={setShowGallery}
          onChangeSubject={onChangeSubject}
        />

        {/* Desktop base footer */}
        <Footer rightText="BUILD 2026.06_CC" />
      </div>

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
    </>
  )
}
