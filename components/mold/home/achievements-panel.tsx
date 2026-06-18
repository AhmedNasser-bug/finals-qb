"use client"

import React from "react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementDef {
  id: string
  title: string
  description: string
  unlockedAt: string | null
}

interface AchievementsPanelProps {
  unlockedCount: number
  totalAchievementsCount: number
  topAchievements: AchievementDef[]
  hasMoreAchievements: boolean
  totalCount: number
  onShowGallery: () => void
}

export function AchievementsPanel({
  unlockedCount,
  totalAchievementsCount,
  topAchievements,
  hasMoreAchievements,
  totalCount,
  onShowGallery,
}: AchievementsPanelProps) {
  return (
    <section className="bg-[#101115] border border-border p-6 rounded-md">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">
          ACHIEVED_OBJECTIVES
        </h2>
      </div>

      <div className="flex flex-col items-center py-5 bg-zinc-900/50 border border-zinc-800/60 rounded mb-6 relative overflow-hidden select-none">
        <div className="text-5xl font-headline font-black text-white/10 relative tracking-wider">
          {unlockedCount}/{totalAchievementsCount}
          <div className="absolute inset-0 flex items-center justify-center text-primary blur-[10px] opacity-20" aria-hidden="true">
            {unlockedCount}/{totalAchievementsCount}
          </div>
        </div>
        <div className="font-mono text-[9px] text-[var(--tw-hex-fecc17)]/60 tracking-widest font-bold mt-1.5 uppercase">
          COMPLETED_SYLLABUS_SECTOR
        </div>
      </div>

      <div className="flex flex-col gap-3 font-mono text-[10px]">
        {topAchievements.map((ach) => {
          const isUnlocked = ach.unlockedAt !== null
          return (
            <div 
              key={ach.id}
              className={cn(
                "p-3.5 bg-zinc-900 border flex items-center gap-3.5 transition-all duration-200",
                isUnlocked 
                  ? "border-primary/30 text-white" 
                  : "border-zinc-800 text-zinc-500 opacity-40 grayscale"
              )}
            >
              <div className={cn("w-8 h-8 flex items-center justify-center border shrink-0 text-sm font-bold", isUnlocked ? "border-primary/20 bg-primary/5 text-primary" : "border-zinc-800 bg-zinc-900")}>
                <Trophy className={cn("w-4 h-4", isUnlocked ? "text-primary" : "text-zinc-500")} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[9px] font-bold truncate uppercase">{ach.title.replace(/\s+/g, "_")}</div>
                <div className="font-sans text-[8px] text-zinc-400 truncate leading-none mt-0.5">{ach.description}</div>
              </div>
            </div>
          )
        })}
        
        {hasMoreAchievements && (
          <button 
            onClick={onShowGallery}
            aria-label={`View all ${totalCount} achievements in gallery`}
            className="text-[9px] font-mono text-primary/70 hover:text-primary transition-colors text-center w-full font-bold pt-2 uppercase tracking-widest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            View All {totalCount} Achievements →
          </button>
        )}
      </div>
    </section>
  )
}
