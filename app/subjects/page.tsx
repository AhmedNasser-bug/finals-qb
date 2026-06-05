"use client"

import { useState, useEffect } from "react"
import { SubjectSelector } from "@/components/mold/subject/subject-selector"
import { ShareReceiver } from "@/components/mold/subject/share-receiver"
import {
  loadSubjects,
  saveSubjects,
  addSubject,
  removeSubject,
} from "@/lib/subject-persistence"
import { detectShareHash } from "@/lib/subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"

type SubjectsView = "loading" | "receiving" | "selecting"

export default function SubjectsPage() {
  const [view, setView] = useState<SubjectsView>("loading")
  const [subjects, setSubjects] = useState<FullSubjectData[]>([])
  const [sharePayload, setSharePayload] = useState<string | null>(null)

  // ── Hydrate from localStorage; detect share hash ─────────────────────────
  useEffect(() => {
    const stored = loadSubjects()
    setSubjects(stored)

    const payload = detectShareHash()
    if (payload) {
      setSharePayload(payload)
      setView("receiving")
      return
    }

    setView("selecting")
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSubjectSelected(subject: FullSubjectData) {
    // Use URL param so the session is bookmarkable/shareable
    window.location.href = `/?subject=${encodeURIComponent(subject.id)}`
  }


  function handleSubjectAdded(incoming: FullSubjectData) {
    const updated = addSubject(subjects, incoming)
    saveSubjects(updated)
    setSubjects(updated)
    // Navigate via URL param (subject is now persisted in localStorage)
    window.location.href = `/?subject=${encodeURIComponent(incoming.id)}`
  }


  function handleSubjectRemoved(id: string) {
    const updated = removeSubject(subjects, id)
    saveSubjects(updated)
    setSubjects(updated)
  }

  function handleShareAccepted(incoming: FullSubjectData) {
    setSharePayload(null)
    handleSubjectAdded(incoming)
  }

  function handleShareDeclined() {
    setSharePayload(null)
    setView("selecting")
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-xs font-mono text-muted-foreground tracking-widest animate-pulse">
          INITIALISING...
        </span>
      </div>
    )
  }

  if (view === "receiving" && sharePayload) {
    return (
      <ShareReceiver
        payload={sharePayload}
        onAccept={handleShareAccepted}
        onDecline={handleShareDeclined}
      />
    )
  }

  return (
    <SubjectSelector
      subjects={subjects}
      onSelect={handleSubjectSelected}
      onAddSubject={handleSubjectAdded}
      onRemoveSubject={handleSubjectRemoved}
    />
  )
}
