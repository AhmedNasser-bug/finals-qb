import { Flashcard } from "@/lib/mold-types"
import { Header, StatCell, ScorePill, DistributionBar } from "./flashcard-components"

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
