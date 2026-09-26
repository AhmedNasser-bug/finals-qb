import React from "react"
import { cn } from "@/lib/utils"
import type { FullSubjectData } from "@/lib/mold-types"

export type CopyState = "idle" | "copied" | "error"
export type ShortenState = "idle" | "loading" | "done"

export interface LinkTabContentProps {
  encoding: boolean;
  encodeError: string | null;
  shareUrl: string;
  shortUrl: string;
  copyState: CopyState;
  shortenState: ShortenState;
  shortenError: string | null;
  sizeKb: string;
  isSizeLarge: boolean;
  onCopy: () => void;
  onShorten: () => void;
  onCopyShortUrl: () => void;
}

export function LinkTabContent({
  encoding,
  encodeError,
  shareUrl,
  shortUrl,
  copyState,
  shortenState,
  shortenError,
  sizeKb,
  isSizeLarge,
  onCopy,
  onShorten,
  onCopyShortUrl,
}: LinkTabContentProps) {
  return (
    <>
      <p className="text-xs text-muted-foreground leading-relaxed">
        The entire subject is encoded directly into the URL — no server required.
        Anyone with the link can import it instantly.
      </p>

      {encoding && (
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-xs font-mono text-muted-foreground animate-pulse">
          <SpinnerIcon aria-hidden="true" />
          Compressing subject data...
        </div>
      )}

      {encodeError && (
        <p className="text-xs font-mono text-destructive border border-destructive/30 rounded px-3 py-2 bg-destructive/5">
          {encodeError}
        </p>
      )}

      {!encoding && !encodeError && (
        <>
          {/* URL display */}
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              aria-label="Share URL"
              className="flex-1 min-w-0 bg-background border border-border rounded px-3 py-2 text-xs font-mono text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring truncate"
              onFocus={(e) => e.target.select()}
            />
            <button type="button"
              onClick={onCopy}
              aria-label="Copy share link"
              className={cn(
                "shrink-0 px-3 py-2 rounded border text-xs font-mono font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                copyState === "copied"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : copyState === "error"
                  ? "border-destructive/40 text-destructive"
                  : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <span aria-live="polite">
                {copyState === "copied" ? "Copied!" : copyState === "error" ? "Failed" : "Copy"}
              </span>
            </button>
          </div>

          {/* Shorten button + short URL */}
          <div className="flex flex-col gap-2">
            <button type="button"
              onClick={onShorten}
              disabled={shortenState === "loading"}
              title={shortenState === "loading" ? "Currently shortening link..." : undefined}
              className={cn(
                "w-full py-2 rounded border text-xs font-mono font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                shortenState === "loading"
                  ? "border-primary/40 bg-primary/10 text-primary opacity-60 cursor-wait"
                  : shortenState === "done"
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <span aria-live="polite">
                {shortenState === "loading"
                  ? "Shortening..."
                  : shortenState === "done"
                  ? "Shortened!"
                  : "Shorten Link"}
              </span>
            </button>
            {shortUrl && (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shortUrl}
                  aria-label="Short URL"
                  className="flex-1 min-w-0 bg-background border border-green-500/30 rounded px-3 py-2 text-xs font-mono text-green-400 focus:outline-none focus:ring-1 focus:ring-ring truncate"
                  onFocus={(e) => e.target.select()}
                />
                <button type="button"
                  onClick={onCopyShortUrl}
                  aria-label="Copy shortened link"
                  className="shrink-0 px-3 py-2 rounded border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-mono font-semibold tracking-wider hover:bg-green-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <span aria-live="polite">
                    {copyState === "copied" ? "Copied!" : copyState === "error" ? "Failed" : "Copy"}
                  </span>
                </button>
              </div>
            )}
            {shortenError && (
              <p className="text-xs font-mono text-destructive/80">{shortenError}</p>
            )}
          </div>

          {/* Size indicator */}
          <div className={cn(
            "flex items-start gap-2 rounded px-3 py-2 text-xs font-mono border",
            isSizeLarge
              ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
              : "border-border bg-secondary text-muted-foreground"
          )}>
            {isSizeLarge ? <WarnIcon aria-hidden="true" /> : <InfoIcon aria-hidden="true" />}
            <span>
              Compressed size: <span className="text-foreground">{sizeKb} KB</span>
              {isSizeLarge && (
                <span className="block mt-0.5 text-yellow-400/80">
                  Large subjects may not open correctly in some messaging apps.
                  Use the file download instead for reliable sharing.
                </span>
              )}
            </span>
          </div>
        </>
      )}
    </>
  )
}

interface FileTabContentProps {
  subject: FullSubjectData;
  onDownload: () => void;
}

export function FileTabContent({ subject, onDownload }: FileTabContentProps) {
  return (
    <>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Download the subject as a raw <span className="font-mono text-foreground">.json</span> file.
        The recipient can import it directly into Finalist using the subject importer.
      </p>

      <div className="flex flex-col gap-2 border border-border rounded p-4 bg-background">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">Filename</span>
          <span className="text-xs font-mono text-foreground">{subject.id}.json</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">Questions</span>
          <span className="text-xs font-mono text-foreground">{subject.questions.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">Flashcards</span>
          <span className="text-xs font-mono text-foreground">{subject.flashcards?.length ?? 0}</span>
        </div>
      </div>

      <button type="button"
        onClick={onDownload}
        title="Download subject JSON file"
        className="w-full py-2.5 rounded border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Download {subject.id}.json
      </button>
    </>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

export function CloseIcon() {
  return (
    <svg className="w-4 h-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function SpinnerIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

export function WarnIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  )
}
