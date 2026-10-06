import { Palette, LayoutGrid } from "lucide-react"

interface AppearanceSectionProps {
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
}

export function AppearanceSection({
  onShowThemeModal,
  onShowLayoutModal,
}: AppearanceSectionProps) {
  if (!onShowThemeModal && !onShowLayoutModal) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
      <span className="px-3 font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
        APPEARANCE
      </span>
      {onShowThemeModal && (
        <button
          onClick={onShowThemeModal}
          title="Change color theme palette and phosphor aesthetic"
          aria-label="Open color theme switcher modal"
          className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <Palette className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Themes</span>
        </button>
      )}
      {onShowLayoutModal && (
        <button
          onClick={onShowLayoutModal}
          title="Switch page workspace layout architecture"
          aria-label="Open page layout switcher modal"
          className="flex items-center gap-2.5 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-mono text-[10px] uppercase tracking-widest text-left w-full cursor-pointer rounded focus-ring"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> <span>Layouts</span>
        </button>
      )}
    </div>
  )
}
