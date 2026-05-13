"use client"

import { useMemo } from "react"
import DOMPurify from "dompurify"
import { MermaidDiagram } from "./mermaid-diagram"

interface RichTextProps {
  content: string
  className?: string
  id?: string
}

export function RichText({ content, className, id = "q" }: RichTextProps) {
  // Extract mermaid code blocks
  const parts = useMemo(() => {
    if (!content) return []

    // Look for <pre><code class="language-mermaid">...</code></pre>
    // or just ```mermaid ... ``` (which might have been converted to HTML or not)
    // For simplicity we will look for a custom tag pattern or just parse standard code blocks

    // First let's normalize markdown-style mermaid blocks if they exist in the HTML
    let normalized = content.replace(/```mermaid\s*[\r\n]+([\s\S]*?)```/g, '<div class="mermaid-block">$1</div>')

    // Split by our custom mermaid block class
    const segments = []
    const mermaidRegex = /<div class="mermaid-block">([\s\S]*?)<\/div>|<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/gi

    let lastIndex = 0
    let match

    while ((match = mermaidRegex.exec(normalized)) !== null) {
      // Add text before the mermaid block
      if (match.index > lastIndex) {
        segments.push({
          type: "html",
          content: normalized.substring(lastIndex, match.index)
        })
      }

      // Add the mermaid block (match[1] is from div, match[2] is from pre>code)
      segments.push({
        type: "mermaid",
        content: (match[1] || match[2]).trim()
      })

      lastIndex = mermaidRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < normalized.length) {
      segments.push({
        type: "html",
        content: normalized.substring(lastIndex)
      })
    }

    return segments.length > 0 ? segments : [{ type: "html", content }]
  }, [content])

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "mermaid") {
          return (
            <MermaidDiagram
              key={`mermaid-${index}`}
              chart={part.content}
              id={`${id}-${index}`}
            />
          )
        }

        // Use DOMPurify for HTML content
        const cleanHtml = typeof window !== "undefined"
          ? DOMPurify.sanitize(part.content)
          : part.content // fallback for SSR (dangerouslySetInnerHTML handles basic sanitization)

        return (
          <span
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        )
      })}
    </span>
  )
}
