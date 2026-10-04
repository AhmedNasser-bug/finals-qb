export interface CategoryStat {
  category: string
  retrievabilityPct: number
  totalQuestions: number
}

export interface CramVerdict {
  title: string
  badge: string
  badgeColor: string
  text: string
}

export interface Mission {
  id: string
  title: string
  description: string
  current: number
  target: number
  completed: boolean
}

export interface Milestone {
  id: string
  title: string
  description: string
  current: number
  target: number
  completed: boolean
}
