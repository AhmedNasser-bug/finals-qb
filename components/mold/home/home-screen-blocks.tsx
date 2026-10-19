import { Play } from "lucide-react"
import { ModeSelector } from "./mode-selector"
import { SetupPanel } from "./setup-panel"
import { ActionHub } from "./action-hub"
import { TelemetryPanel } from "./telemetry-panel"
import { AchievementsPanel } from "./achievements-panel"
import { SessionStatsPanel } from "./session-stats-panel"
import { HeaderWell } from "./header-well"

import type { GameModeId, SetupConfig, CategoryData, Achievement, Question } from "@/lib/mold-types"

interface MainContentGridProps {
  // Mode Selection
  selectedMode: GameModeId
  handleModeSelect: (id: GameModeId) => void
  handleInitialize: () => void

  // Configuration
  config: SetupConfig
  handleConfigChange: (patch: Partial<SetupConfig>) => void
  handleResetConfig: () => void
  categories: CategoryData[]
  questions?: Question[]
  subjectId?: string

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
  handleResetConfig,
  categories,
  questions,
  subjectId,
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
          <div className="border-b border-border pb-2 select-none">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
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
          <div className="border-b border-border pb-2 select-none">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
              02 // SPECIFY WORKLOAD PARAMETERS
            </h2>
          </div>
          <div className="p-6 border border-border bg-panel rounded">
            <SetupPanel
              config={config}
              onChange={handleConfigChange}
              onReset={handleResetConfig}
              selectedMode={selectedMode}
              categories={categories}
              questions={questions}
              subjectId={subjectId}
            />
          </div>
        </div>

        {/* Action initialize CTA */}
        <ActionHub
          onInitialize={handleInitialize}
          selectedMode={selectedMode}
        />
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
