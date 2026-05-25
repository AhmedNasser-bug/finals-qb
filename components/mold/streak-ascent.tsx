"use client"

import { cn } from "@/lib/utils"

// Flame + Vertical Ascent hybrid streak visual

export type StreakTier = {
  min: number
  label: string
  colorClass: string
  glowClass: string
  bgClass: string
  baseBgClass: string
}

export const STREAK_TIERS: StreakTier[] = [
  { min: 0,   label: "SPARK",    colorClass: "text-orange-400", glowClass: "border-glow-orange", bgClass: "bg-orange-400/20", baseBgClass: "bg-orange-400" },
  { min: 3,   label: "FLAME",    colorClass: "text-orange-500", glowClass: "border-glow-orange", bgClass: "bg-orange-500/20", baseBgClass: "bg-orange-500" },
  { min: 7,   label: "BLAZE",    colorClass: "text-red-500",    glowClass: "border-glow-danger", bgClass: "bg-red-500/20", baseBgClass: "bg-red-500" },
  { min: 14,  label: "INFERNO",  colorClass: "text-purple-500", glowClass: "shadow-[0_0_20px_theme(colors.purple.500/.4)]", bgClass: "bg-purple-500/20", baseBgClass: "bg-purple-500" },
  { min: 30,  label: "PHOENIX",  colorClass: "text-pink-500",   glowClass: "shadow-[0_0_25px_theme(colors.pink.500/.4)]", bgClass: "bg-pink-500/20", baseBgClass: "bg-pink-500" },
  { min: 50,  label: "SOLAR",    colorClass: "text-yellow-400", glowClass: "border-glow", bgClass: "bg-yellow-400/20", baseBgClass: "bg-yellow-400" },
  { min: 100, label: "ETERNAL",  colorClass: "text-cyan-400",   glowClass: "shadow-[0_0_30px_theme(colors.cyan.400/.4)]", bgClass: "bg-cyan-400/20", baseBgClass: "bg-cyan-400" },
]

export function getStreakTier(streak: number): StreakTier {
  for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
    if (streak >= STREAK_TIERS[i].min) {
      return STREAK_TIERS[i]
    }
  }
  return STREAK_TIERS[0]
}

export function getNextMilestone(streak: number): number | null {
  for (const tier of STREAK_TIERS) {
    if (tier.min > streak) return tier.min
  }
  return null
}

interface StreakAscentProps {
  currentStreak: number
  bestStreak: number
  isAtRisk?: boolean // If true, make the flame flicker more intensely/look fragile
  className?: string
}

export function StreakAscent({ currentStreak, bestStreak, isAtRisk = false, className }: StreakAscentProps) {
  const currentTier = getStreakTier(currentStreak)
  const nextMilestone = getNextMilestone(currentStreak)

  // Render milestones for the vertical path
  const visibleMilestones = STREAK_TIERS.filter(t => t.min > 0 && t.min <= Math.max(nextMilestone || 100, 30))

  return (
    <div className={cn("relative flex flex-col items-center py-6 overflow-hidden scale-90 sm:scale-100 origin-top rounded border border-border bg-panel scanlines", className)}>

      {/* Background ambient glow based on tier */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000",
          currentTier.baseBgClass
        )}
        aria-hidden="true"
      />

      {/* The Central Path (Ascent Line) */}
      <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Upcoming Milestone (Aspirational) */}
      {nextMilestone && (
        <div className="relative z-10 flex flex-col items-center mb-8 opacity-40">
           <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-2">UPCOMING MILESTONE</div>
           <div className={cn("w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background glass")}>
              <span className="font-mono text-sm">{nextMilestone}</span>
           </div>
           <div className="mt-2 text-xs font-mono">{STREAK_TIERS.find(t => t.min === nextMilestone)?.label}</div>
           <div className="text-[10px] text-muted-foreground mt-1">{nextMilestone - currentStreak} days remaining</div>
        </div>
      )}

      {/* Current Streak Node (The Flame Avatar) */}
      <div className="relative z-20 flex flex-col items-center my-8">

        {/* Particle System for Flame */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none" aria-hidden="true">
           {currentStreak > 0 && (
             <>
                <div className={cn("absolute top-1/2 left-[40%] w-2 h-2 rounded-full particle-1", currentTier.baseBgClass)} />
                <div className={cn("absolute top-1/2 left-[60%] w-1.5 h-1.5 rounded-full particle-2", currentTier.baseBgClass)} />
                <div className={cn("absolute top-1/2 left-[50%] w-2 h-2 rounded-full particle-3", currentTier.baseBgClass)} />
             </>
           )}
        </div>

        <div className={cn(
          "relative w-24 h-24 flex flex-col items-center justify-center rounded-full border-2 transition-all duration-500",
          currentStreak > 0 ? currentTier.glowClass : "border-border/50 bg-background/50",
          currentStreak > 0 && isAtRisk ? "border-dashed animate-flame-intense opacity-80" : "border-solid",
          currentStreak > 0 && !isAtRisk ? "animate-flame" : "",
          currentTier.bgClass
        )}>
           <span className="text-3xl font-mono font-bold leading-none mb-1 shadow-black drop-shadow-md">
             {currentStreak}
           </span>
           <span className="text-[10px] font-mono tracking-widest text-foreground/80 leading-none">DAY STREAK</span>
        </div>

        <div className="mt-4 text-center">
           <div className={cn("text-lg font-bold tracking-widest mb-1 shadow-black drop-shadow-md", currentTier.colorClass)}>
              {currentTier.label} RANK
           </div>
           {isAtRisk && (
             <div className="text-xs text-destructive animate-pulse font-mono flex items-center gap-1.5 justify-center mt-2">
               <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
               STREAK AT RISK
             </div>
           )}
        </div>
      </div>

      {/* Conquered Milestones Below */}
      <div className="relative z-10 flex flex-col items-center mt-8 gap-6 opacity-60">
        {visibleMilestones.reverse().filter(t => t.min <= currentStreak).map(tier => (
          <div key={tier.min} className="flex flex-col items-center">
            <div className={cn("w-8 h-8 flex items-center justify-center rounded-full border border-border bg-background", tier.colorClass)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="mt-1 text-[10px] font-mono text-muted-foreground">{tier.min} DAYS</div>
          </div>
        ))}
      </div>

      {/* Protected History Info */}
      <div className="absolute bottom-4 right-4 text-right">
         <div className="text-[10px] font-mono text-muted-foreground tracking-widest">HIGHEST ASCENT</div>
         <div className="text-sm font-mono text-foreground/80">{bestStreak} DAYS</div>
      </div>
    </div>
  )
}
