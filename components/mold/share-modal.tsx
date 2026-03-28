"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { shortenUrl } from "@/lib/url-shortener"
import {
  encodeSubject,
  buildShareUrl,
  downloadSubjectJson,
  SHARE_SIZE_WARN_BYTES,
} from "@/lib/subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"

interface ShareModalProps {
  subject: FullSubjectData
  onClose: () => void
}

type Tab = "link" | "file"
type CopyState = "idle" | "copied" | "error"
type ShortenState = "idle" | "loading" | "done"

export function ShareModal({ subject, onClose }: ShareModalProps) {
  const [tab, setTab]             = useState<Tab>("link")
  const [shareUrl, setShareUrl]   = useState<string>("")
  const [shortUrl, setShortUrl]   = useState<string>("")
  const [sizeBytes, setSizeBytes] = useState<number>(0)
  const [encoding, setEncoding]   = useState<boolean>(true)
  const [encodeError, setEncodeError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const [shortenState, setShortenState] = useState<ShortenState>("idle")
  const [shortenError, setShortenError] = useState<string | null>(null)

  // ── Encode on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setEncoding(true)
    setEncodeError(null)

    encodeSubject(subject).then((result) => {
      if (cancelled) return
      setEncoding(false)
      if ("error" in result) {
        setEncodeError(result.error)
      } else {
        setSizeBytes(result.bytes)
        setShareUrl(buildShareUrl(result.encoded))
      }
    })

    return () => { cancelled = true }
  }, [subject])

  // ── Escape to close ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyState("copied")
      setTimeout(() => setCopyState("idle"), 2500)
    } catch {
      setCopyState("error")
      setTimeout(() => setCopyState("idle"), 2500)
    }
  }, [shareUrl])

  // ── Shorten URL ─────────────────────────────────────────────────────────
  const handleShorten = useCallback(async () => {
    if (!shareUrl || shortenState !== "idle") return
    setShortenState("loading")
    setShortenError(null)

    const result = await shortenUrl(shareUrl)
    if ("error" in result) {
      setShortenError(result.error)
      setShortenState("idle")
    } else {
      setShortUrl(result.shortUrl)
      setShortenState("done")
      setTimeout(() => setShortenState("idle"), 2500)
    }
  }, [shareUrl, shortenState])

  const sizeKb       = (sizeBytes / 1024).toFixed(1)
  const isSizeLarge  = sizeBytes > SHARE_SIZE_WARN_BYTES

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-panel border border-border rounded flex flex-col shadow-xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 id="share-modal-title" className="text-sm font-semibold text-foreground">
              Share Subject
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{subject.name}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border">
          {(["link", "file"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2.5 text-xs font-mono tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-ring",
                tab === t
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "link" ? "Share Link" : "Download File"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 flex flex-col gap-4">

          {tab === "link" && (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The entire subject is encoded directly into the URL — no server required.
                Anyone with the link can import it instantly.
              </p>

              {encoding && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground animate-pulse">
                  <SpinnerIcon />
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
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "shrink-0 px-3 py-2 rounded border text-xs font-mono font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        copyState === "copied"
                          ? "border-green-500/40 bg-green-500/10 text-green-400"
                          : copyState === "error"
                          ? "border-destructive/40 text-destructive"
                          : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      {copyState === "copied" ? "Copied!" : copyState === "error" ? "Failed" : "Copy"}
                    </button>
                  </div>

                  {/* Shorten button + short URL */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleShorten}
                      disabled={shortenState === "loading"}
                      className={cn(
                        "w-full py-2 rounded border text-xs font-mono font-semibold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        shortenState === "loading"
                          ? "border-primary/40 bg-primary/10 text-primary opacity-60 cursor-wait"
                          : shortenState === "done"
                          ? "border-green-500/40 bg-green-500/10 text-green-400"
                          : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      {shortenState === "loading"
                        ? "Shortening..."
                        : shortenState === "done"
                        ? "Shortened!"
                        : "Shorten Link"}
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
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(shortUrl)
                              setCopyState("copied")
                              setTimeout(() => setCopyState("idle"), 2500)
                            } catch {
                              setCopyState("error")
                              setTimeout(() => setCopyState("idle"), 2500)
                            }
                          }}
                          className="shrink-0 px-3 py-2 rounded border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-mono font-semibold tracking-wider hover:bg-green-500/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          Copy
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
                    {isSizeLarge ? <WarnIcon /> : <InfoIcon />}
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
          )}

          {tab === "file" && (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download the subject as a raw <span className="font-mono text-foreground">.json</span> file.
                The recipient can import it directly into MOLD V2 using the subject importer.
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

              <button
                onClick={() => downloadSubjectJson(subject)}
                className="w-full py-2.5 rounded border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-semibold tracking-wider hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Download {subject.id}.json
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  )
}
