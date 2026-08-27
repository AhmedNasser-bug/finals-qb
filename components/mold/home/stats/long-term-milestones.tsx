import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Milestone {
  id: string
  title: string
  description: string
  current: number
  target: number
  completed: boolean
}

interface LongTermMilestonesProps {
  milestones: Milestone[]
}

export function LongTermMilestones({ milestones }: LongTermMilestonesProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-800 pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
          03 // LONG-TERM MILESTONES
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={cn(
              "p-4 border rounded bg-[#101115] relative overflow-hidden transition-all duration-300",
              milestone.completed
                ? "border-primary/40 shadow-[0_0_15px_rgba(254,204,23,0.05)]"
                : "border-border hover:border-zinc-800"
            )}
          >
            {/* Subtle completed background check icon */}
            {milestone.completed && (
              <div className="absolute -bottom-2 -right-2 text-[#fecc17]/5">
                <Trophy className="w-16 h-16" />
              </div>
            )}

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="min-w-0">
                <p className={cn(
                  "font-mono text-xs font-bold uppercase tracking-widest",
                  milestone.completed ? "text-primary" : "text-white"
                )}>
                  {milestone.title}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{milestone.description}</p>
              </div>

              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold",
                milestone.completed
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-zinc-800/40 text-zinc-500 border border-zinc-700/60"
              )}>
                {milestone.completed ? "★" : `${Math.round((milestone.current / milestone.target) * 100)}%`}
              </div>
            </div>

            <div className="mt-4 w-full h-1 bg-zinc-800/80 rounded overflow-hidden relative z-10">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  milestone.completed ? "bg-primary" : "bg-zinc-600"
                )}
                style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
