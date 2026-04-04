"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SubjectSelector } from "@/components/mold/subject-selector"
import { ShareReceiver } from "@/components/mold/share-receiver"
import {
  loadSubjects,
  saveSubjects,
  addSubject,
  removeSubject,
} from "@/lib/subject-persistence"
import { detectShareHash } from "@/lib/subject-sharing"
import { setActiveSubject } from "@/lib/active-subject-store"
import type { FullSubjectData } from "@/lib/mold-types"

type SubjectsView = "loading" | "receiving" | "selecting"

export default function SubjectsPage() {
  const router = useRouter()

  const [view, setView]               = useState<SubjectsView>("loading")
  const [subjects, setSubjects]       = useState<FullSubjectData[]>([])
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
    setActiveSubject(subject)
    router.push("/")
  }

  function handleSubjectAdded(incoming: FullSubjectData) {
    const updated = addSubject(subjects, incoming)
    saveSubjects(updated)
    setSubjects(updated)
    // Immediately start studying the newly imported subject
    setActiveSubject(incoming)
    router.push("/")
  }

  function handleSubjectRemoved(id: string) {
    const updated = removeSubject(subjects, id)
    saveSubjects(updated)
    setSubjects(updated)
  }

  /** Called when user selects an example subject — ephemeral, not saved to localStorage */
  function handleExampleSelected(subject: FullSubjectData) {
    setActiveSubject(subject)
    router.push("/")
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
      onSelectExample={handleExampleSelected}
    />
  )
}
