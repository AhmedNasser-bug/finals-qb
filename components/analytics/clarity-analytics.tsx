"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"
import { attachFrictionDetector } from "@/lib/analytics/clarity-bridge"

interface MicrosoftClarityProps {
  projectId?: string
}

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  const clarityId = projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "yvia03evn3"

  useEffect(() => {
    if (typeof window !== "undefined" && clarityId) {
      try {
        Clarity.init(clarityId)
      } catch {
        // Safe fallback in restricted or non-browser environments
      }
    }

    // Attach passive friction listeners (rage click & dead click detection)
    const cleanup = attachFrictionDetector()
    return () => {
      cleanup()
    }
  }, [clarityId])

  return null
}
