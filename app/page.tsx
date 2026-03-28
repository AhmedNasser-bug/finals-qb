"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "@/components/mold/onboarding-screen"
import { SubjectSelector } from "@/components/mold/subject-selector"
import { HomeScreen } from "@/components/mold/home-screen"
import { ShareReceiver } from "@/components/mold/share-receiver"
import {
  loadSubjects,
  saveSubjects,
  addSubject,
  removeSubject,
} from "@/lib/subject-persistence"
import { detectShareHash } from "@/lib/subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"

/**
 * Root view-state machine:
 *
 *  "loading"   — hydrating subjects from localStorage (prevents flash)
 *  "receiving" — URL hash contains a #share= payload; show ShareReceiver
 *  "onboarding"— no subjects exist yet; show welcome + mode guide
 *  "selecting" — subjects exist but no active one chosen
 *  "studying"  — a subject is active; show the full HomeScreen
 */
type RootView = "loading" | "receiving" | "onboarding" | "selecting" | "studying"

export default function Home() {
  const [rootView, setRootView]           = useState<RootView>("loading")
  const [subjects, setSubjects]           = useState<FullSubjectData[]>([])
  const [activeSubject, setActiveSubject] = useState<FullSubjectData | null>(null)
  const [sharePayload, setSharePayload]   = useState<string | null>(null)

  // ── Hydrate from localStorage; detect share hash ────────────────────────
  useEffect(() => {
    const stored = loadSubjects()
    setSubjects(stored)

    const payload = detectShareHash()
    if (payload) {
      setSharePayload(payload)
      setRootView("receiving")
      return
    }

    setRootView(stored.length === 0 ? "onboarding" : "selecting")
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleSubjectAdded(incoming: FullSubjectData) {
    const updated = addSubject(subjects, incoming)
    saveSubjects(updated)
    setSubjects(updated)
    setActiveSubject(incoming)
    setRootView("studying")
  }

  function handleSubjectSelected(subject: FullSubjectData) {
    setActiveSubject(subject)
    setRootView("studying")
  }

  function handleSubjectRemoved(id: string) {
    const updated = removeSubject(subjects, id)
    saveSubjects(updated)
    setSubjects(updated)
    if (activeSubject?.id === id) {
      setActiveSubject(null)
    }
    setRootView(updated.length === 0 ? "onboarding" : "selecting")
  }

  function handleChangeSubject() {
    setActiveSubject(null)
    setRootView(subjects.length > 0 ? "selecting" : "onboarding")
  }

  function handleShareAccepted(incoming: FullSubjectData) {
    setSharePayload(null)
    handleSubjectAdded(incoming)
  }

  function handleShareDeclined() {
    setSharePayload(null)
    const stored = loadSubjects()
    setRootView(stored.length === 0 ? "onboarding" : "selecting")
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (rootView === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-xs font-mono text-muted-foreground tracking-widest animate-pulse">
          INITIALISING...
        </span>
      </div>
    )
  }

  if (rootView === "receiving" && sharePayload) {
    return (
      <ShareReceiver
        payload={sharePayload}
        onAccept={handleShareAccepted}
        onDecline={handleShareDeclined}
      />
    )
  }

  if (rootView === "onboarding") {
    return <OnboardingScreen onSubjectAdded={handleSubjectAdded} />
  }

  if (rootView === "selecting") {
    return (
      <SubjectSelector
        subjects={subjects}
        onSelect={handleSubjectSelected}
        onAddSubject={handleSubjectAdded}
        onRemoveSubject={handleSubjectRemoved}
      />
    )
  }

  if (!activeSubject) return null

  return (
    <HomeScreen
      activeSubject={activeSubject}
      allSubjectIds={subjects.map((s) => s.id)}
      onAddSubject={handleSubjectAdded}
      onChangeSubject={handleChangeSubject}
    />
  )
}
