import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { Volume2, VolumeX, Sun, Moon, Palette, LayoutGrid } from "lucide-react"
import { GuideLink } from "@/components/mold/common/guide-link"
import { BookIcon } from "./icons"

interface ControlsProps {
  activeSubjectName?: string
  loadedSubjectsCount?: number
  muted: boolean
  themeMode: "light" | "dark"
  hasClerk: boolean
  onToggleMute: () => void
  onToggleMode: () => void
  onShowThemeModal?: () => void
  onShowLayoutModal?: () => void
  onImportNew?: () => void
}

export function Controls({
  activeSubjectName,
  loadedSubjectsCount,
  muted,
  themeMode,
  hasClerk,
  onToggleMute,
  onToggleMode,
  onShowThemeModal,
  onShowLayoutModal,
  onImportNew,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {activeSubjectName && (
        <span
          className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase truncate max-w-[120px] sm:max-w-[200px] rounded"
          title={activeSubjectName}
        >
          {activeSubjectName}
        </span>
      )}

      {loadedSubjectsCount !== undefined && (
        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 tracking-widest uppercase shrink-0 rounded">
          {loadedSubjectsCount} SUBJECT{loadedSubjectsCount !== 1 ? "S" : ""} LOADED
        </span>
      )}

      <button
        onClick={onToggleMute}
        title={muted ? "Unmute audio synthesizer (Press M)" : "Mute audio synthesizer (Press M)"}
        aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
        className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] flex items-center justify-center shrink-0 rounded"
      >
        {muted ? (
          <VolumeX className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <Volume2 className="w-4 h-4 text-primary" aria-hidden="true" />
        )}
      </button>

      {/* Quick Mode Toggle (Light/Dark) */}
      <button
        onClick={onToggleMode}
        title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        aria-label={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] flex items-center justify-center shrink-0 rounded"
      >
        {themeMode === 'light' ? (
          <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
        ) : (
          <Moon className="w-4 h-4 text-primary" aria-hidden="true" />
        )}
      </button>

      {onShowThemeModal && (
        <button
          onClick={onShowThemeModal}
          title="Change color theme palette"
          aria-label="Open color theme switcher"
          className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] flex items-center justify-center shrink-0 rounded"
        >
          <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
        </button>
      )}

      {onShowLayoutModal && (
        <button
          onClick={onShowLayoutModal}
          title="Switch workspace page layout"
          aria-label="Open page layout switcher"
          className="p-2 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
        >
          <LayoutGrid className="w-4 h-4 text-primary" aria-hidden="true" />
        </button>
      )}

      {onImportNew && (
        <button
          onClick={onImportNew}
          title="Import New Subject JSON"
          aria-label="Import new subject from JSON file"
          className="p-1.5 border border-border text-primary/80 hover:text-primary hover:bg-secondary hover:border-primary/40 transition-all focus-ring cursor-pointer min-h-[32px] hidden sm:flex items-center justify-center shrink-0 rounded"
        >
          <span className="font-mono text-[9px] font-bold px-1 uppercase tracking-wider">IMPORT</span>
        </button>
      )}

      {/* Mobile GUIDE link */}
      <GuideLink
        source="mobile_top_nav"
        title="Open comprehensive user guide"
        aria-label="Open comprehensive user guide"
        className="md:hidden p-2 border border-primary/30 text-primary hover:text-primary hover:border-primary/60 transition-all focus-ring cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 relative rounded"
      >
        <span aria-hidden="true" className="absolute inset-0 border border-primary/15 animate-pulse pointer-events-none rounded" />
        <BookIcon className="w-4 h-4" aria-hidden="true" />
      </GuideLink>

      {hasClerk && (
        <div className="flex items-center border-l border-zinc-800/60 pl-3 min-h-[28px]">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-[10px] font-mono font-bold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 hover:bg-primary/10 transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer">
                SIGN IN
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-6 h-6 border border-primary/30 rounded-none",
                  userButtonTrigger: "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
                }
              }}
            />
          </Show>
        </div>
      )}
    </div>
  )
}
