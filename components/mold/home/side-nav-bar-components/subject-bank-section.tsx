import { RotateCcw, Sparkles, Plus } from "lucide-react"

interface SubjectBankSectionProps {
  onChangeSubject: () => void
  onAddQuestions: () => void
  onImportNew: () => void
}

export function SubjectBankSection({
  onChangeSubject,
  onAddQuestions,
  onImportNew,
}: SubjectBankSectionProps) {
  return (
    <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
      <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
        SUBJECT BANK
      </span>
      <button
        onClick={onChangeSubject}
        title="Switch to another subject module in your library"
        aria-label="Switch to another subject module in your library"
        className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> <span>Switch Subject</span>
      </button>

      <button
        onClick={onAddQuestions}
        title="Open AI Pedagogical Question Generator Wizard"
        aria-label="Open AI Pedagogical Question Generator Wizard"
        className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring group"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>Add questions</span>
        </div>
        <span className="font-mono text-[8px] font-bold px-1 py-0.2 border border-primary/30 bg-primary/10 text-primary rounded tracking-wider">
          AI
        </span>
      </button>

      <button
        onClick={onImportNew}
        title="Import new custom subject from a JSON document"
        aria-label="Import new custom subject from a JSON document"
        className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" /> <span>Import JSON</span>
      </button>
    </div>
  )
}
