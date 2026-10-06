import { FolderDown, ChevronDown, ChevronRight, FileCode, FileText, FileCheck } from "lucide-react"

interface ExportSectionProps {
  exportExpanded: boolean
  onToggleExport: () => void
  onDownloadHtml: () => void
  onDownloadPdf: () => void
  onDownloadSolvedPdf: () => void
}

export function ExportSection({
  exportExpanded,
  onToggleExport,
  onDownloadHtml,
  onDownloadPdf,
  onDownloadSolvedPdf,
}: ExportSectionProps) {
  return (
    <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
      <button
        type="button"
        onClick={onToggleExport}
        aria-expanded={exportExpanded}
        aria-controls="study-exports-bundle"
        title="Toggle Export Study Materials menu"
        className="flex items-center justify-between px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-full text-left rounded focus-ring"
      >
        <div className="flex items-center gap-2">
          <FolderDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            STUDY EXPORTS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[8px] text-muted-foreground/70 bg-secondary px-1 py-0.2 rounded border border-border">
            3
          </span>
          {exportExpanded ? (
            <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>

      {exportExpanded && (
        <div id="study-exports-bundle" className="flex flex-col gap-1 pl-2 border-l-2 border-primary/20 ml-3.5 py-0.5 animate-slide-up">
          <button
            onClick={onDownloadHtml}
            title="Export offline interactive HTML study package"
            aria-label="Export offline interactive HTML study package"
            className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
          >
            <div className="flex items-center gap-2 truncate">
              <FileCode className="w-3 h-3 text-sky-400 shrink-0" aria-hidden="true" />
              <span className="truncate">HTML Sheet</span>
            </div>
            <span className="font-mono text-[8px] px-1 py-0.2 text-sky-400 bg-sky-400/10 border border-sky-400/20 rounded">
              HTML
            </span>
          </button>

          <button
            onClick={onDownloadPdf}
            title="Generate clean printable PDF question sheet"
            aria-label="Generate clean printable PDF question sheet"
            className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
          >
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
              <span className="truncate">Questions PDF</span>
            </div>
            <span className="font-mono text-[8px] px-1 py-0.2 text-primary bg-primary/10 border border-primary/20 rounded">
              PDF
            </span>
          </button>

          <button
            onClick={onDownloadSolvedPdf}
            title="Generate complete solved PDF with explanations, hints, and diagrams"
            aria-label="Generate complete solved PDF with explanations, hints, and diagrams"
            className="flex items-center justify-between px-2.5 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-wider text-left w-full cursor-pointer rounded focus-ring group"
          >
            <div className="flex items-center gap-2 truncate">
              <FileCheck className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="truncate">Solved PDF</span>
            </div>
            <span className="font-mono text-[8px] px-1 py-0.2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded">
              SOLVED
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
