"use client"

interface HeaderWellProps {
  subjectName: string
  description: string
  runCount: number
  visualAccuracyPct: number
}

export function HeaderWell({
  subjectName,
  description,
  runCount,
  visualAccuracyPct,
}: HeaderWellProps) {
  return (
    <header className="mb-10 relative select-none">
      <div className="bg-[#0b0c0f] p-8 border-l-4 border-primary inner-recess rounded-r-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="font-mono text-[10px] text-primary mb-1 tracking-[0.3em] uppercase opacity-70">
              ACTIVE SUBJECT
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-headline font-black tracking-tight text-white uppercase leading-none break-words break-all">
              {subjectName} <span className="text-primary-fixed-dim block md:inline text-xs sm:text-sm md:text-base lg:text-lg opacity-50">M1</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans max-w-xl pt-2 font-medium">
              {description}
            </p>
          </div>
          <div
            className="flex flex-col items-start md:items-end gap-1.5 shrink-0 bg-zinc-900/50 p-4 border border-zinc-800/80 rounded focus-ring"
            tabIndex={0}
            title="Your historical average accuracy across all runs for this subject"
            aria-label={`Average accuracy is ${runCount > 0 ? visualAccuracyPct.toFixed(1) : 100.0}%`}
          >
            <div className="font-mono text-[9px] text-primary uppercase tracking-widest font-bold" aria-hidden="true">
              AVERAGE ACCURACY
            </div>
            <div className="text-3xl sm:text-4xl font-headline font-black text-emerald-400" aria-hidden="true">
              {runCount > 0 ? `${visualAccuracyPct.toFixed(1)}%` : "100.0%"}
            </div>
          </div>
        </div>
      </div>
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />
    </header>
  )
}
