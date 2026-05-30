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

import { useAuth } from "@clerk/nextjs"
import { getNamespacedKey, RUNS_STORAGE_KEY } from "@/lib/user-storage"

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
  const { userId } = useAuth()
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
        />

        {/* Subject switcher bar */}
        <div className="border-b border-border bg-panel px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase shrink-0">
              Active Subject
            </span>
            <span className="text-[10px] font-mono text-foreground/70 border border-border px-2 py-0.5 rounded truncate max-w-[200px]">
              {activeSubject.id}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowImporter(true)}
              title="Import a new subject"
              aria-label="Import a new subject"
              className="text-[10px] font-mono px-2.5 py-1 rounded border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Import New
            </button>
            <button
              onClick={onChangeSubject}
              title="Change active subject"
              aria-label="Change active subject"
              className="text-[10px] font-mono px-2.5 py-1 rounded border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Change Subject
            </button>
          </div>
        </div>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6">
            <ModeSelector selected={selectedMode} onSelect={handleModeSelect} />
            <div className="flex flex-col gap-6">
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
                className="h-[300px]" // Make it smaller as requested
              />
            </div>
          </div>


          <ActionHub
            selectedMode={selectedMode}
            onInitialize={handleInitialize}
            onEncyclopedia={() => setShowEncyclopedia(true)}
          />

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
