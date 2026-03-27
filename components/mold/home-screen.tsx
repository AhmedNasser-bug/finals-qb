"use client"

import { useState, useEffect } from "react"
import { HeroHeader } from "@/components/mold/hero-header"
import { ModeSelector } from "@/components/mold/mode-selector"
import { SetupPanel } from "@/components/mold/setup-panel"
import { PerformanceTable } from "@/components/mold/performance-table"
import { ActionHub } from "@/components/mold/action-hub"
import { GameRunner } from "@/components/mold/game-runner"
import { AchievementGallery } from "@/components/mold/achievement-gallery"
import { useAchievements } from "@/lib/achievement-engine"
import {
  type GameModeId,
  type SetupConfig,
  type GameConfig,
  type RunRecord,
  DEMO_SUBJECT,
  DEMO_RUNS,
  computeAggregateStats,
} from "@/lib/mold-types"

const RUNS_STORAGE_KEY = "mold_v2_runs"

function loadRuns(): RunRecord[] {
  try {
    const raw = localStorage.getItem(RUNS_STORAGE_KEY)
    if (!raw) return DEMO_RUNS
    return JSON.parse(raw) as RunRecord[]
  } catch {
    return DEMO_RUNS
  }
}

function saveRuns(runs: RunRecord[]): void {
  try {
    // Keep last 50 runs
    localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs.slice(-50)))
  } catch {
    // ignore quota errors in demo
  }
}

type AppView = "home" | "game"

export function HomeScreen() {
  const [view, setView] = useState<AppView>("home")
  const [activeConfig, setActiveConfig] = useState<GameConfig | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const [runs, setRuns] = useState<RunRecord[]>(DEMO_RUNS)

  const { achievements } = useAchievements()

  // Hydrate runs from localStorage on mount
  useEffect(() => {
    setRuns(loadRuns())
  }, [])

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
      subjectId: DEMO_SUBJECT.id,
    }
    setActiveConfig(gameConfig)
    setView("game")
  }

  function handleReturnHome() {
    setView("home")
    setActiveConfig(null)
    // Refresh runs from storage (a new run may have been persisted)
    setRuns(loadRuns())
  }

  if (view === "game" && activeConfig) {
    return (
      <GameRunner
        config={activeConfig}
        onReturnHome={handleReturnHome}
      />
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        <HeroHeader
          subject={DEMO_SUBJECT}
          achievements={achievements}
          onTrophyClick={() => setShowGallery(true)}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6">
            <ModeSelector selected={selectedMode} onSelect={handleModeSelect} />
            <SetupPanel
              config={config}
              onChange={handleConfigChange}
              selectedMode={selectedMode}
              categories={DEMO_SUBJECT.categories}
            />
          </div>

          <ActionHub
            selectedMode={selectedMode}
            onInitialize={handleInitialize}
            onEncyclopedia={() => setShowGallery(true)}
          />

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest">PERFORMANCE DATA</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <PerformanceTable runs={runs} stats={stats} />
        </main>

        <footer className="border-t border-border px-6 py-3 flex items-center justify-between bg-panel">
          <span className="text-xs font-mono text-muted-foreground">MOLD V2 — MASTERY PROTOCOL</span>
          <span className="text-xs font-mono text-muted-foreground">BUILD 2026.03</span>
        </footer>
      </div>

      {showGallery && <AchievementGallery onClose={() => setShowGallery(false)} />}
    </>
  )
}
