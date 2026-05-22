"use client"

import { useMemo } from "react"
import DOMPurify from "isomorphic-dompurify"
import { MermaidDiagram } from "./mermaid-diagram"

interface RichTextProps {
  content: string
  className?: string
  id?: string
}


export function parseRichTextParts(content: string) {
  if (!content) return []

  let normalized = content
  // Check if it's a raw mermaid string without markdown blocks
  if (!normalized.includes('```mermaid') &&
      /^(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|requirementDiagram|gitGraph)\b/i.test(normalized.trim())) {

      const lines = normalized.split(/(?:\\n|\n)/);
      const mermaidLines = [];
      const textLines = [];

      let isMermaid = true;
      for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          if (isMermaid) {
              if (i > 0 &&
                  !/(?:-->|---|==>|-.->)/.test(line) &&
                  (/^[A-Z][a-z]+/.test(line) || /[?.!]$/.test(line))) {
                  isMermaid = false;
                  textLines.push(lines[i]);
              } else {
                  mermaidLines.push(lines[i]);
              }
          } else {
              textLines.push(lines[i]);
          }
      }

      if (mermaidLines.length > 0) {
          normalized = `<div class="mermaid-block">${mermaidLines.join('\\n')}</div>\n\n${textLines.join('\\n')}`;
      }
  } else {
      normalized = normalized.replace(/```mermaid\s*[\r\n]+([\s\S]*?)```/g, '<div class="mermaid-block">$1</div>')
  }

  // Split by our custom mermaid block class
  const segments: { type: "html" | "mermaid", content: string }[] = []
  const mermaidRegex = /<div class="mermaid-block">([\s\S]*?)<\/div>|<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/gi

  let lastIndex = 0
  let match

  while ((match = mermaidRegex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        content: normalized.substring(lastIndex, match.index)
      })
    }

    segments.push({
      type: "mermaid",
      content: (match[1] || match[2]).trim()
    })

    lastIndex = mermaidRegex.lastIndex
  }

  if (lastIndex < normalized.length) {
    segments.push({
      type: "html",
      content: normalized.substring(lastIndex)
    })
  }

  return segments.length > 0 ? segments : [{ type: "html", content }]
}

export function RichText({ content, className, id = "q" }: RichTextProps) {
  // Extract mermaid code blocks
  const parts = useMemo(() => parseRichTextParts(content), [content])

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
        const cleanHtml = DOMPurify.sanitize(part.content);

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
