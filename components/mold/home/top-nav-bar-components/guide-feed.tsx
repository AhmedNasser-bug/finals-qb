import { GuideLink } from "@/components/mold/common/guide-link"

interface GuideFeedProps {
  tipIndex: number
  tips: string[]
  onCycleTip: () => void
}

export function GuideFeed({ tipIndex, tips, onCycleTip }: GuideFeedProps) {
  return (
    <div className="hidden md:flex items-center gap-2 flex-1 max-w-md lg:max-w-2xl xl:max-w-[900px] mx-4">
      {/* Feed bar — clickable to cycle tips */}
      <button
        onClick={onCycleTip}
        title="Click to cycle next study tip"
        aria-label="Cycle to next study recommendation"
        type="button"
        className="flex items-center text-left gap-3 bg-secondary/80 border border-primary/35 hover:border-primary/60 px-3.5 py-2 flex-1 min-w-0 cursor-pointer select-none group transition-all duration-300 shadow-[0_0_12px_hsla(var(--primary),0.03)] hover:shadow-[0_0_20px_hsla(var(--primary),0.12)] border-glow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_hsla(var(--primary),0.4)]" aria-hidden="true" />
          <span className="font-mono text-[9px] tracking-widest text-primary uppercase font-bold bg-primary/10 border border-primary/40 px-2 py-0.5 transition-colors group-hover:bg-primary/25 group-hover:border-primary rounded">
            STUDY TIPS
          </span>
        </div>
        <p className="font-mono text-[10px] lg:text-xs text-foreground group-hover:text-primary font-semibold tracking-wide transition-colors leading-relaxed truncate">
          {tips[tipIndex]}
        </p>
      </button>

      {/* Pulsating GUIDE link */}
      <GuideLink
        source="top_nav"
        title="Open comprehensive user guide and learning strategies"
        aria-label="Open comprehensive user guide"
        className="flex items-center gap-1.5 px-2.5 py-2 border border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/70 transition-all duration-200 group cursor-pointer focus-ring shrink-0 relative rounded"
      >
        {/* outer pulse ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 border border-primary/20 animate-pulse pointer-events-none rounded"
        />
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_6px_hsla(var(--primary),0.6)] shrink-0" aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-primary uppercase group-hover:text-foreground transition-colors">
          GUIDE
        </span>
      </GuideLink>
    </div>
  )
}
