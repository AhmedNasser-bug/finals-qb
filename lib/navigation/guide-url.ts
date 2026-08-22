/**
 * Universal Guide URL Builder & Parser
 * Decouples the guide page from specific subjects or page topologies.
 * Any page or external source can link to /guide with query parameters:
 * - `from`: relative path to return to (e.g. `/?subject=xyz`, `/subjects`)
 * - `from_name` / `name` / `title`: human-readable name of originating context
 * - `utm_source`: originating context / source
 * - `utm_medium`: navigation medium
 * - `subject`: subject identifier fallback
 */

export interface GuideUrlOptions {
  fromUrl?: string
  fromName?: string
  subjectId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export function buildGuideUrl(options?: GuideUrlOptions): string {
  if (!options) return "/guide"
  const params = new URLSearchParams()

  if (options.fromUrl) {
    params.set("from", options.fromUrl)
  } else if (options.subjectId) {
    params.set("from", `/?subject=${encodeURIComponent(options.subjectId)}`)
  }

  if (options.fromName) {
    params.set("from_name", options.fromName)
  }

  if (options.subjectId) {
    params.set("subject", options.subjectId)
  }

  if (options.utmSource) {
    params.set("utm_source", options.utmSource)
  }

  if (options.utmMedium) {
    params.set("utm_medium", options.utmMedium)
  }

  if (options.utmCampaign) {
    params.set("utm_campaign", options.utmCampaign)
  }

  const qs = params.toString()
  return qs ? `/guide?${qs}` : "/guide"
}

export interface GuideReturnNavigation {
  href: string
  label: string
  sourceName?: string
  utmSource?: string
  utmCampaign?: string
}

function inferNameFromRelativeUrl(url: string): string | undefined {
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
}

/**
 * Safely parses search parameters on /guide to determine the originating context.
 * Strictly sanitizes URLs to prevent Open Redirect (CWE-601) vulnerabilities.
 */
export function resolveGuideReturnNavigation(searchParams: {
  get: (key: string) => string | null
}): GuideReturnNavigation {
  const from =
    searchParams.get("from") ||
    searchParams.get("return_to") ||
    searchParams.get("returnUrl") ||
    searchParams.get("back")

  let fromName =
    searchParams.get("from_name") ||
    searchParams.get("name") ||
    searchParams.get("title") ||
    searchParams.get("utm_campaign")

  const subjectId = searchParams.get("subject")
  const utmSource = searchParams.get("utm_source") || undefined
  const utmCampaign = searchParams.get("utm_campaign") || undefined

  // Sanitize fromUrl: must be relative path starting with / and not protocol-relative (//)
  let safeFromUrl: string | null = null
  if (from && from.startsWith("/") && !from.startsWith("//") && !from.includes("://") && !from.includes("\\")) {
    safeFromUrl = from
  }

  if (safeFromUrl) {
    if (!fromName) {
      fromName = inferNameFromRelativeUrl(safeFromUrl) || null
    }
    return {
      href: safeFromUrl,
      label: fromName ? `RETURN TO ${fromName.toUpperCase()}` : "RETURN TO PREVIOUS PAGE",
      sourceName: fromName || undefined,
      utmSource,
      utmCampaign,
    }
  }

  if (subjectId) {
    const inferred = inferNameFromRelativeUrl(`/?subject=${subjectId}`)
    const resolvedName = fromName || inferred || subjectId
    return {
      href: `/?subject=${encodeURIComponent(subjectId)}`,
      label: `RETURN TO ${resolvedName.toUpperCase()}`,
      sourceName: resolvedName,
      utmSource,
      utmCampaign,
    }
  }

  return {
    href: "/subjects",
    label: "RETURN TO SUBJECTS",
    sourceName: undefined,
    utmSource,
    utmCampaign,
  }
}
