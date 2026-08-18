"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface GuideOverlayProps {
  open: boolean
  onClose: () => void
}

/**
 * Legacy GuideOverlay wrapper.
 * The User Guide has transitioned into a dedicated full page at `/guide`.
 * When triggered via legacy code, this immediately navigates to `/guide`.
 */
export function GuideOverlay({ open, onClose }: GuideOverlayProps) {
  const router = useRouter()

  useEffect(() => {
    if (open) {
      onClose()
      router.push("/guide")
    }
  }, [open, onClose, router])

  return null
}
