import { formatLabel, type FullSubjectData } from "@/lib/mold-types"
import { validateSubjectData } from "@/lib/subject-persistence"

// ─── Constants ────────────────────────────────────────────────────────────────

/** URL hash prefix that signals a shared payload is present. */
export const SHARE_HASH_PREFIX = "#share="

/**
 * Threshold (bytes) above which we warn that the URL may be unreliable.
 * Most browsers support URLs up to 2 MB but servers / link-shorteners often
 * truncate at 8 KB. We warn at 50 KB — acceptable for typical subject files.
 */
export const SHARE_SIZE_WARN_BYTES = 50_000

// ─── Encode ───────────────────────────────────────────────────────────────────

/**
 * Compress a FullSubjectData payload into a Base64url string suitable for
 * embedding in a URL hash. Uses the native CompressionStream (gzip) API.
 *
 * Returns { encoded, bytes } on success or { error } on failure.
 */
export async function encodeSubject(
  subject: FullSubjectData
): Promise<{ encoded: string; bytes: number } | { error: string }> {
  try {
    const json = JSON.stringify(subject)
    const bytes = new TextEncoder().encode(json)

    // gzip compress
    const cs = new CompressionStream("gzip")
    const writer = cs.writable.getWriter()
    writer.write(bytes)
    writer.close()

    const compressed = await new Response(cs.readable).arrayBuffer()
    const base64 = arrayBufferToBase64url(compressed)

    return { encoded: base64, bytes: compressed.byteLength }
  } catch (e) {
    return { error: `Encoding failed: ${e instanceof Error ? e.message : String(e)}` }
  }
}

/**
 * Decompress and validate a Base64url-encoded subject payload.
 *
 * Returns { subject } on success or { error } on failure.
 */
