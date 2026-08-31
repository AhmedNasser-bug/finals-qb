/**
 * @mold/game - Recallability & Bloom's Taxonomy Engine
 *
 * Implements Bloom's Taxonomy cognitive progression sorting for Full Revision,
 * category recallability evaluation, and recallability-weighted question pool sampling.
 */

import type { Question, CategoryData } from "@/lib/types/mold-types"
import { loadRetentionMap, calculateRetrievability } from "@/lib/telemetry/retention-kernel"

// ─── Bloom's Taxonomy Hierarchy ───────────────────────────────────────────────

export const BLOOMS_TAXONOMY_WEIGHTS: Record<string, number> = {
  // Level 1: Remember / Recall / Knowledge
  remember: 1,
  recall: 1,
  knowledge: 1,
  // Level 2: Understand / Comprehension
  understand: 2,
  comprehend: 2,
  comprehension: 2,
  // Level 3: Apply / Application
  apply: 3,
  application: 3,
  // Level 4: Analyze / Analysis
  analyze: 4,
  analysis: 4,
  // Level 5: Evaluate / Evaluation
  evaluate: 5,
  evaluation: 5,
  // Level 6: Create / Synthesis
  create: 6,
  synthesis: 6,

  // Question difficulty fallbacks
  easy: 1,
  medium: 3,
  hard: 5,
}

/**
 * Returns a numerical weight representing the question's cognitive difficulty.
 * Lower numbers = foundational/recall; Higher numbers = complex analysis/evaluation.
 */
export function getBloomsWeight(q: Question): number {
  if ((q as any).bloomsLevel && typeof (q as any).bloomsLevel === "number") {
    return (q as any).bloomsLevel
  }
  const taxonomy =
    (q as any).bloomsTaxonomy || (q as any).taxonomy || (q as any).blooms
  if (taxonomy && typeof taxonomy === "string") {
    const key = taxonomy.trim().toLowerCase()
    if (BLOOMS_TAXONOMY_WEIGHTS[key] !== undefined) {
      return BLOOMS_TAXONOMY_WEIGHTS[key]
    }
  }
  if (q.difficulty) {
    const key = q.difficulty.trim().toLowerCase()
    if (BLOOMS_TAXONOMY_WEIGHTS[key] !== undefined) {
      return BLOOMS_TAXONOMY_WEIGHTS[key]
    }
  }
  return 3 // Default to Medium / Apply
}

/**
 * Sorts questions for Full Revision:
 * 1. Preserves the original order of categories as they appear in the question bank.
 * 2. Sorts questions within each category ascending by Bloom's Taxonomy difficulty.
 */
export function sortFullRevisionQuestions(allQuestions: Question[]): Question[] {
  if (!allQuestions || allQuestions.length <= 1) {
    return allQuestions ? [...allQuestions] : []
  }

  // 1. Group questions by category preserving first occurrence order
  const categoryOrder: string[] = []
  const categoryMap = new Map<string, Question[]>()

  for (const q of allQuestions) {
    const cat = q.category || "_general"
    if (!categoryMap.has(cat)) {
      categoryOrder.push(cat)
      categoryMap.set(cat, [])
    }
    categoryMap.get(cat)!.push(q)
  }

  // 2. Stable sort questions within each category by Bloom's taxonomy difficulty
  const sorted: Question[] = []
  for (const cat of categoryOrder) {
    const questionsInCat = categoryMap.get(cat)!
    const sortedInCat = [...questionsInCat].sort((a, b) => {
      const weightA = getBloomsWeight(a)
      const weightB = getBloomsWeight(b)
      return weightA - weightB
    })
    sorted.push(...sortedInCat)
  }

  return sorted
}

// ─── Category Recallability Calculation ───────────────────────────────────────

export interface RecallabilityStyle {
  textColor: string
  borderColor: string
  bgColor: string
  badgeColor: string
  glowColor: string
  tier: "mastered" | "good" | "developing" | "critical"
  label: string
}

export function createInitialQuestionRetentionState(
  q: Question,
  subjectId: string
) {
  return {
    cardId: q.id,
    subjectId,
    category: q.category || "_general",
    term: q.question,
    definition: q.answer,
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    stability: 1.0,
    difficulty: q.difficulty === "Hard" ? 0.7 : q.difficulty === "Easy" ? 0.2 : 0.4,
    lapses: 0,
    lastReviewedAt: null,
    nextDueDate: null,
    currentRetrievability: 0,
    urgencyLevel: "NEW" as const,
  }
}

/**
 * Maps a recallability percentage (0..100) to a visual color scheme (Green -> Yellow -> Red).
 */
