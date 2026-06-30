export function SectionLabel({ label, count, badge }: { label: string; count: number; badge?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground bg-background">{count}</span>
      {badge && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary/70 bg-primary/5">{badge}</span>
      )}
    </div>
  )
}

export function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 border border-border bg-background text-muted-foreground">
      {label}: <span className="text-foreground">{value}</span>
    </span>
  )
}

export function ProtocolIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ShareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

export function SpinnerIcon() {
  return (
    <svg className="w-3 h-3 animate-spin" role="status" aria-busy="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}
