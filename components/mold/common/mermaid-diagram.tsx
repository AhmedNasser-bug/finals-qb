"use client"

import { useEffect, useRef, useState } from "react"
import { logger } from "@/lib/logger"

// ─── Types ────────────────────────────────────────────────────────────────────

type DiagramErrorCode =
  | "INITIALIZATION_FAILED"
  | "SYNTAX_ERROR"
  | "UNSUPPORTED_DIAGRAM"
  | "RENDER_TIMEOUT"
  | "SECURITY_VIOLATION"
  | "UNKNOWN"

interface DiagramError {
  code: DiagramErrorCode
  message: string
  details?: string
}

interface MermaidDiagramProps {
  /** Raw Mermaid source code. Required. */
  chart: string
  /** Unique ID used as the SVG element ID — must be unique across the page. */
  id: string
  /** Optional extra className for the wrapper div. */
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUPPORTED_TYPES = [
  "graph",
  "flowchart",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "requirementDiagram",
  "gitGraph",
  "mindmap",
  "timeline",
  "xychart-beta",
  "block-beta",
]

const SECURITY_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
  /onload\s*=/i,
  /data:text\/html/i,
]

const RENDER_TIMEOUT_MS = 8000

// ─── Theme config — MOLD V2 amber/dark palette ────────────────────────────────

