import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircleIcon, RadioIcon, XIcon } from "@/components/mold/game/game-icons"
import type { OptionButtonProps } from "@/components/mold/game/question-card-types"

export function OptionButton({
  idx,
  label,
  text,
  isSelected,
  isRevealed,
  isCorrect,
  isWrong,
  isDimmed,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isRevealed}
      disabled={isRevealed}
      aria-label={`Select Option ${label}`}
      title={`Select Option ${label}`}
      onClick={onSelect}
      className={cn(
        "relative flex items-start justify-between p-4 text-left transition-all duration-100 btn-depress group border border-border/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        !isRevealed && !isSelected && "bg-secondary/70 hover:bg-secondary border-l-4 border-l-transparent hover:border-l-primary/50",
        !isRevealed && isSelected && "bg-secondary border-l-4 border-l-primary glow-primary",
        isRevealed && isCorrect && "bg-emerald-500/10 border-l-4 border-l-emerald-500",
        isRevealed && isWrong && "bg-destructive/10 border-l-4 border-l-destructive",
        isDimmed && "bg-muted border-l-4 border-l-transparent opacity-40",
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className={cn(
          "font-mono text-[10px] tracking-widest uppercase",
          !isRevealed && isSelected ? "text-primary font-bold" :
            isRevealed && isCorrect ? "text-emerald-500 font-bold" :
              isRevealed && isWrong ? "text-destructive font-bold" :
                "text-muted-foreground"
        )}>
          OPTION_{String(idx + 1).padStart(2, "0")}
        </span>
        <span className={cn(
          "font-mono text-sm font-bold leading-snug",
          !isRevealed && isSelected ? "text-foreground font-extrabold" :
            isRevealed && isCorrect ? "text-emerald-600 dark:text-emerald-400 font-extrabold" :
              isRevealed && isWrong ? "text-destructive font-extrabold" :
                "text-foreground"
        )}>
          {/* Fallback to label if text is undefined for compatibility with types */}
          {text ?? label}
        </span>
      </div>
      <div className="ml-3 mt-0.5 shrink-0">
        {isRevealed && isCorrect && <CheckCircleIcon className="w-5 h-5 text-emerald-500" />}
        {isRevealed && isWrong && <XIcon className="w-5 h-5 text-destructive" />}
        {!isRevealed && isSelected && <CheckCircleIcon className="w-5 h-5 text-primary" />}
        {!isRevealed && !isSelected && <RadioIcon className="w-5 h-5 text-muted-foreground/40" />}
      </div>
    </button>
  )
}
