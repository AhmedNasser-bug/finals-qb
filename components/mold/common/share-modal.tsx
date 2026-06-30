"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { shortenUrl } from "@/lib/url-shortener"
import {
  encodeSubject,
  buildShareUrl,
  downloadSubjectJson,
  SHARE_SIZE_WARN_BYTES,
} from "@/lib/subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"
import {
  LinkTabContent,
  FileTabContent,
  CloseIcon,
  type CopyState,
  type ShortenState,
} from "@/components/mold/common/share-modal-blocks"

interface ShareModalProps {
  subject: FullSubjectData
  onClose: () => void
}

type Tab = "link" | "file"

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

  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus inside overlay
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const previousFocus = document.activeElement as HTMLElement
    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      overlay.focus()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    overlay.addEventListener("keydown", handleKeyDown)
    return () => {
      overlay.removeEventListener("keydown", handleKeyDown)
      previousFocus?.focus()
    }
  }, [])

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
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in outline-none"
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
            className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded p-1"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border">
          {(["link", "file"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2.5 text-xs font-mono tracking-wider uppercase transition-colors focus-ring",
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
            <LinkTabContent
              encoding={encoding}
              encodeError={encodeError}
              shareUrl={shareUrl}
              shortUrl={shortUrl}
              copyState={copyState}
              shortenState={shortenState}
              shortenError={shortenError}
              sizeKb={sizeKb}
              isSizeLarge={isSizeLarge}
              onCopy={handleCopy}
              onShorten={handleShorten}
              onCopyShortUrl={async () => {
                try {
                  await navigator.clipboard.writeText(shortUrl)
                  setCopyState("copied")
                  setTimeout(() => setCopyState("idle"), 2500)
                } catch {
                  setCopyState("error")
                  setTimeout(() => setCopyState("idle"), 2500)
                }
              }}
            />
          )}

          {tab === "file" && (
            <FileTabContent
              subject={subject}
              onDownload={() => downloadSubjectJson(subject)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
