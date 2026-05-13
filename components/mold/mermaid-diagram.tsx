"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { useTheme } from "next-themes"

interface MermaidDiagramProps {
  chart: string
  id: string
}

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Determine actual theme mode
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

    // Configure Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-geist-sans), sans-serif",
    })

    const renderDiagram = async () => {
      try {
        setError(null)
        // Check if the code is valid
        // Mermaid fails if \N is capitalized or if html entities are unparsed.
        // We also want to replace common html entities just in case.
        let cleanChart = chart
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/\\N/g, "\n") // decode literal backslash N
          .replace(/\\n/gi, "\n");

        if (await mermaid.parse(cleanChart)) {
           // We need a unique ID for each render to avoid Mermaid cache collisions
           const uniqueId = `mermaid-${id}-${Date.now()}`
           const { svg } = await mermaid.render(uniqueId, cleanChart)
           setSvg(svg)
        }
      } catch (err: any) {
        console.error("Mermaid parsing error", err)
        // If mermaid throws an error, it usually creates an SVG with the error message
        setError(err?.message || "Failed to render diagram")
      }
    }

    if (chart) {
      renderDiagram()
    }
  }, [chart, theme, systemTheme, id])

  if (error) {
    return (
      <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-500 my-4 overflow-x-auto">
        <p className="font-semibold mb-2">Diagram Render Error</p>
        <pre>{error}</pre>
        <details className="mt-2 text-muted-foreground">
          <summary className="cursor-pointer">Source code</summary>
          <pre className="mt-2 text-muted-foreground">{chart}</pre>
        </details>
      </div>
    )
  }

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto p-4 rounded bg-white/5 dark:bg-black/20"
      dangerouslySetInnerHTML={{ __html: svg }}
      ref={containerRef}
    />
  )
}
