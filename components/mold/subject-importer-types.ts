import type { FullSubjectData } from "@/lib/mold-types"

export type ImporterState = "idle" | "validating" | "valid" | "error" | "pasting"

export interface SubjectImporterProps {
  onImport: (subject: FullSubjectData) => void
  onCancel: () => void
  existingIds?: string[]
}
