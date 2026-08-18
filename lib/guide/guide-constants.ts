export type SectionId =
  | "overview"
  | "quick-start"
  | "game-modes"
  | "the-science"
  | "scoring"
  | "flashcards"
  | "ai-import"
  | "shortcuts"
  | "tips"
  | "project-links"

export interface TocItem {
  id: SectionId
  label: string
  num: string
  icon: string
}

export const TOC_ITEMS: TocItem[] = [
  { id: "overview",      label: "OVERVIEW",        num: "01", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { id: "quick-start",   label: "QUICK START",     num: "02", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "game-modes",    label: "GAME MODES",      num: "03", icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { id: "the-science",   label: "THE SCIENCE",     num: "04", icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5m4 0h10m-4 7v-7m0 0h4m-4 0H9" },
  { id: "scoring",       label: "SCORING & GRADES", num: "05", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "flashcards",    label: "SPACED RETRIEVAL", num: "06", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "ai-import",     label: "AI IMPORT WIZARD", num: "07", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" },
  { id: "shortcuts",     label: "KEYBOARD SHORTCUTS", num: "08", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { id: "tips",          label: "TIPS & TRICKS",   num: "09", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "project-links", label: "PROJECT LINKS",   num: "10", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
]

export const GAME_MODES = [
  { mode: "SPEEDRUN",      limit: "5:00",       diff: "◆◆◆◇", diffColor: "text-primary", bestFor: "Pressure training", desc: "Fixed 5-minute countdown. Answer as many questions as possible while maintaining accuracy under clock pressure." },
  { mode: "BLITZ",         limit: "2:00",       diff: "◆◆◇◇", diffColor: "text-primary", bestFor: "Daily warm-up", desc: "2-minute rapid-fire session. Ideal for quick diagnostic warm-ups before deep work." },
  { mode: "HARDCORE",      limit: "∞",          diff: "◆◆◆◆", diffColor: "text-destructive", bestFor: "Deep mastery (hard only)", desc: "Filters question pool strictly to Hard questions. No easy passes — pushes conceptual limits." },
  { mode: "SURVIVAL",      limit: "Decreasing", diff: "◆◆◆◆", diffColor: "text-destructive", bestFor: "Resilience training", desc: "3 lives maximum. Per-question time limit starts at 15s and decreases by 1s every 5 questions down to 5s." },
  { mode: "PRACTICE",      limit: "∞",          diff: "Custom", diffColor: "text-muted-foreground", bestFor: "Targeted weak-spot drills", desc: "Untimed sandbox. Filter by specific topic category to systematically drill difficult concepts." },
  { mode: "FULL REVISION", limit: "∞",          diff: "◆◆◆◇", diffColor: "text-primary", bestFor: "Systematic end-to-end review", desc: "Strict deterministic sequence without random shuffling. Evaluates complete syllabus coverage." },
  { mode: "FLASHCARDS",    limit: "∞",          diff: "◆◇◇◇", diffColor: "text-emerald-400", bestFor: "Rapid terminology drills", desc: "SuperMemo SM-2 powered flip-card console with 2D memory heatmap and cognitive latency tracking." },
]

export const CITATIONS = [
  {
    title: "The Testing Effect",
    authors: "Roediger & Karpicke",
    year: "2006",
    journal: "Journal of Experimental Psychology",
    finding: "Active retrieval testing yields ~50% better long-term retention vs. passive re-reading. The act of recall — not re-exposure — builds durable memory traces.",
  },
  {
    title: "Exponential Forgetting Curve",
    authors: "Hermann Ebbinghaus",
    year: "1885",
    journal: "Memory: A Contribution to Experimental Psychology",
    finding: "Without retrieval practice, retention decays exponentially: R(t) = exp(-t/S). Spacing reviews resets decay velocity and permanently stretches memory stability S.",
  },
  {
    title: "SuperMemo SM-2 / SM-18 Algorithms",
    authors: "Dr. Piotr Woźniak",
    year: "1990–2024",
    journal: "SuperMemo Research Institute",
    finding: "Optimal review scheduling: I(n) = I(n-1) × EF. Adjusting ease factor EF based on recall latency and accuracy expands revision intervals by 2.4x without lapse risk.",
  },
  {
    title: "Desirable Difficulties",
    authors: "Robert A. Bjork",
    year: "1994",
    journal: "Memory & Cognition",
    finding: "Introducing friction during learning — harder retrieval, interleaving, reduced immediate clues — creates deeper encoding and dramatically higher knowledge transfer.",
  },
  {
    title: "Immediate Corrective Feedback",
    authors: "Hattie & Timperley",
    year: "2007",
    journal: "Review of Educational Research",
    finding: "Post-error corrective feedback (effect size d = 0.73) is the single highest-leverage learning intervention. Understanding why an option is wrong beats memorizing the right one.",
  },
  {
    title: "Metacognitive Monitoring",
    authors: "Dunlosky & Metcalfe",
    year: "2009",
    journal: "Metacognition & Learning",
    finding: "Tracking what you truly know vs. think you know prevents the illusion of competence — a critical failure mode in passive study that active quiz engines prevent.",
  },
]

export const GRADES = [
  { grade: "S+", min: "≥ 97%", color: "text-primary", desc: "Supreme Mastery — Flawless recall speed & accuracy" },
  { grade: "S",  min: "≥ 93%", color: "text-primary", desc: "Master — Deep conceptual understanding" },
  { grade: "A+", min: "≥ 90%", color: "text-emerald-400", desc: "Distinction — Strong neural pathway consolidation" },
  { grade: "A",  min: "≥ 87%", color: "text-emerald-400", desc: "Excellent — Solid recall with minor latency" },
  { grade: "B+", min: "≥ 80%", color: "text-sky-400", desc: "Proficient — Core concepts understood, gaps in edge cases" },
  { grade: "C+", min: "≥ 70%", color: "text-orange-400", desc: "Developing — Approaching critical retention threshold" },
  { grade: "D+", min: "≥ 60%", color: "text-orange-600", desc: "Marginal — Risk of memory lapse without immediate review" },
  { grade: "F",  min: "< 60%", color: "text-destructive", desc: "Lapsed — Fundamental review required" },
]

export const TIPS = [
  { label: "USE SOCRATIC HINTS SPARINGLY", body: "Hints trigger Socratic nudges, not answers. Use them to unblock your reasoning rather than replacing active retrieval effort." },
  { label: "FLASHCARDS FIRST", body: "Drill Flashcards mode before answering MCQs. Vocabulary fluency dramatically reduces cognitive load during complex scenario questions." },
  { label: "REVIEW YOUR ERROR LOGS", body: "After each session, study wrong answers in the Results screen. Metacognitive analysis turns mistakes into active conceptual insights." },
  { label: "INTERLEAVE YOUR MODES", body: "Interleaving study modes (Speedrun → Practice → Hardcore → Full Revision) creates stronger neural transfer than repeating a single mode." },
  { label: "WATCH YOUR COGNITIVE LATENCY", body: "Hesitating over 7,000ms triggers a Cognitive Hesitation Index penalty. Fast, effortless recall indicates true neural consolidation." },
  { label: "TARGET RED CELLS IN HEATMAP", body: "Check the 2D Retention Heatmap regularly. Crimson (<50%) and Orange (50-75%) cells must be reviewed before permanent memory lapse." },
]
