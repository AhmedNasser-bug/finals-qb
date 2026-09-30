const fs = require('fs');

let content = fs.readFileSync('lib/navigation/guide-url.ts', 'utf-8');

const target = `function inferNameFromRelativeUrl(url: string): string | undefined {
  if (url === "/subjects" || url.startsWith("/subjects?")) return "Subjects Library"
  if (url === "/" || url.startsWith("/?")) {
    const qIndex = url.indexOf("?")
    if (qIndex !== -1) {
      try {
        const sp = new URLSearchParams(url.slice(qIndex + 1))
        const sub = sp.get("subject")
        if (sub) {
          return sub
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        }
      } catch {
        // safe fallback
      }
    }
    return "Study Console"
  }
  return undefined
}`;

const replacement = `function inferNameFromRelativeUrl(url: string): string | undefined {
  if (url === "/subjects" || url.startsWith("/subjects?")) return "Subjects Library"
  if (url === "/" || url.startsWith("/?")) {
    const qIndex = url.indexOf("?")
    if (qIndex === -1) return "Study Console"

    try {
      const sp = new URLSearchParams(url.slice(qIndex + 1))
      const sub = sp.get("subject")
      if (!sub) return "Study Console"

      return sub
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    } catch {
      return "Study Console"
    }
  }
  return undefined
}`;

if (content.includes(target)) {
  fs.writeFileSync('lib/navigation/guide-url.ts', content.replace(target, replacement));
  console.log('guide-url.ts patched successfully');
} else {
  console.log('guide-url.ts target not found');
}
