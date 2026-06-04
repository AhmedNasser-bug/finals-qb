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
        "relative flex items-start justify-between p-4 text-left transition-all duration-100 btn-depress group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17]",
        !isRevealed && !isSelected && "bg-[#2a2a2a] hover:bg-[#353534] border-l-4 border-transparent hover:border-[#4e4632]",
        !isRevealed && isSelected && "bg-[#2a2a2a] border-l-4 border-[#fecc17] glow-primary",
        isRevealed && isCorrect && "bg-[#4ae176]/10 border-l-4 border-[#4ae176]",
        isRevealed && isWrong && "bg-[#930013]/10 border-l-4 border-[#930013]",
        isDimmed && "bg-[#1c1b1b] border-l-4 border-transparent opacity-40",
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className={cn(
          "font-mono text-[10px] tracking-widest uppercase",
          !isRevealed && isSelected ? "text-[#fecc17]" :
            isRevealed && isCorrect ? "text-[#4ae176]" :
              isRevealed && isWrong ? "text-[#ffb4ab]" :
                "text-zinc-500"
        )}>
          OPTION_{String(idx + 1).padStart(2, "0")}
        </span>
        <span className={cn(
          "font-mono text-sm font-bold leading-snug",
          !isRevealed && isSelected ? "text-[#fecc17]" :
            isRevealed && isCorrect ? "text-[#4ae176]" :
              isRevealed && isWrong ? "text-[#ffb4ab]" :
                isDimmed ? "text-zinc-600" :
                  "text-[#e5e2e1]"
        )}>
          {/* Fallback to label if text is undefined for compatibility with types */}
          {text ?? label}
        </span>
      </div>
      <div className="ml-3 mt-0.5 shrink-0">
        {isRevealed && isCorrect && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {isRevealed && isWrong && <XIcon className="w-5 h-5 text-[#ffb4ab]" />}
        {!isRevealed && isSelected && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {!isRevealed && !isSelected && <RadioIcon className="w-5 h-5 text-zinc-700" />}
      </div>
    </button>
  )
}
