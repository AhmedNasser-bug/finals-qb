export function TopNavBranding() {
  return (
    <div className="flex items-center gap-2.5">
      <ProtocolIcon className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
      <div>
        <p className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase leading-none">FINALIST</p>
        <p className="text-[9px] font-mono text-muted-foreground tracking-wider leading-none mt-1">STUDY SYSTEM</p>
      </div>
    </div>
  )
}

function ProtocolIcon({ className, 'aria-hidden': ariaHidden }: { className?: string, 'aria-hidden'?: boolean | "true" | "false" }) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}