import { Play } from "lucide-react"
import { ModeSelector } from "./mode-selector"
import { SetupPanel } from "./setup-panel"
import { TelemetryPanel } from "./telemetry-panel"
import { AchievementsPanel } from "./achievements-panel"
import { SessionStatsPanel } from "./session-stats-panel"
import { HeaderWell } from "./header-well"
import { PerformanceTable } from "./performance-table"

import type { GameModeId, SetupConfig, CategoryData } from "@/lib/mold-types"
import type { Achievement } from "@/lib/achievement-engine"
import type { RunRecord, UserStats } from "@/lib/mold-types"

interface MainContentGridProps {
  // Mode Selection
  selectedMode: GameModeId
  handleModeSelect: (id: GameModeId) => void
  handleInitialize: () => void

  // Configuration
  config: SetupConfig
  handleConfigChange: (patch: Partial<SetupConfig>) => void
  categories: CategoryData[]

  // Achievements
  unlockedCount: number
  totalAchievementsCount: number
  topAchievements: Achievement[]
  achievements: Achievement[]
  setShowGallery: (show: boolean) => void
}

export function MainContentGrid({
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
}: MainContentGridProps) {
  return (
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
          <ModeSelector
            selected={selectedMode}
            onSelect={handleModeSelect}
            onLaunch={handleInitialize}
          />
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
              categories={categories}
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
  )
}
