import katex from "katex"

export function renderMath(text: string): string {
  if (!text) return ""

  // 1. Replace block display equations: $$...$$
  let parsed = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
    try {
      return katex.renderToString(equation.trim(), { displayMode: true, throwOnError: false })
    } catch (e) {
      return `<span class="text-destructive">Error: ${equation}</span>`
    }
  })

  // 2. Replace inline equations: $...$ (ensuring we don't catch currency format)
  parsed = parsed.replace(/\$([^\$\s][^\$]*?[^\$\s]|[^\$\s])\$/g, (_, equation) => {
    try {
      return katex.renderToString(equation.trim(), { displayMode: false, throwOnError: false })
    } catch (e) {
      return `<span class="text-destructive">Error: ${equation}</span>`
    }
  })

  return parsed
}
