import { Terminal as TerminalIcon } from "lucide-react"

interface SubjectIdentityProps {
  subjectId: string
}

export function SubjectIdentity({ subjectId }: SubjectIdentityProps) {
  return (
    <div className="px-3 pb-3 border-b border-border/60">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary border-glow shrink-0">
          <TerminalIcon className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">STUDY PROFILE</div>
          <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-tighter truncate">
            ID: {subjectId.substring(0, 8).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}
