"use client"

import { useState } from "react"
import { HeroHeader } from "@/components/mold/hero-header"
import { ModeSelector } from "@/components/mold/mode-selector"
import { SetupPanel } from "@/components/mold/setup-panel"
import { PerformanceTable } from "@/components/mold/performance-table"
import { ActionHub } from "@/components/mold/action-hub"
import {
  type GameModeId,
  type SetupConfig,
  DEMO_SUBJECT,
  DEMO_ACHIEVEMENTS,
  DEMO_RUNS,
  computeAggregateStats,
} from "@/lib/mold-types"

export function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<GameModeId>("speedrun")
  const [config, setConfig] = useState<SetupConfig>({
    timeLimitEnabled: true,
    hintsEnabled: false,
    questionCount: 20,
    selectedCategory: null,
  })

  const stats = computeAggregateStats(DEMO_RUNS)

  function handleConfigChange(patch: Partial<SetupConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  function handleModeSelect(id: GameModeId) {
    setSelectedMode(id)
    // Reset category when leaving practice mode
    if (id !== "practice") {
      setConfig((prev) => ({ ...prev, selectedCategory: null }))
    }
  }

  function handleInitialize() {
    // Phase 2 will wire this to the game engine
    alert(`Initializing ${selectedMode} mode — game engine coming in Phase 2!`)
  }

  function handleEncyclopedia() {
    alert("Encyclopedia / reference view — coming in Phase 2!")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <HeroHeader
        subject={DEMO_SUBJECT}
        achievements={DEMO_ACHIEVEMENTS}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* Mode selection + setup side-by-side on large screens */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6">
          <ModeSelector
            selected={selectedMode}
            onSelect={handleModeSelect}
          />
          <SetupPanel
            config={config}
            onChange={handleConfigChange}
            selectedMode={selectedMode}
            categories={DEMO_SUBJECT.categories}
          />
        </div>

        {/* Action hub */}
        <ActionHub
          selectedMode={selectedMode}
          onInitialize={handleInitialize}
          onEncyclopedia={handleEncyclopedia}
        />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-mono text-muted-foreground tracking-widest">PERFORMANCE DATA</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Performance tracking */}
        <PerformanceTable
          runs={DEMO_RUNS}
          stats={stats}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-3 flex items-center justify-between bg-panel">
        <span className="text-xs font-mono text-muted-foreground">MOLD V2 — MASTERY PROTOCOL</span>
        <span className="text-xs font-mono text-muted-foreground">BUILD 2026.03</span>
      </footer>
    </div>
  )
}
