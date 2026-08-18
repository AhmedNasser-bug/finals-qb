import Link from "next/link"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import { hasClerk } from "@/lib/user-storage"

interface TopNavControlsProps {
  activeSubjectName?: string
  loadedSubjectsCount?: number
  onImportNew?: () => void
}

export function TopNavControls({
  activeSubjectName,
  loadedSubjectsCount,
  onImportNew
}: TopNavControlsProps) {
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
      <Link
        href="/guide"
        title="Open comprehensive user guide"
        aria-label="Open comprehensive user guide"
        className="md:hidden p-2 border border-primary/30 text-primary hover:text-primary hover:border-primary/60 transition-all focus-ring cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 relative rounded"
      >
        <span aria-hidden="true" className="absolute inset-0 border border-primary/15 animate-pulse pointer-events-none rounded" />
        <BookIcon className="w-4 h-4" aria-hidden="true" />
      </Link>

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

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}