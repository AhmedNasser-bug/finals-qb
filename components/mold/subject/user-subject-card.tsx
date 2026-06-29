import { cn } from "@/lib/utils"
import { toSubjectData } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"
import { ShareIcon, StatPill } from "@/components/mold/subject/subject-selector-components"

export interface UserSubjectCardProps {
  full: FullSubjectData
  isConfirming: boolean
  categoryCount: number
  onSelect: (full: FullSubjectData) => void
  onShare: (full: FullSubjectData) => void
  onDeleteConfirm: (id: string) => void
  onDeleteCancel: () => void
  onRemoveClick: (id: string) => void
}

export function UserSubjectCard({
  full,
  isConfirming,
  categoryCount,
  onSelect,
  onShare,
  onDeleteConfirm,
  onDeleteCancel,
  onRemoveClick,
}: UserSubjectCardProps) {
  const data = toSubjectData(full)
  return (
    <div
      className={cn(
        "group relative flex flex-col bg-panel border transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:bg-[#121318]/50 focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
        isConfirming ? "border-destructive/40" : "border-border hover:border-border/80"
      )}
    >
      {/* Main card body layout (pure presentation, z-0 relative) */}
      <div className="flex flex-col gap-5 p-6 text-left flex-1 relative z-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-semibold text-foreground tracking-tight leading-snug text-pretty">{full.name}</p>
          <div className="flex items-center gap-1 shrink-0 z-10 relative">
            {!isConfirming && (
              <button
                onClick={() => onShare(full)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-ring"
                aria-label={`Share ${full.name}`}
                title="Share subject"
              >
                <ShareIcon aria-hidden="true" />
              </button>
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground">
              v{full.config.version ?? "1.0"}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed tracking-normal line-clamp-2 mt-1">
          {full.config.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <StatPill label="Q" value={data.totalQuestions} />
          <StatPill label="FC" value={full.flashcards?.length ?? 0} />
          <StatPill label="Cat" value={categoryCount} />
        </div>
      </div>

      {/* Invisible main button overlay covering the whole card (except z-10 interactive controls) */}
      {!isConfirming && (
        <button
          onClick={() => onSelect(full)}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none z-0"
          aria-label={`Select subject ${full.name}`}
        />
      )}

      <div className="flex items-center justify-between border-t border-border px-6 py-3.5 z-10 relative">
        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">{full.id}</span>
        {isConfirming ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-destructive/80">Delete?</span>
            <button
              onClick={() => onDeleteConfirm(full.id)}
              aria-label={`Confirm deletion of ${full.name}`}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors focus-ring"
            >Yes</button>
            <button
              onClick={onDeleteCancel}
              aria-label={`Cancel deletion of ${full.name}`}
              className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >No</button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onRemoveClick(full.id) }}
            className="text-[10px] font-mono text-muted-foreground/40 hover:text-destructive transition-colors px-1 focus-ring"
            aria-label={`Remove ${full.name}`}
          >Remove</button>
        )}
      </div>
    </div>
  )
}
