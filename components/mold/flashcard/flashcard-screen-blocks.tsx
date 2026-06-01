import { Flashcard } from "@/lib/mold-types"
import { Header, StatCell, ScorePill, DistributionBar } from "@/components/mold/flashcard/flashcard-components"
import { cn } from "@/lib/utils"
import { RichText } from "@/components/mold/common/rich-text"
import { formatLabel } from "@/lib/mold-types"

export interface FlashcardDossierCardProps {
  card: Flashcard;
  index: number;
  flipped: boolean;
  animClass: string;
  accent: { color: string; border: string; label: string };
  onFlip: () => void;
}

export function FlashcardDossierCard({
  card,
  index,
  flipped,
  animClass,
  accent,
  onFlip,
}: FlashcardDossierCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl min-h-[380px] flex flex-col relative",
        "border border-border",
        "bg-surface-container-high",
        "transition-all duration-200",
        "hover:border-primary/30",
        accent.border,
        "border-t-[3px]",
        animClass
      )}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      {/* Radial spotlight */}
      <div className="absolute inset-0 pointer-events-none z-0 spotlight-primary" />

      {/* Animated scanline sweep */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-50">
        <div className="w-full h-full animate-scanline-sweep bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      {/* Corner markers */}
      <span className="absolute top-1 left-2 text-[10px] font-mono text-muted-foreground/30 pointer-events-none z-20 select-none">┌</span>
      <span className="absolute top-1 right-2 text-[10px] font-mono text-muted-foreground/30 pointer-events-none z-20 select-none">┐</span>
      <span className="absolute bottom-1 left-2 text-[10px] font-mono text-muted-foreground/30 pointer-events-none z-20 select-none">└</span>
      <span className="absolute bottom-1 right-2 text-[10px] font-mono text-muted-foreground/30 pointer-events-none z-20 select-none">┘</span>

      {/* ── Card Front (Term) ───────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col relative z-10 transition-all duration-300 ease-out",
          flipped ? "opacity-0 scale-[0.97] pointer-events-none absolute inset-0" : "opacity-100 scale-100"
        )}
      >
        {/* Top meta strip */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              TERM
            </span>
            <span className={cn("text-[10px] font-mono tracking-wider", accent.color)}>
              // {accent.label}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider animate-pulse-soft">
            TAP TO FLIP
          </span>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-border/40" />

        {/* Term content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
          <p className="text-4xl sm:text-5xl font-mono font-bold text-foreground text-center break-words tracking-tight">
            <RichText content={card.term || ""} id={`term-${card.id}`} />
          </p>
        </div>

        {/* Bottom metadata bar */}
        <div className="mx-5 border-t border-border/40" />
        <div className="flex items-center justify-between px-5 py-2.5">
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground/60">
            MEMORY NODE {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono tracking-wider text-emerald-400/70">
            SIGNAL: STABLE
          </span>
        </div>
      </div>

      {/* ── Card Back (Definition) ──────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col relative z-10 transition-all duration-300 ease-out",
          flipped ? "opacity-100 scale-100" : "opacity-0 scale-[0.97] pointer-events-none absolute inset-0"
        )}
      >
        {/* Top meta strip */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              DEFINITION
            </span>
          </div>
          <span className={cn(
            "text-[10px] font-mono px-1.5 py-0.5 border tracking-wider",
            "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
          )}>
            DECODED
          </span>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-border/40" />

        {/* Definition content */}
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed text-pretty">
            <RichText content={card.definition || ""} id={`def-${card.id}`} />
          </p>
        </div>

        {/* Bottom metadata bar */}
        <div className="mx-5 border-t border-border/40" />
        <div className="flex items-center justify-between px-5 py-2.5">
          <span className={cn("text-[10px] font-mono tracking-wider", accent.color)}>
            {formatLabel(card.category)}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider">
            TAP AGAIN TO REVIEW TERM
          </span>
        </div>
      </div>

      {/* Invisible click zone covering the entire card */}
      <button
        onClick={onFlip}
        aria-label={flipped ? "Show term" : "Show definition"}
        className="absolute inset-0 z-20 w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  )
}

export interface FlashcardResponseControlsProps {
  onRespond: (knew: boolean) => void;
}

export function FlashcardResponseControls({ onRespond }: FlashcardResponseControlsProps) {
  return (
    <div className="flex gap-5 w-full max-w-2xl mt-6 animate-fade-in">
      <button
        onClick={() => onRespond(false)}
        className={cn(
          "flex-1 py-3 px-6 rounded border text-xs font-mono tracking-wider",
          "border-red-400/40 bg-red-400/5 text-red-400",
          "hover:bg-red-400/10 hover:border-red-400/50",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400",
          "btn-depress"
        )}
      >
        ✕ &nbsp;STILL LEARNING &nbsp;-1
      </button>
      <button
        onClick={() => onRespond(true)}
        className={cn(
          "flex-1 py-3 px-6 rounded border text-xs font-mono tracking-wider font-bold",
          "border-emerald-400/40 bg-emerald-400/5 text-emerald-400",
          "hover:bg-emerald-400/10 hover:border-emerald-400/50",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400",
          "btn-depress"
        )}
      >
        ✓ &nbsp;GOT IT &nbsp;+1
      </button>
    </div>
  )
}

export interface SessionEndScreenProps {
  round: number;
  flashcardsLength: number;
  confident: number;
  neutral: number;
  learning: number;
  hardest: Flashcard | undefined;
  scores: Record<string, number>;
  onReturnHome: () => void;
  onComplete: () => void;
}

export function SessionEndScreen({
  round,
  flashcardsLength,
  confident,
  neutral,
  learning,
  hardest,
  scores,
  onReturnHome,
  onComplete,
}: SessionEndScreenProps) {
  return (
    <div className="flex flex-col flex-1">
      <Header
        onQuit={onReturnHome}
        progress={100}
        position={`${flashcardsLength} / ${flashcardsLength}`}
        round={round}
        confident={confident}
        learning={learning}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest">SESSION COMPLETE</p>
          <h2 className="text-2xl font-mono font-bold text-foreground">
            {round} {round === 1 ? "ROUND" : "ROUNDS"}
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            {round * flashcardsLength} total reviews
          </p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-3 gap-3">
          <StatCell label="CONFIDENT" value={String(confident)} color="text-emerald-400" borderColor="border-emerald-400/30" />
          <StatCell label="NEUTRAL" value={String(neutral)} color="text-muted-foreground" borderColor="border-border" />
          <StatCell label="LEARNING" value={String(learning)} color="text-red-400" borderColor="border-red-400/30" />
        </div>

        {hardest && (
          <div className="w-full max-w-sm flex flex-col gap-1.5">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">HARDEST CARD</p>
            <div className="p-3 rounded border border-red-400/20 bg-red-400/5">
              <p className="text-sm font-semibold text-foreground">{hardest.term}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{hardest.definition}</p>
              <p className="text-[10px] font-mono text-red-400 mt-2">score {scores[hardest.id]}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={onReturnHome}
            aria-label="Return to home screen"
            title="Return to home screen"
            className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground hover:border-border/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            HOME
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            NEW SESSION
          </button>
        </div>
      </div>
    </div>
  )
}

export interface RoundEndScreenProps {
  round: number;
  deckLength: number;
  flashcardsLength: number;
  confident: number;
  neutral: number;
  learning: number;
  roundGotIt: number;
  roundStillLearning: number;
  hardestCards: Flashcard[];
  scores: Record<string, number>;
  onReturnHome: () => void;
  onContinue: () => void;
  onEndSession: () => void;
}

export function RoundEndScreen({
  round,
  deckLength,
  flashcardsLength,
  confident,
  neutral,
  learning,
  roundGotIt,
  roundStillLearning,
  hardestCards,
  scores,
  onReturnHome,
  onContinue,
  onEndSession,
}: RoundEndScreenProps) {
  return (
    <div className="flex flex-col flex-1">
      <Header
        onQuit={onReturnHome}
        progress={100}
        position={`${deckLength} / ${deckLength}`}
        round={round}
        confident={confident}
        learning={learning}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8 animate-slide-up">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest">ROUND {round} COMPLETE</p>
          <div className="flex items-center gap-4 mt-2">
            <ScorePill label="GOT IT" count={roundGotIt} color="emerald" />
            <ScorePill label="STILL LEARNING" count={roundStillLearning} color="red" />
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-2">
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest">DECK STATUS</p>
          <DistributionBar confident={confident} neutral={neutral} learning={learning} total={flashcardsLength} />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
            <span className="text-emerald-400">{confident} confident</span>
            <span className="text-muted-foreground">{neutral} neutral</span>
            <span className="text-red-400">{learning} learning</span>
          </div>
        </div>

        {hardestCards.length > 0 && (
          <div className="w-full max-w-sm flex flex-col gap-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
              NEXT — PRIORITY CARDS
            </p>
            <div className="flex flex-col gap-1.5">
              {hardestCards.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-3 py-2 rounded border border-red-400/20 bg-red-400/5"
                >
                  <span className="text-xs font-semibold text-foreground truncate">{c.term}</span>
                  <span className="text-[10px] font-mono text-red-400 ml-2 shrink-0">
                    {scores[c.id] > 0 ? `+${scores[c.id]}` : scores[c.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={onEndSession}
            aria-label="End current flashcard session"
            title="End current session"
            className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            END SESSION
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            CONTINUE — ROUND {round + 1}
          </button>
        </div>
      </div>
    </div>
  )
}
