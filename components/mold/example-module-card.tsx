import { type ExampleManifestEntry } from "@/app/actions"
import { ShareIcon, SpinnerIcon, StatPill } from "./subject-selector-components"

export interface ExampleModuleCardProps {
  entry: ExampleManifestEntry
  isLoading: boolean
  onLoad: (entry: ExampleManifestEntry) => void
  onShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void
}

export function ExampleModuleCard({
  entry,
  isLoading,
  onLoad,
  onShare,
}: ExampleModuleCardProps) {
  return (
    <div
      className="group relative flex flex-col bg-panel border border-border hover:border-border/80 transition-colors"
    >
      {/* Absolute overlay for primary action (load module) to avoid nesting buttons */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isLoading) onLoad(entry)
        }}
        onKeyDown={(e) => {
          if (isLoading) return
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onLoad(entry)
          }
        }}
        aria-disabled={isLoading}
        aria-busy={isLoading}
        title={isLoading ? "Loading module..." : undefined}
        aria-label={`Load module ${entry.name}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      <div className="relative z-10 flex flex-col gap-3 p-4 text-left flex-1 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground leading-snug text-pretty">{entry.name}</p>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => !isLoading && onShare(e, entry)}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-disabled={isLoading}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-auto"
              aria-label={`Share ${entry.name}`}
              title={isLoading ? "Loading module..." : "Share subject"}
            >
              <ShareIcon />
            </button>
            <span className="text-[10px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary/70 bg-primary/5">
              EXAMPLE
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {entry.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <StatPill label="Q" value={entry.questionCount} />
          <StatPill label="Cat" value={entry.categoryCount} />
          {entry.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-border bg-background text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-border px-4 py-2.5 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-mono text-muted-foreground">{entry.id}</span>
        {isLoading ? (
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
            <SpinnerIcon />
            LOADING...
          </div>
        ) : (
          <button
            onClick={() => onLoad(entry)}
            className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-auto"
          >
            LOAD_MODULE →
          </button>
        )}
      </div>
    </div>
  )
}
