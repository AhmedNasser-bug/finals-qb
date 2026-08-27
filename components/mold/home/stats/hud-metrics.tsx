import { Trophy, Target, Zap, Clock, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { gradeBgColor, formatTime } from "@/lib/mold-types"

interface HUDMetricsProps {
  stats: any
  dayStreak: number
  peakQuestionStreak: number
  avgGrade: string
}

export function HUDMetrics({ stats, dayStreak, peakQuestionStreak, avgGrade }: HUDMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Runs Card */}
      <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
        <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
          <Trophy className="w-5 h-5" />
        </div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">QUIZZES COMPLETED</p>
        <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
          {stats.totalRuns}
        </p>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-[#fecc17] bg-[#fecc17]/5 border border-[#fecc17]/10 px-2 py-1 rounded w-fit">
          <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
          <span>DAY STREAK: {dayStreak}</span>
        </div>
      </div>

      {/* Average Score (Accuracy) Card */}
      <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
        <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
          <Target className="w-5 h-5" />
        </div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">AVERAGE ACCURACY</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-mono font-bold text-white tabular-nums">
            {stats.averageScore}%
          </span>
          {stats.totalRuns > 0 && (
            <span className={cn("font-mono text-sm font-black px-1.5 py-0.5 rounded border border-glow", gradeBgColor(avgGrade))}>
              {avgGrade}
            </span>
          )}
        </div>
        <p className="text-[9px] text-zinc-500 font-mono mt-3">BEST SINGLE ATTEMPT: {stats.bestScore}%</p>
      </div>

      {/* Peak Correctness Streak Card */}
      <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
        <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
          <Zap className="w-5 h-5" />
        </div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">BEST ANSWER STREAK</p>
        <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
          ×{peakQuestionStreak}
        </p>
        <p className="text-[9px] text-zinc-500 font-mono mt-3">BEST IN-QUIZ FOCUS CHAIN</p>
      </div>

      {/* Average Response Time Card */}
      <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
        <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
          <Clock className="w-5 h-5" />
        </div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">AVERAGE ANSWER SPEED</p>
        <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
          {formatTime(Math.round((stats.averageResponseTimeMs || 0) / 1000))}
        </p>
        <p className="text-[9px] text-zinc-500 font-mono mt-3">
          {stats.averageResponseTimeMs ? `${Math.round(stats.averageResponseTimeMs)}ms per question` : "untimed"}
        </p>
      </div>
    </div>
  )
}
