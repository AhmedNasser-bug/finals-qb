"use client"

import { useState, useEffect } from "react"
import { HeroHeader } from "@/components/mold/home/hero-header"
import { ModeSelector } from "@/components/mold/home/mode-selector"
import { SetupPanel } from "@/components/mold/home/setup-panel"
import { PerformanceTable } from "@/components/mold/home/performance-table"
import { ActionHub } from "@/components/mold/home/action-hub"
import { StreakAscent } from "@/components/mold/home/streak-ascent"
import { GameRunner } from "@/components/mold/game/game-runner"
import { AchievementGallery } from "@/components/mold/achievement/achievement-gallery"
import { EncyclopediaOverlay } from "@/components/mold/common/encyclopedia-overlay"
import { SubjectImporter } from "@/components/mold/subject/subject-importer"
import { Footer } from "@/components/mold/common/footer"
import { useAchievements } from "@/lib/achievement-engine"
import { toSubjectData } from "@/lib/subject-persistence"
import {
  type GameModeId,
  type SetupConfig,
  type GameConfig,
  type RunRecord,
  computeAggregateStats,
} from "@/lib/mold-types"
import type { FullSubjectData } from "@/lib/mold-types"

import { getNamespacedKey, RUNS_STORAGE_KEY, useSafeAuth } from "@/lib/user-storage"

function loadRuns(userId?: string | null): RunRecord[] {
  try {
    const key = getNamespacedKey(RUNS_STORAGE_KEY, userId)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as RunRecord[]
  } catch {
    return []
  }
}

function saveRuns(runs: RunRecord[], userId?: string | null): void {
  try {
    const key = getNamespacedKey(RUNS_STORAGE_KEY, userId)
    localStorage.setItem(key, JSON.stringify(runs.slice(-50)))
  } catch {
    // ignore quota errors
  }
}

type AppView = "home" | "game"

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
  const [runs, setRuns] = useState<RunRecord[]>([])

  const { achievements, syncSubjectAchievements } = useAchievements()

  // Seed achievement definitions from the active subject on mount.
  useEffect(() => {
    syncSubjectAchievements(activeSubject)
  }, [activeSubject.id, syncSubjectAchievements]) // eslint-disable-line react-hooks/exhaustive-deps
  const subjectData = toSubjectData(activeSubject)

  // Hydrate runs from localStorage whenever Clerk user session changes (log in / out / switch)
  useEffect(() => {
    setRuns(loadRuns(userId))
  }, [userId])

  const [selectedMode, setSelectedMode] = useState<GameModeId>("speedrun")
  const [config, setConfig] = useState<SetupConfig>({
    timeLimitEnabled: true,
    hintsEnabled: false,
    questionCount: 20,
    selectedCategory: null,
  })

  const stats = computeAggregateStats(runs)

  function handleConfigChange(patch: Partial<SetupConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

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
    const updated = [...runs, run].slice(-50)
    saveRuns(updated, userId)
    setRuns(updated)
  }

  function handleReturnHome() {
    setView("home")
    setActiveConfig(null)
    setRuns(loadRuns(userId))
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
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        <HeroHeader
          subject={subjectData}
          achievements={achievements}
          onTrophyClick={() => setShowGallery(true)}
          onChangeSubject={onChangeSubject}
          onImportNew={() => setShowImporter(true)}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
            <ModeSelector selected={selectedMode} onSelect={handleModeSelect} />
            <div className="flex flex-col gap-8">
              <SetupPanel
                config={config}
                onChange={handleConfigChange}
                selectedMode={selectedMode}
                categories={subjectData.categories}
              />
              <StreakAscent
                currentStreak={stats.currentStreak}
                isAtRisk={false}
                bestStreak={stats.bestStreak}
                className="h-[300px]"
              />
            </div>
          </div>

          <ActionHub
            selectedMode={selectedMode}
            onInitialize={handleInitialize}
          />

          {/* Quick Start / Encyclopedia Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Onboarding Guide Card */}
            <div className="p-6 border border-border bg-[#1b1b1f] flex flex-col justify-between gap-4 relative group overflow-hidden">
              <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                  MASTER_PROTOCOL_GUIDE
                </span>
                <h3 className="text-lg font-bold font-display text-white tracking-tight">
                  Achieve Conceptual Mastery
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Select a <b>Challenge Mode</b> (e.g. Speedrun / Survival) to drill execution parameters, or study terms at your own pace using <b>Learning Modes</b> like Practice or Flashcards.
                </p>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-border/40 pt-3">
                SYSTEM_STATE: OPERATIONAL
              </div>
            </div>

            {/* Encyclopedia Visual Card */}
            <button
              onClick={() => setShowEncyclopedia(true)}
              aria-label="Open subject encyclopedia and key terminology"
              className="p-6 border border-border bg-[#1b1b1f] hover:border-primary/50 text-left flex flex-col justify-between gap-4 transition-all duration-200 group focus-ring relative overflow-hidden"
            >
              <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
                  STUDY_DEX_DATABASE
                </span>
                <h3 className="text-lg font-bold font-display text-white group-hover:text-primary transition-colors tracking-tight flex items-center gap-2">
                  Interactive Encyclopedia
                  <span className="text-xs text-[#4ae176] font-mono font-normal">→</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Explore full dictionary indexes, category breakdowns, and key terminology definitions for <b>{activeSubject.name}</b> before starting your challenges.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#4ae176] uppercase tracking-widest border-t border-border/40 pt-3 w-full flex justify-between items-center">
                <span>INDEX_COUNT: {Object.values(activeSubject.terminology).flat().length} TERMS</span>
                <span className="group-hover:translate-x-1 transition-transform">EXPLORE DATABASE</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest">PERFORMANCE DATA</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <PerformanceTable runs={runs} stats={stats} />
        </main>

        <Footer rightText="BUILD 2026.03" />
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