export async function decodeSubject(
  encoded: string
): Promise<{ subject: FullSubjectData } | { error: string }> {
  try {
    const compressed = base64urlToArrayBuffer(encoded)

    const ds = new DecompressionStream("gzip")
    const writer = ds.writable.getWriter()
    // Await the write, but catch any errors to prevent unhandled rejections
    // if the gzip payload is invalid.
    writer.write(new Uint8Array(compressed)).catch(() => {})
    writer.close().catch(() => {})

    // Await the read. If decompression fails (e.g., Z_DATA_ERROR), it will throw here.
    const decompressed = await new Response(ds.readable).arrayBuffer()
    const json = new TextDecoder().decode(decompressed)
    const raw: unknown = JSON.parse(json)

    const result = validateSubjectData(raw)
    if (!result.valid) {
      return { error: `Invalid subject data: ${result.errors.slice(0, 3).join("; ")}` }
    }

    return { subject: result.subject! }
  } catch (e) {
    return { error: `Decoding failed: ${e instanceof Error ? e.message : String(e)}` }
  }
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Build the full shareable URL for a given encoded payload.
 * Always targets /subjects so recipients land on the selection page, which
 * handles the #share= hash and shows the ShareReceiver overlay.
 * Existing links pointing to "/" also work — root redirects to /subjects.
 */
export function buildShareUrl(encoded: string): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}/subjects`
      : "/subjects"
  return `${base}${SHARE_HASH_PREFIX}${encoded}`
}

/**
 * Detect whether the current page was loaded with a share hash.
 * Safe to call server-side (returns null).
 */
export function detectShareHash(): string | null {
  if (typeof window === "undefined") return null
  const hash = window.location.hash
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null
  const payload = hash.slice(SHARE_HASH_PREFIX.length)
  return payload.length > 0 ? payload : null
}

/** Remove the share hash from the browser URL without triggering a navigation. */
export function clearShareHash(): void {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  url.hash = ""
  window.history.replaceState(null, "", url.toString().replace(/#$/, ""))
}

// ─── File download fallback ───────────────────────────────────────────────────

/** Trigger a browser download of the subject as a raw .json file. */
export function downloadSubjectJson(subject: FullSubjectData): void {
  const blob = new Blob([JSON.stringify(subject, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${subject.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/** Trigger a browser download of the subject as a beautifully styled self-rendering HTML revision sheet. */
/** Generate the compiled self-rendering HTML revision sheet. */
export function generateSubjectHtml(subject: FullSubjectData, isPrint: boolean = false): string {
  const categories = Array.from(new Set(subject.questions.map((q) => q.category)))
  
  const lines: string[] = []
  
  lines.push("<!DOCTYPE html>")
  lines.push('<html lang="en">')
  lines.push("<head>")
  lines.push('  <meta charset="UTF-8">')
  lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
  lines.push(`  <title>${subject.name} Revision Sheet</title>`)
  lines.push('  <!-- KaTeX CSS & JS -->')
  lines.push('  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">')
  lines.push('  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>')
  lines.push('  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>')
  lines.push('  <!-- Google Fonts -->')
  lines.push('  <link rel="preconnect" href="https://fonts.googleapis.com">')
  lines.push('  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
  lines.push('  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" rel="stylesheet">')
  
  lines.push("  <style>")
  lines.push("    :root {")
  if (isPrint) {
    lines.push("      --background: 0 0% 100%;")
    lines.push("      --foreground: 0 0% 0%;")
    lines.push("      --primary: 43 96% 40%;")
    lines.push("      --panel: 0 0% 98%;")
    lines.push("      --border: 0 0% 85%;")
    lines.push("      --muted: 0 0% 40%;")
    lines.push("      --success: 142 70% 30%;")
    lines.push("      --badge-text: #1e7e34;")
    lines.push("      --hint-text: #856404;")
    lines.push("      --explanation-text: #2b2b2b;")
    lines.push("      --explanation-border: #004499;")
    lines.push("      --explanation-bg: rgba(0, 68, 153, 0.05);")
  } else {
    lines.push("      --background: 220 13% 6%;")
    lines.push("      --foreground: 210 20% 92%;")
    lines.push("      --primary: 43 96% 52%;")
    lines.push("      --panel: 220 12% 11%;")
    lines.push("      --border: 220 10% 18%;")
    lines.push("      --muted: 215 12% 45%;")
    lines.push("      --success: 142 70% 45%;")
    lines.push("      --badge-text: #4ae176;")
    lines.push("      --hint-text: #d1b46a;")
    lines.push("      --explanation-text: #b8b5b4;")
    lines.push("      --explanation-border: #0066cc;")
    lines.push("      --explanation-bg: rgba(0, 102, 204, 0.03);")
  }
  lines.push("    }")
  lines.push("")
  lines.push("    body {")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      color: hsl(var(--foreground));")
  lines.push("      font-family: 'Geist', sans-serif;")
  lines.push("      margin: 0;")
  lines.push("      padding: 0;")
  lines.push("      display: flex;")
  lines.push("      justify-content: center;")
  lines.push("    }")
  lines.push("")
  lines.push("    .container {")
  lines.push("      max-width: 800px;")
  lines.push("      width: 100%;")
  lines.push("      padding: 40px 24px;")
  lines.push("      box-sizing: border-box;")
  lines.push("    }")
  lines.push("")
  lines.push("    .font-mono {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("    }")
  lines.push("")
  lines.push("    .header-panel {")
  lines.push("      background-color: hsl(var(--panel));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 24px;")
  lines.push("      margin-bottom: 32px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 24px;")
  lines.push("      font-weight: 800;")
  lines.push("      text-transform: uppercase;")
  lines.push("      color: hsl(var(--primary));")
  lines.push("      margin: 0 0 8px 0;")
  lines.push("      letter-spacing: -0.05em;")
  lines.push("    }")
  lines.push("")
  lines.push("    .subtitle {")
  lines.push("      font-size: 14px;")
  lines.push("      color: hsl(var(--foreground));")
  lines.push("      opacity: 0.8;")
  lines.push("      margin: 0 0 16px 0;")
  lines.push("      line-height: 1.5;")
  lines.push("    }")
  lines.push("")
  lines.push("    .meta-grid {")
  lines.push("      display: grid;")
  lines.push("      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));")
  lines.push("      gap: 12px;")
  lines.push("      border-top: 1px dashed hsl(var(--border));")
  lines.push("      padding-top: 16px;")
  lines.push("      font-size: 11px;")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("    }")
  lines.push("")
  lines.push("    .section-title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 18px;")
  lines.push("      font-weight: 700;")
  lines.push("      text-transform: uppercase;")
  lines.push("      letter-spacing: 0.1em;")
  lines.push("      border-bottom: 2px solid hsl(var(--primary));")
  lines.push("      padding-bottom: 8px;")
  lines.push("      margin: 40px 0 24px 0;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-card {")
  lines.push("      background-color: hsl(var(--panel));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 24px;")
  lines.push("      margin-bottom: 24px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-id {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      letter-spacing: 0.2em;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("      text-transform: uppercase;")
  lines.push("      margin-bottom: 12px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-text {")
  lines.push("      font-size: 16px;")
  lines.push("      font-weight: 600;")
  lines.push("      line-height: 1.6;")
  lines.push("      margin: 0 0 16px 0;")
  lines.push("    }")
  lines.push("")
  lines.push("    .options-list {")
  lines.push("      display: flex;")
  lines.push("      flex-direction: column;")
  lines.push("      gap: 10px;")
  lines.push("      margin-top: 16px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .option-item {")
  lines.push("      display: flex;")
  lines.push("      align-items: flex-start;")
  lines.push("      gap: 12px;")
  lines.push("      padding: 12px 16px;")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      font-size: 14px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .option-checkbox {")
  lines.push("      width: 16px;")
  lines.push("      height: 16px;")
  lines.push("      border: 1px solid hsl(var(--muted));")
  lines.push("      display: flex;")
  lines.push("      align-items: center;")
  lines.push("      justify-content: center;")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      flex-shrink: 0;")
  lines.push("      margin-top: 2px;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("    }")
  lines.push("")
  lines.push("    .diagram-box {")
  lines.push("      margin: 16px 0;")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 16px;")
  lines.push("      overflow-x: auto;")
  lines.push("      display: flex;")
  lines.push("      justify-content: center;")
  lines.push("      align-items: center;")
  lines.push("      min-height: 100px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .mermaid-render {")
  lines.push("      width: 100%;")
  lines.push("      display: flex;")
  lines.push("      justify-content: center;")
  lines.push("    }")
  lines.push("")
  lines.push("    .mermaid-render svg {")
  lines.push("      max-width: 100% !important;")
  lines.push("      height: auto !important;")
  lines.push("    }")
  lines.push("")
  lines.push("    .answer-card {")
  lines.push("      background-color: hsl(var(--panel));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 24px;")
  lines.push("      margin-bottom: 24px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .correct-badge {")
  lines.push("      display: inline-block;")
  lines.push("      padding: 4px 10px;")
  lines.push("      background-color: hsl(var(--success) / 0.15);")
  lines.push("      border: 1px solid hsl(var(--success));")
  lines.push("      color: var(--badge-text);")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 12px;")
  lines.push("      font-weight: 700;")
  lines.push("      margin-bottom: 12px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout {")
  lines.push("      border-left: 4px solid;")
  lines.push("      padding: 12px 16px;")
  lines.push("      margin-top: 12px;")
  lines.push("      font-size: 13px;")
  lines.push("      line-height: 1.5;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-hint {")
  lines.push("      border-left-color: hsl(var(--primary));")
  lines.push("      background-color: hsl(var(--primary) / 0.03);")
  lines.push("      color: var(--hint-text);")
  lines.push("      font-style: italic;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-explanation {")
  lines.push("      border-left-color: var(--explanation-border);")
  lines.push("      background-color: var(--explanation-bg);")
  lines.push("      color: var(--explanation-text);")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      font-weight: 700;")
  lines.push("      text-transform: uppercase;")
  lines.push("      letter-spacing: 0.1em;")
  lines.push("      margin-bottom: 4px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .action-links {")
  lines.push("      display: flex;")
  lines.push("      justify-content: space-between;")
  lines.push("      font-size: 11px;")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      margin-top: 16px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .action-links a {")
  lines.push("      color: hsl(var(--primary));")
  lines.push("      text-decoration: none;")
  lines.push("    }")
  lines.push("")
  lines.push("    .action-links a:hover {")
  lines.push("      text-decoration: underline;")
  lines.push("    }")
  lines.push("")
  lines.push("    @media print {")
  lines.push("      body {")
  lines.push("        background-color: #ffffff !important;")
  lines.push("        color: #000000 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .container {")
  lines.push("        max-width: 100%;")
  lines.push("        padding: 0;")
  lines.push("      }")
  lines.push("")
  lines.push("      .header-panel, .question-card, .answer-card, .option-item, .diagram-box {")
  lines.push("        background-color: #ffffff !important;")
  lines.push("        border-color: #cccccc !important;")
  lines.push("        box-shadow: none !important;")
  lines.push("        color: #000000 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .title {")
  lines.push("        color: #000000 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .correct-badge {")
  lines.push("        background-color: #ffffff !important;")
  lines.push("        color: #000000 !important;")
  lines.push("        border-color: #000000 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .callout-hint {")
  lines.push("        background-color: #fafafa !important;")
  lines.push("        color: #555555 !important;")
  lines.push("        border-left-color: #333333 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .callout-explanation {")
  lines.push("        background-color: #fafafa !important;")
  lines.push("        color: #333333 !important;")
  lines.push("        border-left-color: #000000 !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .action-links {")
  lines.push("        display: none !important;")
  lines.push("      }")
  lines.push("")
  lines.push("      .keep-together {")
  lines.push("        page-break-inside: avoid;")
  lines.push("        break-inside: avoid;")
  lines.push("      }")
  lines.push("")
  lines.push("      .page-break-before {")
  lines.push("        page-break-before: always;")
  lines.push("        break-before: page;")
  lines.push("      }")
  lines.push("    }")
  lines.push("  </style>")
  lines.push("</head>")
  lines.push("<body>")
  lines.push('  <div class="container">')
  
  // Header Panel
  lines.push('    <div class="header-panel">')
  lines.push(`      <h1 class="title"># ${subject.name} Revision Sheet</h1>`)
  if (subject.config.description) {
    lines.push(`      <p class="subtitle">${subject.config.description}</p>`)
  }
  lines.push('      <div class="meta-grid">')
  lines.push(`        <div>• TOTAL QUESTIONS: ${subject.questions.length}</div>`)
  lines.push(`        <div>• CATEGORIES: ${categories.map(c => formatLabel(c)).join(", ")}</div>`)
  lines.push('      </div>')
  lines.push('    </div>')
  
  // Section 1: Questions
  lines.push('    <h2 class="section-title">## Section 1: Questions & Scenarios</h2>')
  
  subject.questions.forEach((q, idx) => {
    lines.push(`    <div id="q-${q.id}" class="question-card keep-together">`)
    lines.push(`      <div class="question-id">QUESTION ${idx + 1} // DIFFICULTY: ${q.difficulty} // CATEGORY: ${formatLabel(q.category)}</div>`)
    lines.push(`      <div class="question-text">${q.question}</div>`)
    
    if (q.diagram) {
      lines.push('      <div class="diagram-box">')
      lines.push(`        <div class="mermaid-render" data-diagram="${escapeHtml(q.diagram.trim())}">`)
      lines.push('          <div class="font-mono text-xs text-zinc-500 animate-pulse">Loading diagram...</div>')
      lines.push('        </div>')
      lines.push('      </div>')
    }
    
    lines.push('      <div class="options-list">')
    q.options.forEach((opt) => {
      lines.push('        <div class="option-item">')
      lines.push('          <div class="option-checkbox">[ ]</div>')
      lines.push(`          <div><strong>${opt.label}.</strong> ${opt.text}</div>`)
      lines.push('        </div>')
    })
    lines.push('      </div>')
    
    lines.push('      <div class="action-links">')
    lines.push(`        <a href="#ans-${q.id}">[Go to Answer Key]</a>`)
    lines.push('      </div>')
    lines.push('    </div>')
  })
  
  // Section 2: Answers
  lines.push('    <div class="page-break-before"></div>')
  lines.push('    <h2 class="section-title">## Section 2: Answer Key & Explanations</h2>')
  
  subject.questions.forEach((q, idx) => {
    lines.push(`    <div id="ans-${q.id}" class="answer-card keep-together">`)
    lines.push(`      <div class="question-id">ANSWER ${idx + 1} // CATEGORY: ${formatLabel(q.category)}</div>`)
    lines.push(`      <div class="correct-badge">CORRECT CHOICE: ${q.answer}</div>`)
    
    if (q.hint) {
      lines.push('      <div class="callout callout-hint">')
      lines.push('        <div class="callout-title">&gt; Socratic Hint</div>')
      lines.push(`        <div>${q.hint}</div>`)
      lines.push('      </div>')
    }
    
    if (q.explanation) {
      lines.push('      <div class="callout callout-explanation">')
      lines.push('        <div class="callout-title">&gt; Metacognitive Explanation</div>')
      lines.push(`        <div>${q.explanation}</div>`)
      lines.push('      </div>')
    }
    
    lines.push('      <div class="action-links">')
    lines.push(`        <a href="#q-${q.id}">[Back to Question]</a>`)
    lines.push('      </div>')
    lines.push('    </div>')
  })
  
  lines.push('  </div>')
  
  // Script definitions for programmatic Mermaid + KaTeX
  lines.push('  <script>')
  lines.push('    window.mathDone = false;')
  lines.push('    window.mermaidDone = false;')
  lines.push('    window.checkComplete = function() {')
  lines.push('      if (window.mermaidDone && window.mathDone) {')
  lines.push('        window.dispatchEvent(new CustomEvent("sheet-render-complete"));')
  lines.push('      }')
  lines.push('    };')
  lines.push('  </script>')
  
  lines.push('  <!-- Mermaid support -->')
  lines.push('  <script type="module">')
  lines.push("    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';")
  lines.push(`    const isPrint = ${isPrint};`)
  lines.push("    mermaid.initialize({")
  lines.push("      startOnLoad: false,")
  lines.push("      theme: isPrint ? 'default' : 'dark',")
  lines.push("      securityLevel: 'strict',")
  lines.push("      flowchart: { useMaxWidth: true, htmlLabels: true }")
  lines.push("    });")
  lines.push("")
  lines.push("    function sanitizeChart(raw) {")
  lines.push("      return raw")
  lines.push("        .replace(/&lt;/g, '<')")
  lines.push("        .replace(/&gt;/g, '>')")
  lines.push("        .replace(/&amp;/g, '&')")
  lines.push("        .replace(/\\\\N/g, '\\n')")
  lines.push("        .replace(/\\\\n/gi, '\\n')")
  lines.push("        .trim();")
  lines.push("    }")
  lines.push("")
  lines.push("    async function renderDiagrams() {")
  lines.push("      const elements = document.querySelectorAll('.mermaid-render');")
  lines.push("      let idCounter = 0;")
  lines.push("      for (const el of elements) {")
  lines.push("        const rawDiagram = el.getAttribute('data-diagram');")
  lines.push("        if (!rawDiagram) continue;")
  lines.push("        const cleanDiagram = sanitizeChart(rawDiagram);")
  lines.push("        const id = 'mermaid-svg-' + (idCounter++);")
  lines.push("        try {")
  lines.push("          await mermaid.parse(cleanDiagram);")
  lines.push("          const { svg } = await mermaid.render(id, cleanDiagram);")
  lines.push("          el.innerHTML = svg;")
  lines.push("        } catch (err) {")
  lines.push("          console.error('Mermaid render error:', err);")
  lines.push("          el.innerHTML = `")
  lines.push("            <div style=\"background-color: #1a0c0c; border: 1px solid #930013; padding: 12px; font-family: monospace; font-size: 12px; color: #ff8080; width: 100%; box-sizing: border-box;\">")
  lines.push("              <div style=\"font-weight: bold; margin-bottom: 4px;\">[Diagram Render Fault]</div>")
  lines.push("              <div style=\"white-space: pre-wrap;\">${err?.message || err || 'Syntax or parsing error'}</div>")
  lines.push("            </div>")
  lines.push("          `;")
  lines.push("        }")
  lines.push("      }")
  lines.push("      window.mermaidDone = true;")
  lines.push("      if (typeof window.checkComplete === 'function') {")
  lines.push("        window.checkComplete();")
  lines.push("      }")
  lines.push("    }")
  lines.push("")
  lines.push("    if (document.readyState === 'loading') {")
  lines.push("      document.addEventListener('DOMContentLoaded', renderDiagrams);")
  lines.push("    } else {")
  lines.push("      renderDiagrams();")
  lines.push("    }")
  lines.push("  </script>")
  
  // KaTeX rendering script
  lines.push('  <script>')
  lines.push('    document.addEventListener("DOMContentLoaded", function() {')
  lines.push('      if (typeof renderMathInElement === "function") {')
  lines.push('        renderMathInElement(document.body, {')
  lines.push('          delimiters: [')
  lines.push('            { left: "$$", right: "$$", display: true },')
  lines.push('            { left: "$", right: "$", display: false },')
  lines.push('            { left: "\\\\(", right: "\\\\)", display: false },')
  lines.push('            { left: "\\\\[", right: "\\\\]", display: true }')
  lines.push('          ],')
  lines.push('          throwOnError: false')
  lines.push('        });')
  lines.push('      }')
  lines.push('      window.mathDone = true;')
  lines.push('      if (typeof window.checkComplete === "function") {')
  lines.push('        window.checkComplete();')
  lines.push('      }')
  lines.push('    });')
  lines.push('  </script>')
  lines.push("</body>")
  lines.push("</html>")
  
  return lines.join("\n")
}

