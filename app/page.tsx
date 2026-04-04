"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HomeScreen } from "@/components/mold/home-screen"
import { getActiveSubject, clearActiveSubject } from "@/lib/active-subject-store"
import {
  loadSubjects,
  saveSubjects,
  addSubject,
} from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"

/**
 * Root page — responsible only for the active study session.
 *
 * On mount:
 *   - Read the active subject from sessionStorage (set by /subjects)
 *   - If found → render HomeScreen
 *   - If not found → redirect to /subjects
 *
 * Share hash links pointing to "/" still work because the redirect carries
 * the full URL (including the hash) through to /subjects.
 */
export default function Home() {
  const router = useRouter()
  const [activeSubject, setActiveSubjectState] = useState<FullSubjectData | null>(null)
  const [subjects, setSubjects] = useState<FullSubjectData[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Forward share hash links from root to /subjects
    if (typeof window !== "undefined" && window.location.hash.startsWith("#share=")) {
      router.replace(`/subjects${window.location.hash}`)
      return
    }

    const subject = getActiveSubject()
    if (!subject) {
      router.replace("/subjects")
      return
    }

    clearActiveSubject()
    setActiveSubjectState(subject)
    setSubjects(loadSubjects())
    setReady(true)
  }, [router])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSubjectAdded(incoming: FullSubjectData) {
    const updated = addSubject(subjects, incoming)
    saveSubjects(updated)
    setSubjects(updated)
    setActiveSubjectState(incoming)
  }

  function handleChangeSubject() {
    setActiveSubjectState(null)
    router.push("/subjects")
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!ready || !activeSubject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-xs font-mono text-muted-foreground tracking-widest animate-pulse">
          INITIALISING...
        </span>
      </div>
    )
  }

  return (
    <HomeScreen
      activeSubject={activeSubject}
      allSubjectIds={subjects.map((s) => s.id)}
      onAddSubject={handleSubjectAdded}
      onChangeSubject={handleChangeSubject}
    />
  )
}
