import { HeaderWell } from "@/components/mold/home/header-well"
import { StatsScreen } from "@/components/mold/home/stats-screen"
import { PerformanceTable } from "@/components/mold/home/performance-table"
import { MainContentGrid } from "@/components/mold/home/home-screen-blocks"
import type { AppView } from "@/components/mold/home/home-screen-types"
import {
  type GameModeId,
  type SetupConfig,
  type RunRecord,
  type UserStats,
  type CategoryData
} from "@/lib/mold-types"
import type { FullSubjectData } from "@/lib/mold-types"
import type { Achievement } from "@/lib/achievement-engine"

interface HomeMainCanvasProps {
  view: AppView
  setView: (view: AppView) => void
  activeSubject: FullSubjectData
  runs: RunRecord[]
  visualAccuracyPct: number
  selectedMode: GameModeId
  handleModeSelect: (id: GameModeId) => void
  handleInitialize: () => void
  config: SetupConfig
  handleConfigChange: (patch: Partial<SetupConfig>) => void
  subjectDataCategories: CategoryData[]
  unlockedCount: number
  totalAchievementsCount: number
  topAchievements: Achievement[]
  achievements: Achievement[]
  setShowGallery: (show: boolean) => void
  stats: UserStats
}

export function HomeMainCanvas({
  view,
  setView,
  activeSubject,
  runs,
  visualAccuracyPct,
  selectedMode,
  handleModeSelect,
  handleInitialize,
  config,
  handleConfigChange,
  subjectDataCategories,
  unlockedCount,
  totalAchievementsCount,
  topAchievements,
  achievements,
  setShowGallery,
  stats,
}: HomeMainCanvasProps) {
  return (
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

          <MainContentGrid
            selectedMode={selectedMode}
            handleModeSelect={handleModeSelect}
            handleInitialize={handleInitialize}
            config={config}
            handleConfigChange={handleConfigChange}
            categories={subjectDataCategories}
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
      )}
    </main>
  )
}
