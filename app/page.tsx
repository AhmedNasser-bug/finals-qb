"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HomeScreen } from "@/components/mold/home/home-screen"
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
 * Resolution order (first match wins):
 *   1. URL param `?subject=<id>`  → look up by ID from localStorage
 *   2. sessionStorage              → legacy / in-game change-subject path
 *   3. Neither found              → redirect to /subjects
 *
 * Using URL params makes active sessions bookmarkable and deep-linkable.
 */
function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSubject, setActiveSubjectState] = useState<FullSubjectData | null>(null)
  const [subjects, setSubjects] = useState<FullSubjectData[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Forward share hash links from root to /subjects
    if (typeof window !== "undefined" && window.location.hash.startsWith("#share=")) {
      router.replace(`/subjects${window.location.hash}`)
      return
    }

    const allSubjects = loadSubjects()
    setSubjects(allSubjects)

    // 1. URL param ?subject=<id> — bookmarkable / deep-link path
    const subjectId = searchParams.get("subject")
    if (subjectId) {
      const found = allSubjects.find((s) => s.id === decodeURIComponent(subjectId))
      if (found) {
        setActiveSubjectState(found)
        setReady(true)
        return
      }
      // Unknown ID — fall through to sessionStorage check or redirect
    }

    // 2. sessionStorage — legacy path (in-game subject changes, etc.)
    const sessionSubject = getActiveSubject()
    if (sessionSubject) {
      clearActiveSubject()
      setActiveSubjectState(sessionSubject)
      setReady(true)
      return
    }

    // 3. Nothing found — send to subject picker
    router.replace("/subjects")
  }, [router, searchParams])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSubjectAdded(incoming: FullSubjectData) {
    const updated = addSubject(subjects, incoming)
    saveSubjects(updated)
    setSubjects(updated)
    setActiveSubjectState(incoming)
    // Reflect the new subject in the URL
    router.replace(`/?subject=${encodeURIComponent(incoming.id)}`)
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground tracking-widest animate-pulse">
            INITIALISING...
          </span>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