const MOLD_MERMAID_CONFIG = {
  startOnLoad: false,
  theme: "dark" as const,
  themeVariables: {
    // Amber primary
    primaryColor: "#2a2500",
    primaryTextColor: "#fecc17",
    primaryBorderColor: "#4e4632",
    // Surfaces
    lineColor: "#4e4632",
    secondaryColor: "#1c1b1b",
    tertiaryColor: "#131313",
    background: "#0e0e0e",
    mainBkg: "#1c1b1b",
    secondBkg: "#201f1f",
    // Nodes
    nodeBorder: "#4e4632",
    clusterBkg: "#201f1f",
    clusterBorder: "#353534",
    // Text
    edgeLabelBackground: "#1c1b1b",
    // Sequence diagram
    actorBkg: "#201f1f",
    actorBorder: "#fecc17",
    actorTextColor: "#e5e2e1",
    actorLineColor: "#4e4632",
    signalColor: "#fecc17",
    signalTextColor: "#e5e2e1",
    // Typography
    fontSize: "13px",
    fontFamily: "ui-monospace, 'Geist Mono', monospace",
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis" as const,
    padding: 15,
  },
  maxTextSize: 90000,
  sequence: {
    useMaxWidth: true,
  },
  securityLevel: "strict" as const,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function classifyError(raw: unknown): DiagramError {
  if (raw && typeof raw === "object" && "code" in raw) {
    return raw as DiagramError
  }
  const msg =
    raw instanceof Error
      ? raw.message
      : typeof raw === "string"
        ? raw
        : "Unknown render error"
  return { code: "UNKNOWN", message: msg }
}

function sanitizeChart(raw: string): string {
  // Decode common HTML entities mermaid chokes on
  return raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\\N/g, "\n")
    .replace(/\\n/gi, "\n")
    .trim()
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MermaidDiagram({ chart, id, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<DiagramError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Guard against React 18 StrictMode double-invoke and re-renders
  const abortRef = useRef(false)
  const renderKey = useRef(`${id}-${Date.now()}`)

  useEffect(() => {
    abortRef.current = false
    setIsLoading(true)
    setError(null)
    setSvg("")

    // Use a stable key per chart+id combo so rerenders from parent don't flicker
    renderKey.current = `mld-${id}-${Date.now()}`

    let timeoutHandle: ReturnType<typeof setTimeout> | null = null

    const run = async () => {
      // ── Error Case 1: SSR guard ──────────────────────────────────────────
      if (typeof window === "undefined") return

      // ── Error Case 2: Empty chart ────────────────────────────────────────
      const clean = sanitizeChart(chart)
      if (!clean) {
        setError({ code: "SYNTAX_ERROR", message: "Diagram code is empty." })
        setIsLoading(false)
        return
      }

      // ── Error Case 3: Security scan ──────────────────────────────────────
      if (SECURITY_PATTERNS.some((p) => p.test(clean))) {
        setError({
          code: "SECURITY_VIOLATION",
          message: "Diagram contains disallowed content.",
          details: "Remove script tags, event handlers, or javascript: URIs.",
        })
        setIsLoading(false)
        return
      }

      // ── Error Case 4: Unsupported diagram type ───────────────────────────
      const firstToken = clean.split(/\s+/)[0].toLowerCase()
      const supported = SUPPORTED_TYPES.some((t) =>
        firstToken.startsWith(t.toLowerCase())
      )
      if (!supported) {
        setError({
          code: "UNSUPPORTED_DIAGRAM",
          message: `Diagram type "${firstToken}" is not supported.`,
          details: `Supported: ${SUPPORTED_TYPES.join(", ")}`,
        })
        setIsLoading(false)
        return
      }

      // ── Error Case 5: Mermaid library not loaded ─────────────────────────
      let mermaid: typeof import("mermaid").default
      try {
        const mod = await import("mermaid")
        mermaid = mod.default
      } catch (e) {
        setError({
          code: "INITIALIZATION_FAILED",
          message: "Failed to load Mermaid library.",
          details: String(e),
        })
        setIsLoading(false)
        return
      }

      if (abortRef.current) return

      // Initialize with MOLD theme
      try {
        mermaid.initialize(MOLD_MERMAID_CONFIG)
      } catch (e) {
        // Non-fatal — continue with whatever state mermaid is in
        logger.warn("[MermaidDiagram] initialize warning:", e)
      }

      // ── Error Case 6: Syntax validation ─────────────────────────────────
      try {
        await mermaid.parse(clean)
      } catch (parseErr: unknown) {
        const msg =
          parseErr instanceof Error ? parseErr.message : String(parseErr)
        setError({
          code: "SYNTAX_ERROR",
          message: "Invalid Mermaid syntax.",
          details: msg,
        })
        setIsLoading(false)
        return
      }

      if (abortRef.current) return

      // ── Error Case 7: Render timeout ─────────────────────────────────────
      let timedOut = false
      timeoutHandle = setTimeout(() => {
        timedOut = true
        if (!abortRef.current) {
          setError({
            code: "RENDER_TIMEOUT",
            message: "Diagram took too long to render.",
            details: `Timed out after ${RENDER_TIMEOUT_MS / 1000}s. Simplify the diagram.`,
          })
          setIsLoading(false)
        }
      }, RENDER_TIMEOUT_MS)

      // ── Render ────────────────────────────────────────────────────────────
      try {
        const { svg: renderedSvg } = await mermaid.render(renderKey.current, clean)

        if (timeoutHandle) clearTimeout(timeoutHandle)
        if (timedOut || abortRef.current) return

        // Post-process SVG: remove fixed dimensions, let CSS control sizing
        const processed = renderedSvg
          .replace(/ height="[^"]*"/, "")
          .replace(/ width="[^"]*"/, "")
          .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;max-height:100%;display:block;" ')

        setSvg(processed)
        setError(null)
      } catch (renderErr: unknown) {
        if (timeoutHandle) clearTimeout(timeoutHandle)
        if (timedOut || abortRef.current) return
        setError(classifyError(renderErr))
      } finally {
        if (!timedOut && !abortRef.current) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      abortRef.current = true
      if (timeoutHandle) clearTimeout(timeoutHandle)
      // Error Case 8: Cleanup on unmount — prevent stale SVG injection
      if (containerRef.current) containerRef.current.innerHTML = ""
    }
  }, [chart, id])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className={`mermaid-container flex items-center justify-center min-h-[200px] ${className ?? ""}`}
        role="status"
        aria-label="Loading diagram"
      >
        <div className="text-center space-y-3">
          <div
            className="mx-auto w-8 h-8 border-2 border-[#fecc17] border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
            COMPILING_DIAGRAM...
          </p>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className={`mermaid-container min-h-[200px] bg-[#1a0c0c] border border-destructive/50 p-4 space-y-3 ${className ?? ""}`}
        role="alert"
        aria-label="Diagram error"
      >
        <div className="flex items-start gap-3">
          <WarningIcon className="w-5 h-5 text-[#ff4d4d] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#ff4d4d] font-bold">
              DIAGRAM_ERR: {error.code.replace(/_/g, " ")}
            </p>
            <p className="font-mono text-xs text-[#e5e2e1]">{error.message}</p>
            {error.details && (
              <details className="mt-2">
                <summary className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors select-none">
                  SHOW_DETAILS
                </summary>
                <pre className="mt-2 font-mono text-[11px] bg-[#0e0e0e] border border-[#353534] p-3 overflow-x-auto text-zinc-400 leading-relaxed">
                  {error.details}
                </pre>
              </details>
            )}
          </div>
        </div>
        <details>
          <summary className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors select-none">
            VIEW_SOURCE
          </summary>
          <pre className="mt-2 font-mono text-[11px] bg-[#0e0e0e] border border-[#353534] p-3 overflow-x-auto text-primary/70 leading-relaxed">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  // ── Success: inject SVG ────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`mermaid-container w-full overflow-visible ${className ?? ""}`}
      role="img"
      aria-label="Diagram visualization"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG is generated by mermaid with strict security level
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// ─── TypeScript global augmentation ──────────────────────────────────────────
// Error Case 9: Ensures window.mermaid is typed if used from global scope.
declare global {
  interface Window {
    mermaid?: typeof import("mermaid").default
  }
}