export function getRecallabilityColor(pct: number): RecallabilityStyle {
  if (pct === 0) {
    return {
      textColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-500/40 hover:border-red-500",
      bgColor: "bg-red-500/5",
      badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
      glowColor: "shadow-[0_0_12px_rgba(239,68,68,0.15)]",
      tier: "critical",
      label: "NEW / 0%",
    }
  }
  if (pct >= 80) {
    return {
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-500/40 hover:border-emerald-500",
      bgColor: "bg-emerald-500/5",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      glowColor: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      tier: "mastered",
      label: "MASTERED",
    }
  }
  if (pct >= 65) {
    return {
      textColor: "text-lime-600 dark:text-lime-400",
      borderColor: "border-lime-500/40 hover:border-lime-500",
      bgColor: "bg-lime-500/5",
      badgeColor: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/30",
      glowColor: "shadow-[0_0_12px_rgba(132,204,22,0.15)]",
      tier: "good",
      label: "SOLID",
    }
  }
  if (pct >= 50) {
    return {
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-500/40 hover:border-amber-500",
      bgColor: "bg-amber-500/5",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      glowColor: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      tier: "developing",
      label: "DEVELOPING",
    }
  }
  return {
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-500/40 hover:border-red-500",
    bgColor: "bg-red-500/5",
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    glowColor: "shadow-[0_0_12px_rgba(239,68,68,0.15)]",
    tier: "critical",
    label: "NEEDS DRILL",
  }
}

/**
 * Computes category recallability percentages for a subject.
 * Integrates SM-2 retention telemetry R(t) = e^(-t/S) per question.
 */
export function computeCategoryRecallabilities(
  questions: Question[],
  subjectId: string,
  categories?: CategoryData[]
): Record<string, number> {
  const retentionMap = loadRetentionMap(subjectId)
  const catStats: Record<string, { total: number; reviewed: number; sumR: number }> = {}

  // Initialize known categories
  if (categories) {
    for (const c of categories) {
      catStats[c.id] = { total: 0, reviewed: 0, sumR: 0 }
    }
  }

  // Calculate sum of retrievability for each category
  for (const q of questions) {
    const cat = q.category || "_general"
    if (!catStats[cat]) {
      catStats[cat] = { total: 0, reviewed: 0, sumR: 0 }
    }
    catStats[cat].total += 1

    const itemState = retentionMap[q.id]
    if (itemState && itemState.lastReviewedAt && itemState.repetitions > 0) {
      catStats[cat].reviewed += 1
      const daysElapsed =
        (Date.now() - new Date(itemState.lastReviewedAt).getTime()) /
        (1000 * 60 * 60 * 24)
      catStats[cat].sumR += calculateRetrievability(
        itemState.stability,
        daysElapsed
      )
    }
  }

  const result: Record<string, number> = {}
  for (const [cat, val] of Object.entries(catStats)) {
    if (val.total === 0 || val.reviewed === 0) {
      result[cat] = 0 // 0% unreviewed
    } else {
      result[cat] = Math.round((val.sumR / val.total) * 100)
    }
  }

  return result
}

// ─── Recallability-Weighted Question Pool Sampling ───────────────────────────

/**
 * Randomizes questions with category weighting based on recallability:
 * Categories with lower recallability (struggling / forgotten) receive higher probability.
 *
 * Weight per category: w = max(10, 105 - recallabilityPct)
 */
export function weightedQuestionPool(
  allQuestions: Question[],
  recallabilityMap: Record<string, number>,
  count: number
): Question[] {
  if (!allQuestions || allQuestions.length === 0) return []

  const pool = [...allQuestions]
  if (pool.length <= 1) return pool

  // Compute question keys using Efraimidis-Spirakis weighted sampling: key = U^(1 / weight)
  const weighted = pool.map((q) => {
    const cat = q.category || "_general"
    const recall = recallabilityMap[cat] ?? 50
    // Lower recallability (e.g. 20%) -> weight 85. High recallability (e.g. 95%) -> weight 10.
    const weight = Math.max(10, 105 - recall)
    const randomU = Math.random()
    // Avoid Math.pow(0, ...) edge
    const u = randomU === 0 ? 0.00001 : randomU
    const score = Math.pow(u, 1 / weight)
    return { question: q, score }
  })

  // Sort descending by score (highest key selected first)
  weighted.sort((a, b) => b.score - a.score)

  const selected = weighted.map((w) => w.question)
  if (count > 0 && count < selected.length) {
    return selected.slice(0, count)
  }
  return selected
}
