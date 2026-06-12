"use client"

import { StatsScreen } from "@/components/mold/home/stats-screen"
import { HeaderWell } from "@/components/mold/home/header-well"
import { MainContentGrid } from "@/components/mold/home/home-screen-blocks"
import { PerformanceTable } from "@/components/mold/home/performance-table"

import type { GameModeId, SetupConfig, CategoryData } from "@/lib/mold-types"
import type { Achievement } from "@/lib/achievement-engine"
import type { UserStats, RunRecord } from "@/lib/mold-types"
import type { AppView } from "@/components/mold/home/home-screen-types"

interface HomeViewRendererProps {
  view: AppView
  setView: (view: AppView) => void
  subjectName: string
  description: string
  runs: RunRecord[]
  stats: UserStats
  visualAccuracyPct: number
  selectedMode: GameModeId
  handleModeSelect: (id: GameModeId) => void
  handleInitialize: () => void
  config: SetupConfig
  handleConfigChange: (patch: Partial<SetupConfig>) => void
  categories: CategoryData[]
  unlockedCount: number
  totalAchievementsCount: number
  topAchievements: Achievement[]
  achievements: Achievement[]
  setShowGallery: (show: boolean) => void
}

export function HomeViewRenderer({
  view,
  setView,
  subjectName,
  description,
  runs,
  stats,
  visualAccuracyPct,
  selectedMode,
  handleModeSelect,
  handleInitialize,
  config,
  handleConfigChange,
  categories,
  unlockedCount,
  totalAchievementsCount,
  topAchievements,
  achievements,
  setShowGallery,
}: HomeViewRendererProps) {
  if (view === "stats") {
    return <StatsScreen onReturnHome={() => setView("home")} />
  }

  return (
    <>
      <HeaderWell
        subjectName={subjectName}
        description={description}
        runCount={runs.length}
        visualAccuracyPct={visualAccuracyPct}
      />

      <MainContentGrid
        selectedMode={selectedMode}
        handleModeSelect={handleModeSelect}
        handleInitialize={handleInitialize}
        config={config}
        handleConfigChange={handleConfigChange}
        categories={categories}
        unlockedCount={unlockedCount}
        totalAchievementsCount={totalAchievementsCount}
        topAchievements={topAchievements}
        achievements={achievements}
        setShowGallery={setShowGallery}
      />

      {/* Performance runs table list below the main grid split */}
      <div className="flex items-center gap-4 py-8 select-none">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase font-bold">
          QUIZ HISTORY
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <PerformanceTable runs={runs} stats={stats} />
    </>
  )
}
