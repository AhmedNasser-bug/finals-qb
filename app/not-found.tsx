import Link from "next/link"
import { Terminal, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground scanlines">
      <div className="border border-border bg-card/80 backdrop-blur-sm rounded p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
        <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
          <Terminal className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono text-primary tracking-widest uppercase font-bold">
            ERROR 404 // NULL_POINTER
          </p>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            SECTOR NOT FOUND
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            The requested protocol address or resource coordinates do not exist in the active matrix.
          </p>
        </div>
        <div className="p-3 bg-panel/60 border border-border rounded text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-destructive font-bold">ERR:</span>
            <span>RESOURCE_NOT_RESOLVED</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground/80 mt-1">
            Status: 404 (Not Found) // Origin: AppRouter
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            RETURN TO ROOT
          </Link>
        </div>
      </div>
    </div>
  )
}
