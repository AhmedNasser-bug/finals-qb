import * as React from 'react'
import { Terminal } from 'lucide-react'
import type { CognitiveTelemetryEvent } from "@/lib/telemetry/telemetry-types"

export interface StreamTabProps {
  recentEvents: CognitiveTelemetryEvent[]
  setRecentEvents: React.Dispatch<React.SetStateAction<CognitiveTelemetryEvent[]>>
}

export function StreamTab({ recentEvents, setRecentEvents }: StreamTabProps) {
  return (
  <div className="border border-border bg-panel rounded p-4 space-y-3 font-mono text-xs animate-fade-in">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-bold text-foreground">Live Telemetry Ingestion Sink</span>
        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded">
          {recentEvents.length} Captured Events
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRecentEvents([])}
          className="text-[10px] px-2 py-1 border border-border text-muted-foreground hover:text-foreground rounded"
        >
          CLEAR SINK
        </button>
      </div>
    </div>
     {recentEvents.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground text-xs">
        No events currently in memory. Answer quiz questions or click elements on the page to watch real telemetry stream.
      </div>
    ) : (
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
        {recentEvents.map((ev, i) => (
          <div
            key={ev.id || i}
            className="p-2 border border-border/60 bg-background/60 rounded flex items-center justify-between gap-2 text-[11px] hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-muted-foreground text-[10px]">
                {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : "—"}
              </span>
              <span className={`px-1.5 py-0.2 font-bold uppercase rounded text-[10px] border ${
                ev.type === "rage_click"
                  ? "bg-destructive/10 text-destructive border-destructive/40"
                  : ev.type === "dead_click"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                  : "bg-primary/10 text-primary border-primary/30"
              }`}>
                {ev.type}
              </span>
              <span className="text-foreground truncate max-w-md">
                {ev.category} · {ev.subjectId || "global"}
              </span>
            </div>
             <span className="text-muted-foreground text-[10px] shrink-0 font-mono">
              ID: {ev.id.slice(-8)}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
  )
}
