import type { Question } from "@/lib/mold-types";

export interface OptionButtonProps {
  idx: number;
  label: string;
  text?: string;
  isSelected: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}

export interface QuestionHeaderProps {
  question: Question;
  currentIndex: number;
  grade: string;
  gradeColor: string;
}

export interface QuestionContentProps {
  question: Question;
  parts: { type: string; content: string }[];
  hasDedicatedDiagram: boolean;
  diagramBelow: boolean;
  renderOptions: (cols: "single" | "split") => React.ReactNode;
  renderDiagram: (mode: "side" | "below") => React.ReactNode;
}
