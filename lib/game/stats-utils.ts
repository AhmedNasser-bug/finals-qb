import type { RunRecord } from "../types/mold-types"

export interface DailyMission {
  id: string
  title: string
  description: string
  target: number
  current: number
  completed: boolean
}

export interface Milestone {
  id: string
  title: string
  description: string
  target: number
  current: number
  completed: boolean
}

export function evaluateDailyMissions(runs: RunRecord[], referenceDate: Date = new Date()): DailyMission[] {
  const todayStr = referenceDate.toISOString().split("T")[0]
  let runsCount = 0
  let questionsAnswered = 0
  let hasHighAccuracy = false

  for (let i = 0; i < runs.length; i++) {
    const r = runs[i]
    try {
      if (new Date(r.date).toISOString().split("T")[0] === todayStr) {
        runsCount++
        questionsAnswered += r.totalQuestions
        if (r.score >= 85) hasHighAccuracy = true
      }
    } catch {
      continue
    }
  }

  return [
    {
      id: "mission_daily_session",
      title: "Revisionist",
      description: "Complete 1 study run in any mode today.",
      target: 1,
      current: runsCount > 0 ? 1 : 0,
      completed: runsCount >= 1,
    },
    {
      id: "mission_daily_volume",
      title: "Rampage",
      description: "Answer 15 questions across sessions today.",
      target: 15,
      current: Math.min(questionsAnswered, 15),
      completed: questionsAnswered >= 15,
    },
    {
      id: "mission_daily_accuracy",
      title: "Precision Strike",
      description: "Complete a session today with accuracy >= 85%.",
      target: 1,
      current: hasHighAccuracy ? 1 : 0,
      completed: hasHighAccuracy,
    },
  ]
}

export function evaluateMilestones(runs: RunRecord[], dayStreak: number, peakQuestionStreak: number): Milestone[] {
  const totalRuns = runs.length

  return [
    {
      id: "milestone_runs_novice",
      title: "Core Initiate",
      description: "Complete 5 total study runs.",
      target: 5,
      current: Math.min(totalRuns, 5),
      completed: totalRuns >= 5,
    },
    {
      id: "milestone_runs_expert",
      title: "Advanced Scholar",
      description: "Complete 20 total study runs.",
      target: 20,
      current: Math.min(totalRuns, 20),
      completed: totalRuns >= 20,
    },
    {
      id: "milestone_day_streak",
      title: "Flame Novice",
      description: "Achieve a 3-day login study streak.",
      target: 3,
      current: Math.min(dayStreak, 3),
      completed: dayStreak >= 3,
    },
    {
      id: "milestone_peak_q_streak",
      title: "Overclock Ascent",
      description: "Achieve a peak correctness streak of 8+ answers.",
      target: 8,
      current: Math.min(peakQuestionStreak, 8),
      completed: peakQuestionStreak >= 8,
    },
  ]
}