/** Trigger a browser download of the subject as a beautifully styled self-rendering HTML revision sheet. */
export function downloadSubjectHtml(subject: FullSubjectData): void {
  const htmlText = generateSubjectHtml(subject, false)
  const blob = new Blob([htmlText], { type: "text/html;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${subject.id}_revision_sheet.html`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Generate a self-rendering HTML sheet where every question is paired
 * with its hint and explanation directly below it (light mode, print-ready).
 * No separate answer section — the reader never has to scroll to find answers.
 */
export function generateSubjectSolvedHtml(subject: FullSubjectData): string {
  const categories = Array.from(new Set(subject.questions.map((q) => q.category)))

  const lines: string[] = []

  lines.push("<!DOCTYPE html>")
  lines.push('<html lang="en">')
  lines.push("<head>")
  lines.push('  <meta charset="UTF-8">')
  lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
  lines.push(`  <title>${subject.name} — Solved Questions Sheet</title>`)
  lines.push('  <!-- KaTeX CSS & JS -->')
  lines.push('  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">')
  lines.push('  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>')
  lines.push('  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>')
  lines.push('  <!-- Google Fonts -->')
  lines.push('  <link rel="preconnect" href="https://fonts.googleapis.com">')
  lines.push('  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
  lines.push('  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" rel="stylesheet">')

  lines.push("  <style>")
  // Light-mode only tokens
  lines.push("    :root {")
  lines.push("      --background: 0 0% 100%;")
  lines.push("      --foreground: 0 0% 0%;")
  lines.push("      --primary: 43 96% 40%;")
  lines.push("      --panel: 0 0% 98%;")
  lines.push("      --border: 0 0% 85%;")
  lines.push("      --muted: 0 0% 40%;")
  lines.push("      --success: 142 70% 30%;")
  lines.push("      --badge-text: #1e7e34;")
  lines.push("      --hint-text: #856404;")
  lines.push("      --explanation-text: #2b2b2b;")
  lines.push("      --explanation-border: #004499;")
  lines.push("      --explanation-bg: rgba(0, 68, 153, 0.05);")
  lines.push("    }")
  lines.push("")
  lines.push("    body {")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      color: hsl(var(--foreground));")
  lines.push("      font-family: 'Geist', sans-serif;")
  lines.push("      margin: 0;")
  lines.push("      padding: 0;")
  lines.push("      display: flex;")
  lines.push("      justify-content: center;")
  lines.push("    }")
  lines.push("")
  lines.push("    .container {")
  lines.push("      max-width: 800px;")
  lines.push("      width: 100%;")
  lines.push("      padding: 40px 24px;")
  lines.push("      box-sizing: border-box;")
  lines.push("    }")
  lines.push("")
  lines.push("    .font-mono { font-family: 'Geist Mono', monospace; }")
  lines.push("")
  lines.push("    .header-panel {")
  lines.push("      background-color: hsl(var(--panel));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 24px;")
  lines.push("      margin-bottom: 32px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 24px;")
  lines.push("      font-weight: 800;")
  lines.push("      text-transform: uppercase;")
  lines.push("      color: hsl(var(--primary));")
  lines.push("      margin: 0 0 8px 0;")
  lines.push("      letter-spacing: -0.05em;")
  lines.push("    }")
  lines.push("")
  lines.push("    .subtitle {")
  lines.push("      font-size: 14px;")
  lines.push("      color: hsl(var(--foreground));")
  lines.push("      opacity: 0.8;")
  lines.push("      margin: 0 0 16px 0;")
  lines.push("      line-height: 1.5;")
  lines.push("    }")
  lines.push("")
  lines.push("    .meta-grid {")
  lines.push("      display: grid;")
  lines.push("      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));")
  lines.push("      gap: 12px;")
  lines.push("      border-top: 1px dashed hsl(var(--border));")
  lines.push("      padding-top: 16px;")
  lines.push("      font-size: 11px;")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("    }")
  lines.push("")
  lines.push("    .section-title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 18px;")
  lines.push("      font-weight: 700;")
  lines.push("      text-transform: uppercase;")
  lines.push("      letter-spacing: 0.1em;")
  lines.push("      border-bottom: 2px solid hsl(var(--primary));")
  lines.push("      padding-bottom: 8px;")
  lines.push("      margin: 40px 0 24px 0;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-card {")
  lines.push("      background-color: hsl(var(--panel));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 24px;")
  lines.push("      margin-bottom: 24px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-id {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      letter-spacing: 0.2em;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("      text-transform: uppercase;")
  lines.push("      margin-bottom: 12px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .question-text {")
  lines.push("      font-size: 16px;")
  lines.push("      font-weight: 600;")
  lines.push("      line-height: 1.6;")
  lines.push("      margin: 0 0 16px 0;")
  lines.push("    }")
  lines.push("")
  lines.push("    .options-list {")
  lines.push("      display: flex;")
  lines.push("      flex-direction: column;")
  lines.push("      gap: 10px;")
  lines.push("      margin-top: 16px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .option-item {")
  lines.push("      display: flex;")
  lines.push("      align-items: flex-start;")
  lines.push("      gap: 12px;")
  lines.push("      padding: 12px 16px;")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      font-size: 14px;")
  lines.push("    }")
  lines.push("")
  // Correct option highlighted
  lines.push("    .option-item.correct {")
  lines.push("      border-color: hsl(var(--success));")
  lines.push("      background-color: hsl(var(--success) / 0.06);")
  lines.push("    }")
  lines.push("")
  lines.push("    .option-label {")
  lines.push("      width: 18px;")
  lines.push("      height: 18px;")
  lines.push("      border: 1px solid hsl(var(--muted));")
  lines.push("      display: flex;")
  lines.push("      align-items: center;")
  lines.push("      justify-content: center;")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      flex-shrink: 0;")
  lines.push("      margin-top: 2px;")
  lines.push("      color: hsl(var(--muted));")
  lines.push("    }")
  lines.push("")
  lines.push("    .option-label.correct {")
  lines.push("      border-color: hsl(var(--success));")
  lines.push("      color: var(--badge-text);")
  lines.push("      font-weight: bold;")
  lines.push("    }")
  lines.push("")
  lines.push("    .diagram-box {")
  lines.push("      margin: 16px 0;")
  lines.push("      background-color: hsl(var(--background));")
  lines.push("      border: 1px solid hsl(var(--border));")
  lines.push("      padding: 16px;")
  lines.push("      overflow-x: auto;")
  lines.push("      display: flex;")
  lines.push("      justify-content: center;")
  lines.push("      align-items: center;")
  lines.push("      min-height: 100px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .mermaid-render { width: 100%; display: flex; justify-content: center; }")
  lines.push("    .mermaid-render svg { max-width: 100% !important; height: auto !important; }")
  lines.push("")
  // Answer block under each question
  lines.push("    .answer-block {")
  lines.push("      margin-top: 20px;")
  lines.push("      padding-top: 16px;")
  lines.push("      border-top: 1px dashed hsl(var(--border));")
  lines.push("    }")
  lines.push("")
  lines.push("    .correct-badge {")
  lines.push("      display: inline-block;")
  lines.push("      padding: 4px 10px;")
  lines.push("      background-color: hsl(var(--success) / 0.12);")
  lines.push("      border: 1px solid hsl(var(--success));")
  lines.push("      color: var(--badge-text);")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 12px;")
  lines.push("      font-weight: 700;")
  lines.push("      margin-bottom: 12px;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout {")
  lines.push("      border-left: 4px solid;")
  lines.push("      padding: 12px 16px;")
  lines.push("      margin-top: 12px;")
  lines.push("      font-size: 13px;")
  lines.push("      line-height: 1.5;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-hint {")
  lines.push("      border-left-color: hsl(var(--primary));")
  lines.push("      background-color: hsl(var(--primary) / 0.04);")
  lines.push("      color: var(--hint-text);")
  lines.push("      font-style: italic;")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-explanation {")
  lines.push("      border-left-color: var(--explanation-border);")
  lines.push("      background-color: var(--explanation-bg);")
  lines.push("      color: var(--explanation-text);")
  lines.push("    }")
  lines.push("")
  lines.push("    .callout-title {")
  lines.push("      font-family: 'Geist Mono', monospace;")
  lines.push("      font-size: 10px;")
  lines.push("      font-weight: 700;")
  lines.push("      text-transform: uppercase;")
  lines.push("      letter-spacing: 0.1em;")
  lines.push("      margin-bottom: 4px;")
  lines.push("    }")
  lines.push("")
  lines.push("    @media print {")
  lines.push("      .container { max-width: 100%; padding: 0; }")
  lines.push("      .keep-together { page-break-inside: avoid; break-inside: avoid; }")
  lines.push("      .question-card, .option-item, .diagram-box, .callout {")
  lines.push("        box-shadow: none !important;")
  lines.push("      }")
  lines.push("    }")
  lines.push("  </style>")
  lines.push("</head>")
  lines.push("<body>")
  lines.push('  <div class="container">')

  // Header
  lines.push('    <div class="header-panel">')
  lines.push(`      <h1 class="title"># ${subject.name} — Solved Questions</h1>`)
  if (subject.config.description) {
    lines.push(`      <p class="subtitle">${subject.config.description}</p>`)
  }
  lines.push('      <div class="meta-grid">')
  lines.push(`        <div>• TOTAL QUESTIONS: ${subject.questions.length}</div>`)
  lines.push(`        <div>• CATEGORIES: ${categories.map(c => formatLabel(c)).join(", ")}</div>`)
  lines.push(`        <div>• FORMAT: QUESTIONS + ANSWERS INLINE</div>`)
  lines.push('      </div>')
  lines.push('    </div>')

  lines.push('    <h2 class="section-title">## Questions &amp; Answers</h2>')

  subject.questions.forEach((q, idx) => {
    lines.push(`    <div id="q-${q.id}" class="question-card keep-together">`)
    lines.push(`      <div class="question-id">QUESTION ${idx + 1} // DIFFICULTY: ${q.difficulty} // CATEGORY: ${formatLabel(q.category)}</div>`)
    lines.push(`      <div class="question-text">${q.question}</div>`)

    if (q.diagram) {
      lines.push('      <div class="diagram-box">')
      lines.push(`        <div class="mermaid-render" data-diagram="${escapeHtml(q.diagram.trim())}">`)
      lines.push('          <div class="font-mono" style="font-size:11px;color:#999">Loading diagram...</div>')
      lines.push('        </div>')
      lines.push('      </div>')
    }

    lines.push('      <div class="options-list">')
    q.options.forEach((opt) => {
      const isCorrect = opt.label === q.answer
      lines.push(`        <div class="option-item${isCorrect ? ' correct' : ''}">`)
      lines.push(`          <div class="option-label${isCorrect ? ' correct' : ''}">${isCorrect ? '✓' : opt.label}</div>`)
      lines.push(`          <div><strong>${opt.label}.</strong> ${opt.text}</div>`)
      lines.push('        </div>')
    })
    lines.push('      </div>')

    // Inline answer block
    lines.push('      <div class="answer-block">')
    lines.push(`        <div class="correct-badge">CORRECT ANSWER: ${q.answer}</div>`)

    if (q.hint) {
      lines.push('        <div class="callout callout-hint">')
      lines.push('          <div class="callout-title">&gt; Socratic Hint</div>')
      lines.push(`          <div>${q.hint}</div>`)
      lines.push('        </div>')
    }

    if (q.explanation) {
      lines.push('        <div class="callout callout-explanation">')
      lines.push('          <div class="callout-title">&gt; Metacognitive Explanation</div>')
      lines.push(`          <div>${q.explanation}</div>`)
      lines.push('        </div>')
    }

    lines.push('      </div>')
    lines.push('    </div>')
  })

  lines.push('  </div>')

  // Rendering scripts (same as existing sheet)
  lines.push('  <script>')
  lines.push('    window.mathDone = false;')
  lines.push('    window.mermaidDone = false;')
  lines.push('    window.checkComplete = function() {')
  lines.push('      if (window.mermaidDone && window.mathDone) {')
  lines.push('        window.dispatchEvent(new CustomEvent("sheet-render-complete"));')
  lines.push('      }')
  lines.push('    };')
  lines.push('  </script>')

  lines.push('  <!-- Mermaid support -->')
  lines.push('  <script type="module">')
  lines.push("    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';")
  lines.push("    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict', flowchart: { useMaxWidth: true, htmlLabels: true } });")
  lines.push("")
  lines.push("    function sanitizeChart(raw) {")
  lines.push("      return raw")
  lines.push("        .replace(/&lt;/g, '<')")
  lines.push("        .replace(/&gt;/g, '>')")
  lines.push("        .replace(/&amp;/g, '&')")
  lines.push("        .replace(/\\\\N/g, '\\n')")
  lines.push("        .replace(/\\\\n/gi, '\\n')")
  lines.push("        .trim();")
  lines.push("    }")
  lines.push("")
  lines.push("    async function renderDiagrams() {")
  lines.push("      const elements = document.querySelectorAll('.mermaid-render');")
  lines.push("      let idCounter = 0;")
  lines.push("      for (const el of elements) {")
  lines.push("        const rawDiagram = el.getAttribute('data-diagram');")
  lines.push("        if (!rawDiagram) continue;")
  lines.push("        const cleanDiagram = sanitizeChart(rawDiagram);")
  lines.push("        const id = 'mermaid-svg-' + (idCounter++);")
  lines.push("        try {")
  lines.push("          await mermaid.parse(cleanDiagram);")
  lines.push("          const { svg } = await mermaid.render(id, cleanDiagram);")
  lines.push("          el.innerHTML = svg;")
  lines.push("        } catch (err) {")
  lines.push("          console.error('Mermaid render error:', err);")
  lines.push("          el.innerHTML = `<div style=\"background:#fff4f4;border:1px solid #c00;padding:12px;font-family:monospace;font-size:12px;color:#c00\">[Diagram Render Fault] ${err?.message || err}</div>`;")
  lines.push("        }")
  lines.push("      }")
  lines.push("      window.mermaidDone = true;")
  lines.push("      if (typeof window.checkComplete === 'function') window.checkComplete();")
  lines.push("    }")
  lines.push("")
  lines.push("    if (document.readyState === 'loading') {")
  lines.push("      document.addEventListener('DOMContentLoaded', renderDiagrams);")
  lines.push("    } else {")
  lines.push("      renderDiagrams();")
  lines.push("    }")
  lines.push("  </script>")

  // KaTeX
  lines.push('  <script>')
  lines.push('    document.addEventListener("DOMContentLoaded", function() {')
  lines.push('      if (typeof renderMathInElement === "function") {')
  lines.push('        renderMathInElement(document.body, {')
  lines.push('          delimiters: [')
  lines.push('            { left: "$$", right: "$$", display: true },')
  lines.push('            { left: "$", right: "$", display: false },')
  lines.push('            { left: "\\\\(", right: "\\\\)", display: false },')
  lines.push('            { left: "\\\\[", right: "\\\\]", display: true }')
  lines.push('          ],')
  lines.push('          throwOnError: false')
  lines.push('        });')
  lines.push('      }')
  lines.push('      window.mathDone = true;')
  lines.push('      if (typeof window.checkComplete === "function") window.checkComplete();')
  lines.push('    });')
  lines.push('  </script>')
  lines.push("</body>")
  lines.push("</html>")

  return lines.join("\n")
}

/** Trigger a browser print of the solved-questions sheet (questions + hints + explanations inline) via hidden iframe. */
export function downloadSubjectSolvedPdf(subject: FullSubjectData): void {
  const htmlContent = generateSubjectSolvedHtml(subject)

  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "none"
  iframe.style.visibility = "hidden"
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentWindow?.document
  if (!iframeDoc) {
    console.error("Failed to create print iframe document")
    if (iframe.parentNode) document.body.removeChild(iframe)
    return
  }

  iframeDoc.open()
  iframeDoc.write(htmlContent)
  iframeDoc.close()

  let printed = false
  const triggerPrint = () => {
    if (printed) return
    printed = true
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch (err) {
      console.error("Failed to trigger print:", err)
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
      }, 5000)
    }
  }

  iframe.contentWindow?.addEventListener("sheet-render-complete", () => triggerPrint())
  setTimeout(() => triggerPrint(), 10000)
}

/** Trigger a browser print of the subject via a hidden iframe to save as PDF. */
export function downloadSubjectPdf(subject: FullSubjectData): void {
  // Generate light-theme friendly HTML sheet
  const htmlContent = generateSubjectHtml(subject, true)
  
  // Create iframe
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "none"
  iframe.style.visibility = "hidden"
  document.body.appendChild(iframe)
  
  const iframeDoc = iframe.contentWindow?.document
  if (!iframeDoc) {
    console.error("Failed to create print iframe document")
    if (iframe.parentNode) {
      document.body.removeChild(iframe)
    }
    return
  }
  
  // Write content
  iframeDoc.open()
  iframeDoc.write(htmlContent)
  iframeDoc.close()
  
  let printed = false
  const triggerPrint = () => {
    if (printed) return
    printed = true
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch (err) {
      console.error("Failed to trigger print:", err)
    } finally {
      // Keep iframe in DOM for a little bit to ensure print dialog renders properly
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe)
        }
      }, 5000)
    }
  }
  
  // Wait for the render-complete event
  iframe.contentWindow?.addEventListener("sheet-render-complete", () => {
    triggerPrint()
  })
  
  // Fallback timeout in case of script load issues
  setTimeout(() => {
    triggerPrint()
  }, 10000)
}

// ─── Internal Base64url ───────────────────────────────────────────────────────
// Uses Base64url (RFC 4648 §5) to avoid + / = characters in URLs.

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunks: string[] = []
  const chunkSize = 8192
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    chunks.push(String.fromCharCode.apply(null, chunk as unknown as number[]))
  }
  const binary = chunks.join("")
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
  // Restore standard Base64 padding
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")

  const binary = atob(base64)

  // Fast path for Node.js environment
  if (typeof Buffer !== "undefined") {
    const b = Buffer.from(binary, "binary")
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
  }

  // Fallback for browsers
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
