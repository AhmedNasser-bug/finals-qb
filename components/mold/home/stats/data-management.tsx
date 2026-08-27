import { AlertTriangle } from "lucide-react"

interface DataManagementProps {
  showConfirmReset: boolean
  setShowConfirmReset: (show: boolean) => void
  handleReset: () => void
}

export function DataManagement({ showConfirmReset, setShowConfirmReset, handleReset }: DataManagementProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="border-b border-zinc-800 pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
          04 // DATA SETTINGS
        </h2>
      </div>

      <div className="border border-destructive/20 bg-destructive/5 rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span>RESET ALL STUDY DATA</span>
          </p>
          <p className="text-[10px] text-zinc-400 max-w-md">
            This action deletes all your completed quizzes, study streaks, best streak records, and progress stats. This cannot be undone.
          </p>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            aria-label="Wipe all local telemetry and run data"
            className="bg-transparent hover:bg-destructive/10 text-destructive hover:text-red-400 border border-destructive/30 px-4 py-2 rounded text-xs font-mono tracking-wider cursor-pointer transition-all shrink-0 uppercase font-bold"
          >
             RESET_DATA
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              aria-label="Confirm wipe all data"
              className="bg-destructive text-white hover:bg-red-600 px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
            >
              CONFIRM
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              aria-label="Cancel wipe all data"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
