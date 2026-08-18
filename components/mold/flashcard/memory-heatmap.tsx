"use client"

import React, { useState } from "react"
import { Flashcard } from "@/lib/types/mold-types"
import { RetentionMap, CardRetentionState } from "@/lib/telemetry/telemetry-types"
import {
  deriveCategoryRetentionSummaries,
  createInitialCardState,
} from "@/lib/telemetry/retention-kernel"
import { RetentionBadge } from "./retention-badge"
import { Brain, Flame, RotateCcw, Zap, Info, Filter } from "lucide-react"

interface MemoryHeatmapProps {
  cards: Flashcard[]
  retentionMap: RetentionMap
  subjectId: string
  onStartDrill: (strategy: "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY", category?: string) => void
  onClose?: () => void
}

export function MemoryHeatmap({
  cards,
  retentionMap,
  subjectId,
  onStartDrill,
  onClose,
}: MemoryHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [hoveredCard, setHoveredCard] = useState<CardRetentionState | null>(null)

  const summaries = deriveCategoryRetentionSummaries(cards, retentionMap)

  const totalCards = cards.length
  const totalDue = Object.values(retentionMap).filter(
    (s) => s.urgencyLevel === "DUE" || s.urgencyLevel === "APPROACHING_DECAY"
  ).length
  const totalCritical = Object.values(retentionMap).filter(
    (s) => s.urgencyLevel === "CRITICAL_LAPSED"
  ).length
  const totalMastered = Object.values(retentionMap).filter(
    (s) => s.urgencyLevel === "MASTERED"
  ).length

  const overallMasteryPct =
    totalCards > 0 ? Math.round((totalMastered / totalCards) * 100) : 0

  const filteredCards =
    selectedCategory === "all"
      ? cards
      : cards.filter((c) => (c.category || "_general") === selectedCategory)

  return (
    <div className="bg-panel border border-border rounded-lg p-5 space-y-6 animate-fade-in text-foreground">
      {/* Header Well */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
            <h3 className="font-mono text-base font-bold uppercase tracking-wider text-foreground">
              Cognitive Retention Heatmap
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time Ebbinghaus decay matrix & SM-2 memory half-life tracking.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalCritical > 0 && (
            <button
              onClick={() => onStartDrill("CRITICAL_ONLY", selectedCategory === "all" ? undefined : selectedCategory)}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 rounded transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              DRILL CRITICAL ({totalCritical})
            </button>
          )}

          {totalDue > 0 && (
            <button
              onClick={() => onStartDrill("DUE_ONLY", selectedCategory === "all" ? undefined : selectedCategory)}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/40 hover:bg-amber-500/20 rounded transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              DRILL DUE ({totalDue})
            </button>
          )}

          <button
            onClick={() => onStartDrill("SMART_ADAPTIVE", selectedCategory === "all" ? undefined : selectedCategory)}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
          >
            SMART REVIEW ALL
          </button>
        </div>
      </div>

      {/* Aggregate Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
        <div className="p-3 bg-background border border-border rounded">
          <div className="text-xs text-muted-foreground uppercase">Retention Rate</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{overallMasteryPct}%</div>
        </div>
        <div className="p-3 bg-background border border-border rounded">
          <div className="text-xs text-muted-foreground uppercase">Due for Review</div>
          <div className="text-xl font-bold text-amber-400 mt-0.5">{totalDue}</div>
        </div>
        <div className="p-3 bg-background border border-border rounded">
          <div className="text-xs text-muted-foreground uppercase">Lapsed Memory</div>
          <div className="text-xl font-bold text-destructive mt-0.5">{totalCritical}</div>
        </div>
        <div className="p-3 bg-background border border-border rounded">
          <div className="text-xs text-muted-foreground uppercase">Total Deck Items</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{totalCards}</div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" aria-hidden="true" /> TOPIC:
        </span>
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground font-bold"
              : "bg-background border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          ALL ({totalCards})
        </button>
        {summaries.map((sum) => (
          <button
            key={sum.category}
            onClick={() => setSelectedCategory(sum.category)}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              selectedCategory === sum.category
                ? "bg-primary text-primary-foreground font-bold"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {sum.category} ({sum.totalCards})
          </button>
        ))}
      </div>

      {/* Interactive 2D Heatmap Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>DECK RETENTION CELLS (HOVER FOR MEMORY HALF-LIFE)</span>
          <span className="hidden sm:inline">CLICK CELL TO DRILL ITEM</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-3 bg-background/60 border border-border/80 rounded-lg">
          {filteredCards.map((card) => {
            const state =
              retentionMap[card.id] || createInitialCardState(card, subjectId)

            let cellBg = "bg-panel border-border/80 hover:border-border text-muted-foreground"
            let dotColor = "bg-muted-foreground"

            if (state.urgencyLevel === "MASTERED") {
              cellBg = "bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400 text-emerald-300"
              dotColor = "bg-emerald-400"
            } else if (state.urgencyLevel === "APPROACHING_DECAY") {
              cellBg = "bg-amber-950/30 border-amber-500/40 hover:border-amber-400 text-amber-300"
              dotColor = "bg-amber-400"
            } else if (state.urgencyLevel === "DUE") {
              cellBg = "bg-orange-950/30 border-orange-500/40 hover:border-orange-400 text-orange-300"
              dotColor = "bg-orange-400"
            } else if (state.urgencyLevel === "CRITICAL_LAPSED") {
              cellBg = "bg-destructive/20 border-destructive/50 hover:border-destructive text-destructive"
              dotColor = "bg-destructive"
            }

            return (
              <button
                key={card.id}
                onMouseEnter={() => setHoveredCard(state)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onStartDrill("SMART_ADAPTIVE", card.category)}
                className={`p-2.5 rounded border flex flex-col justify-between items-start text-left transition-all duration-150 relative group ${cellBg}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold truncate max-w-[65px]">
                    {card.term}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
                </div>
                <div className="text-[9px] font-mono opacity-70 mt-1">
                  {state.lastReviewedAt
                    ? `${Math.round(state.currentRetrievability * 100)}% R`
                    : "NEW"}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hover Inspection Inspector */}
      {hoveredCard ? (
        <div className="p-3 bg-panel border border-primary/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono animate-fade-in">
          <div>
            <div className="font-bold text-foreground flex items-center gap-2">
              <span>{hoveredCard.term}</span>
              <RetentionBadge
                urgency={hoveredCard.urgencyLevel}
                retrievability={hoveredCard.currentRetrievability}
              />
            </div>
            <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
              {hoveredCard.definition}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground whitespace-nowrap">
            <div>
              Stability ($S$): <span className="text-foreground font-bold">{hoveredCard.stability}d</span>
            </div>
            <div>
              Interval: <span className="text-foreground font-bold">{hoveredCard.intervalDays}d</span>
            </div>
            <div>
              Lapses: <span className="text-foreground font-bold">{hoveredCard.lapses}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[11px] font-mono text-muted-foreground/70 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Hover over any retention cell to inspect Ebbinghaus memory stability and lapse history.</span>
        </div>
      )}
    </div>
  )
}
