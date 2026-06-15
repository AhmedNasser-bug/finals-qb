import { type ExampleManifestEntry } from "@/app/actions"
import { ShareIcon, SpinnerIcon, StatPill } from "@/components/mold/subject/subject-selector-components"

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
      className="group relative flex flex-col bg-panel border border-border hover:border-border/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#121318]/50 focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-background"
    >
      {/* Main card body layout (pure presentation, z-0 relative) */}
      <div className="flex flex-col gap-5 p-6 text-left flex-1 relative z-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-semibold text-foreground tracking-tight leading-snug text-pretty">{entry.name}</p>
          <div className="flex items-center gap-1 shrink-0 z-10 relative">
            <button
              onClick={(e) => { e.stopPropagation(); if (!isLoading) onShare(e, entry) }}
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Share ${entry.name}`}
              title={isLoading ? "Loading module..." : "Share subject"}
            >
              <ShareIcon aria-hidden="true" />
            </button>
            <span className="text-[10px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary/70 bg-primary/5">
              EXAMPLE
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed tracking-normal line-clamp-2 mt-1">
          {entry.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <StatPill label="Q" value={entry.questionCount} />
          <StatPill label="Cat" value={entry.categoryCount} />
          {entry.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-border bg-background text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Invisible main button overlay covering the whole card (except z-10 interactive controls) */}
      {!isLoading && (
        <button
          onClick={() => onLoad(entry)}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none z-0"
          aria-label={`Load module ${entry.name}`}
        />
      )}

      <div className="border-t border-border px-6 py-3.5 flex items-center justify-between z-10 relative">
        <span className="text-[10px] font-mono text-muted-foreground">{entry.id}</span>
        {isLoading ? (
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
            <SpinnerIcon />
            LOADING...
          </div>
        ) : (
          <button
            onClick={() => onLoad(entry)}
            className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            LOAD_MODULE →
          </button>
        )}
      </div>
    </div>
  )
}
