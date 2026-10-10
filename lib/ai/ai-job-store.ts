import type { FullSubjectData, Question, Flashcard, Terminology } from "@/lib/mold-types"
import type { AiJobStatusResponse, AiJobStatus } from "@/lib/revenuecat/revenuecat-types"

// Global in-memory storage for AI generation jobs
declare global {
  // eslint-disable-next-line no-var
  var __aiJobsMap: Map<string, AiJobStatusResponse> | undefined
}

if (!global.__aiJobsMap) {
  global.__aiJobsMap = new Map<string, AiJobStatusResponse>()
}

const jobsMap = global.__aiJobsMap

export function createAiJob(
  topic: string,
  level: string = "undergraduate",
  categoryCount: number = 3,
  questionsPerCategory: number = 2
): string {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const initialJob: AiJobStatusResponse = {
    jobId,
    status: "processing",
    progress: 10,
  }

  jobsMap.set(jobId, initialJob)

  // Asynchronously complete synthesis
  setTimeout(() => {
    try {
      const generatedSubject = synthesizeSubject(topic, level, categoryCount, questionsPerCategory)
      jobsMap.set(jobId, {
        jobId,
        status: "completed",
        progress: 100,
        subjectData: generatedSubject,
      })
    } catch (err: unknown) {
      jobsMap.set(jobId, {
        jobId,
        status: "failed",
        progress: 0,
        error: (err as Error).message || "Generation synthesis failed.",
      })
    }
  }, 100)

  return jobId
}

export function getAiJob(jobId: string): AiJobStatusResponse | null {
  return jobsMap.get(jobId) || null
}

export function setAiJob(jobId: string, status: AiJobStatusResponse): void {
  jobsMap.set(jobId, status)
}

/**
 * Generate a complete, valid FullSubjectData object for the given topic.
 */
export function synthesizeSubject(
  topic: string,
  level: string = "undergraduate",
  categoryCount: number = 3,
  questionsPerCategory: number = 2
): FullSubjectData {
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "custom-subject"
  const categories = [
    `${slug}-foundations`,
    `${slug}-core-principles`,
    `${slug}-advanced-applications`,
  ].slice(0, Math.max(1, categoryCount))

  const questions: Question[] = []
  let qIndex = 1

  for (const cat of categories) {
    const catLabel = cat.replace(/-/g, " ").toUpperCase()
    for (let i = 0; i < questionsPerCategory; i++) {
      questions.push({
        id: `${cat}-q${i + 1}`,
        type: i % 2 === 0 ? "MCQ" : "TrueFalse",
        difficulty: i === 0 ? "Easy" : "Medium",
        category: cat,
        question: `In ${topic} (${catLabel}), which of the following statements is mathematically sound?`,
        options:
          i % 2 === 0
            ? [
                { label: "A", text: `The primary invariant holds true under standard boundary conditions.` },
                { label: "B", text: `The state transitions diverge logarithmically without convergence.` },
                { label: "C", text: `The asymptotic complexity becomes unbounded in finite spaces.` },
                { label: "D", text: `The transformation is strictly non-deterministic across all states.` },
              ]
            : [
                { label: "A", text: "True" },
                { label: "B", text: "False" },
              ],
        answer: "A",
        explanation: `Under standard analytical formulations in ${topic}, statement A accurately reflects the underlying theorem.`,
        hint: `Consider how the invariant behaves at the limit of the state domain.`,
      })
      qIndex++
    }
  }

  const flashcards: Flashcard[] = categories.map((cat, idx) => ({
    id: `fc-${cat}`,
    category: cat,
    front: `What is the core postulate of ${topic} regarding ${cat.replace(/-/g, " ")}?`,
    back: `It formalizes the canonical properties and verification criteria ensuring optimal convergence.`,
  }))

  const terminology: Terminology = {}
  categories.forEach((cat) => {
    terminology[cat] = [
      {
        term: `${topic} Paradigm`,
        definition: `A comprehensive conceptual model governing all operational transformations in ${cat.replace(/-/g, " ")}.`,
      },
    ]
  })

  return {
    id: `ai-${slug}`,
    name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} (AI Synthesized)`,
    config: {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
      description: `AI-synthesized examination protocol generated for ${level} level.`,
      themeColor: "amber",
      version: "1.0.0",
      storageKey: `mold_ai_${slug}`,
    },
    questions,
    flashcards,
    terminology,
    achievements: [
      {
        id: `mastery_${slug}`,
        title: `${topic} Master`,
        description: `Achieve 90%+ score on ${topic} revision.`,
        icon: "trophy",
        condition: { type: "accuracy_gte", value: 90 },
      },
    ],
  }
}
