"use client"

import { useState, useEffect, useCallback } from "react"
import type { Achievement } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface ToastItem {
  id: string
  achievement: Achievement
}

const TOAST_DURATION_MS = 4500

export function useAchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showUnlocks = useCallback((unlocked: Achievement[]) => {
    if (unlocked.length === 0) return
    const items = unlocked.map((a) => ({
      id: `${a.id}-${Date.now()}`,
      achievement: a,
    }))
    setToasts((prev) => [...prev, ...items])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showUnlocks, dismiss }
}

interface AchievementToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function AchievementToastContainer({ toasts, onDismiss }: AchievementToastContainerProps) {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end"
      role="region"
      aria-label="Achievement notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <AchievementToastItem key={t.id} item={t} onDismiss={onDismiss} duration={TOAST_DURATION_MS} />
      ))}
    </div>
  )
}

function AchievementToastItem({
  item,
  onDismiss,
  duration,
}: {
  item: ToastItem
  onDismiss: (id: string) => void
  duration: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10)
    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(item.id), 300)
    }, duration)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [item.id, duration, onDismiss])

  function handleDismiss() {
    setVisible(false)
    setTimeout(() => onDismiss(item.id), 300)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded border max-w-xs w-full",
        "bg-panel border-primary/40 shadow-lg",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      role="alert"
    >
      <div className="shrink-0 w-8 h-8 rounded border border-primary/30 bg-primary/10 flex items-center justify-center">
        <TrophyIcon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-[10px] font-mono text-primary tracking-wider uppercase">Achievement Unlocked</p>
        <p className="text-sm font-semibold text-foreground truncate">{item.achievement.title}</p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-1">{item.achievement.description}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss notification"
      >
        <XSmallIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function XSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
