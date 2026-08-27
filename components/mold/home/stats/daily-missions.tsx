import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Mission {
  id: string
  title: string
  description: string
  current: number
  target: number
  completed: boolean
}

interface DailyMissionsProps {
  missions: Mission[]
}

export function DailyMissions({ missions }: DailyMissionsProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
          02 // DAILY STUDY GOALS
        </h2>
      </div>

      <div className="border border-border bg-[#101115] rounded p-6 divide-y divide-zinc-800/60">
        {missions.map((mission) => (
          <div key={mission.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
            <div className={cn(
              "w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5",
              mission.completed
                ? "border-[#fecc17] bg-[#fecc17]/10 text-primary"
                : "border-zinc-700 bg-zinc-900 text-zinc-600"
            )}>
              {mission.completed && <CheckCircle2 className="w-4 h-4 fill-current text-primary shrink-0" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={cn(
                  "font-mono text-xs font-bold uppercase tracking-wider",
                  mission.completed ? "text-[#fecc17]" : "text-white"
                )}>
                  {mission.title}
                </p>
                <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                  {mission.current} / {mission.target}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{mission.description}</p>

              {/* Progress slider */}
              <div className="mt-2.5 w-full h-1 bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(mission.current / mission.target) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
