"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ExternalLink, Terminal, Brain, Flame, Sparkles, BookOpen, Layers, ShieldCheck, Keyboard, HelpCircle } from "lucide-react"

export type { SectionId } from "@/lib/guide/guide-constants"
export { TOC_ITEMS, GAME_MODES, CITATIONS, GRADES, TIPS } from "@/lib/guide/guide-constants"
import type { SectionId } from "@/lib/guide/guide-constants"
import { TOC_ITEMS, GAME_MODES, CITATIONS, GRADES, TIPS } from "@/lib/guide/guide-constants"

export interface SectionProps {
  register: (id: SectionId) => (el: HTMLElement | null) => void
  highlightText?: string
}

// ─── Helper Components ────────────────────────────────────────────────────────

export function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[10px] text-primary/40 tracking-wider">──</span>
      <span className="font-mono text-xs text-primary tracking-[0.2em] uppercase font-bold shrink-0">
        SECTION {num} // {title}
      </span>
      <div className="flex-1 h-px bg-primary/15" />
    </div>
  )
}

// ─── Section Components ───────────────────────────────────────────────────────

export function OverviewSection({ register }: SectionProps) {
  return (
    <section id="overview" ref={register("overview")} aria-labelledby="h-overview" className="scroll-mt-24">
      <SectionHeader num="01" title="OVERVIEW" />
      <h2 id="h-overview" className="font-sans text-3xl lg:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Mastery Through Desirable Difficulty.
      </h2>
      <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mb-8">
        FINALIST MOLD V2 is a high-fidelity learning console engineered on peer-reviewed cognitive science: spaced repetition, active retrieval, and real-time latency telemetry. Packaged in a zero-tracking, 100% offline-first engine with zero cloud latency.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { val: "7", label: "STUDY MODES", desc: "Engineered for each retention phase" },
          { val: "100%", label: "OFFLINE FIRST", desc: "Zero cloud dependencies" },
          { val: "0 ms", label: "NETWORK LATENCY", desc: "Instant localStorage runtime" },
          { val: "0 B", label: "TRACKING DATA", desc: "100% privacy & local storage" },
        ].map(({ val, label, desc }) => (
          <div key={label} className="bg-panel border border-border/60 p-4 flex flex-col gap-1.5 hover:border-primary/40 transition-colors border-glow-on-hover">
            <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
            <span className="font-mono text-3xl font-bold text-primary leading-none">{val}</span>
            <span className="font-sans text-[10px] text-muted-foreground/70 leading-tight">{desc}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0e11] border border-border/50 p-5 font-mono text-xs text-muted-foreground flex items-start gap-3">
        <Terminal className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="text-primary font-bold">[PHILOSOPHY]</span> FINALIST rejects passive highlighting and rote re-reading. By forcing your brain to reconstruct memory traces under calibrated cognitive pressure, retention doubles and exam anxiety drops to zero.
        </div>
      </div>
    </section>
  )
}

export function QuickStartSection({ register }: SectionProps) {
  return (
    <section id="quick-start" ref={register("quick-start")} aria-labelledby="h-quickstart" className="scroll-mt-24">
      <SectionHeader num="02" title="QUICK START" />
      <h2 id="h-quickstart" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Five-Step Protocol to Complete Mastery
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        From zero knowledge to S+ grade proficiency. Follow this streamlined workflow for every exam syllabus or technical subject:
      </p>

      <div className="space-y-3.5">
        {[
          {
            num: "01",
            title: "Load or Import a Subject",
            body: "Choose from pre-loaded subjects (e.g., Theory of Computation, Data Structures & Algorithms, Robotics) or click IMPORT to generate a custom syllabus JSON via the 5-Step AI Wizard.",
            badge: "IMPORT",
          },
          {
            num: "02",
            title: "Calibrate Mode & Parameters",
            body: "Select a game mode suited to your current study phase. Configure time limits, Socratic hint availability, question counts, and category filters.",
            badge: "CONFIGURE",
          },
          {
            num: "03",
            title: "Engage in Active Recall",
            body: "Answer scenario-based MCQs or drill flashcards. Use keyboard shortcuts [1-4] or [Enter]. Request Socratic hints when blocked to stimulate reasoning without spoiling answers.",
            badge: "ENGAGE",
          },
          {
            num: "04",
            title: "Analyze Cognitive Telemetry",
            body: "Review your letter grade (S+ to F), decision latency, accuracy %, and error diagnostic logs in the Results Screen. Copy the performance summary to clipboard.",
            badge: "ANALYZE",
          },
          {
            num: "05",
            title: "Spaced Retrieval Consolidation",
            body: "Return daily to inspect the 2D Retention Heatmap. Review decaying nodes before they drop below the 75% stability threshold to lock in permanent retention.",
            badge: "MASTER",
          },
        ].map((step) => (
          <div key={step.num} className="flex gap-4 p-5 bg-panel border border-border/50 hover:border-primary/30 transition-colors duration-200">
            <div className="shrink-0 w-9 h-9 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-primary">{step.num}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-foreground tracking-wider uppercase">{step.title}</span>
                <span className="font-mono text-[9px] font-bold text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.2 uppercase tracking-widest">{step.badge}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function GameModesSection({ register }: SectionProps) {
  return (
    <section id="game-modes" ref={register("game-modes")} aria-labelledby="h-gamemodes" className="scroll-mt-24">
      <SectionHeader num="03" title="GAME MODES" />
      <h2 id="h-gamemodes" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        The 7 Game Modes Matrix
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        Each mode targets a distinct cognitive stress vector: time pressure, difficulty filtering, endurance, or targeted topic repair.
      </p>

      <div className="overflow-x-auto border border-border/50 bg-panel mb-8">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-[#0d0e11] border-b-2 border-primary/30">
              <th className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">MODE</th>
              <th className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">TIME LIMIT</th>
              <th className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">DIFFICULTY</th>
              <th className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">TARGET OBJECTIVE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {GAME_MODES.map((row, i) => (
              <tr key={row.mode} className={cn("transition-colors hover:bg-secondary/40", i % 2 === 0 ? "bg-panel" : "bg-[#0d0e11]/40")}>
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{row.mode}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">{row.limit}</td>
                <td className={cn("py-3.5 px-4 font-mono text-xs", row.diffColor)}>{row.diff}</td>
                <td className="py-3.5 px-4 text-xs text-muted-foreground font-sans">
                  <span className="font-semibold text-foreground">{row.bestFor}</span> — {row.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ScienceSection({ register }: SectionProps) {
  return (
    <section id="the-science" ref={register("the-science")} aria-labelledby="h-science" className="scroll-mt-24">
      <SectionHeader num="04" title="THE SCIENCE" />
      <h2 id="h-science" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Mathematical Foundations of Human Memory
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        FINALIST replaces intuition and subjective ratings with rigorous mathematical modeling of human memory consolidation.
      </p>

      {/* 3 Core Mathematical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0d0e11] border border-primary/30 p-5 flex flex-col gap-3">
          <div className="font-mono text-[9px] text-primary tracking-widest uppercase font-bold">01 // EBBINGHAUS EXPONENTIAL DECAY</div>
          <div className="bg-panel p-3 border border-border font-mono text-sm text-primary text-center">
            R(t) = exp(-t / S)
          </div>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed flex-1">
            Retention probability R decays exponentially with time t over memory stability S (days). Without spaced retrieval, 70% of encoded concepts are purged within 24 hours.
          </p>
        </div>

        <div className="bg-[#0d0e11] border border-primary/30 p-5 flex flex-col gap-3">
          <div className="font-mono text-[9px] text-primary tracking-widest uppercase font-bold">02 // SUPERMEMO SM-2 INTERVAL EXPANSION</div>
          <div className="bg-panel p-3 border border-border font-mono text-sm text-primary text-center">
            I(n) = I(n-1) × EF
          </div>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed flex-1">
            Successful active retrievals stretch interval I by the Ease Factor EF (default 2.5). Consecutive recalls expand intervals from 1d → 3d → 7d → 16d → 35d.
          </p>
        </div>

        <div className="bg-[#0d0e11] border border-primary/30 p-5 flex flex-col gap-3">
          <div className="font-mono text-[9px] text-primary tracking-widest uppercase font-bold">03 // COGNITIVE HESITATION INDEX (CHI)</div>
          <div className="bg-panel p-3 border border-border font-mono text-xs text-primary text-center truncate">
            q_adj = max(1, q - ⌊Δt / 7000ms⌋)
          </div>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed flex-1">
            Sub-millisecond decision latency Δt tracking. Hesitating over 7,000ms discounts recall score q, preventing the illusion of competence.
          </p>
        </div>
      </div>

      {/* Research Citations */}
      <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-4">// PEER-REVIEWED CITATIONS & EVIDENCE</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITATIONS.map((c) => (
          <div key={c.title} className="bg-panel border-l-[3px] border-primary p-5 flex flex-col gap-2.5 hover:border-primary transition-colors">
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-0.5">{c.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {c.authors} <span className="text-primary/60">·</span> {c.year}
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans flex-1">{c.finding}</p>
            <div className="pt-2 border-t border-border/30">
              <span className="font-mono text-[9px] text-primary/70 tracking-[0.15em] uppercase">{c.journal}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ScoringSection({ register }: SectionProps) {
  return (
    <section id="scoring" ref={register("scoring")} aria-labelledby="h-scoring" className="scroll-mt-24">
      <SectionHeader num="05" title="SCORING & PERFORMANCE GRADES" />
      <h2 id="h-scoring" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        S+ Grade Thresholds & XP Formula
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        Accuracy is calculated strictly across answered questions: <code className="text-primary font-mono font-bold">accuracy = correct ÷ (correct + wrong)</code>. Unanswered/skipped questions do not penalize your accuracy ratio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-panel border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-[#0d0e11]">
            <p className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase font-bold">LETTER GRADE CALIBRATION MATRIX</p>
          </div>
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-border/30 text-[10px] font-mono text-muted-foreground uppercase bg-secondary/20">
                <th className="py-2.5 px-4">GRADE</th>
                <th className="py-2.5 px-4">MIN ACCURACY</th>
                <th className="py-2.5 px-4">COMPETENCY LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 font-mono text-xs">
              {GRADES.map((g) => (
                <tr key={g.grade} className="hover:bg-primary/5 transition-colors">
                  <td className="py-2.5 px-4">
                    <span className={cn("text-base font-bold", g.color)}>{g.grade}</span>
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground">{g.min}</td>
                  <td className="py-2.5 px-4 font-sans text-xs text-muted-foreground">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d0e11] border border-border/50 p-5 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase font-bold mb-3">XP YIELD & PROGRESSION METRICS</p>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-4">
              XP yield scales dynamically based on accuracy percentage, streak multiplier, time bonus, and mode difficulty:
            </p>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <div className="p-2.5 bg-panel border border-border flex justify-between">
                <span>Base Correct Yield:</span>
                <span className="text-primary font-bold">+100 XP per question</span>
              </div>
              <div className="p-2.5 bg-panel border border-border flex justify-between">
                <span>Streak Multiplier:</span>
                <span className="text-emerald-400 font-bold">1.0x + (streak × 0.1x)</span>
              </div>
              <div className="p-2.5 bg-panel border border-border flex justify-between">
                <span>S+ Mastery Bonus:</span>
                <span className="text-primary font-bold">+500 XP bonus</span>
              </div>
              <div className="p-2.5 bg-panel border border-border flex justify-between">
                <span>Zero Hints Bonus:</span>
                <span className="text-cyan-400 font-bold">+250 XP bonus</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-panel border border-border/40 font-mono text-[10px] text-muted-foreground/80 mt-4">
            <span className="text-primary">// PRO-TIP: </span>
            Maintain a streak ≥ 10 in Hardcore or Survival mode to maximize rank progression.
          </div>
        </div>
      </div>
    </section>
  )
}

export function FlashcardsSection({ register }: SectionProps) {
  return (
    <section id="flashcards" ref={register("flashcards")} aria-labelledby="h-flashcards" className="scroll-mt-24">
      <SectionHeader num="06" title="FLASHCARDS & RETENTION HEATMAP" />
      <h2 id="h-flashcards" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        2D Retention Heatmap & Intelligent Routing
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        The Flashcard engine does not cycle cards randomly. It calculates real-time memory stability per topic node and renders a live 2D retention matrix.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-panel border border-border/50 p-5">
          <p className="font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">RETENTION URGENCY TIERS</p>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3 p-2 bg-[#0d0e11] border-l-4 border-emerald-400">
              <span className="text-emerald-400 font-bold w-20">MASTERED</span>
              <span className="text-muted-foreground font-sans">≥ 90% retention. Stability S &gt; 14 days.</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-[#0d0e11] border-l-4 border-amber-400">
              <span className="text-amber-400 font-bold w-20">STABLE</span>
              <span className="text-muted-foreground font-sans">75% – 89% retention. Routine maintenance.</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-[#0d0e11] border-l-4 border-orange-500">
              <span className="text-orange-400 font-bold w-20">DUE SOON</span>
              <span className="text-muted-foreground font-sans">50% – 74% retention. Priority retrieval cue.</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-[#0d0e11] border-l-4 border-destructive">
              <span className="text-destructive font-bold w-20">CRITICAL</span>
              <span className="text-muted-foreground font-sans">&lt; 50% retention. Memory trace in lapse state.</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0d0e11] border border-border/50 p-5 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">INTELLIGENT SOCRATIC ROUTING</p>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3">
              When starting a study session, the routing algorithm builds a prioritized queue:
            </p>
            <ol className="list-decimal list-inside font-mono text-xs text-muted-foreground space-y-1.5">
              <li><strong className="text-foreground">Critical Lapsed Items:</strong> Cards with R &lt; 50% placed at start of queue.</li>
              <li><strong className="text-foreground">Due for Review:</strong> Cards whose stability interval expired today.</li>
              <li><strong className="text-foreground">High-Latency Hesitations:</strong> Cards where decision latency exceeded 7000ms.</li>
              <li><strong className="text-foreground">New Unencoded Cards:</strong> Fresh syllabus material.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AIImportSection({ register }: SectionProps) {
  return (
    <section id="ai-import" ref={register("ai-import")} aria-labelledby="h-import" className="scroll-mt-24">
      <SectionHeader num="07" title="AI IMPORT WIZARD & DATA SCHEMA" />
      <h2 id="h-import" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Socratic AI Import Wizard & Data Contracts
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        Generate complete, structured subjects from syllabi, lecture slides, or textbook chapters using ChatGPT, Claude, Gemini, or local models. No API keys required.
      </p>

      {/* 5 Step Wizard Flow */}
      <div className="space-y-3 mb-8">
        {[
          { step: "01", title: "PRESET & TOPIC", body: 'Enter your subject title (e.g. "Operating Systems") and select a pedagogical preset: Balanced, Conceptual Intuition, Technical Deep-Dive, or Exam Prep.' },
          { step: "02", title: "PEDAGOGICAL BIAS", body: "Calibrate the ratio between theoretical understanding (first principles) and applied technical problem-solving." },
          { step: "03", title: "VOLUME & DIFFICULTY SPREAD", body: "Select total question volume (10–100 questions), flashcards count, and target difficulty distribution (e.g. 20% Easy, 50% Medium, 30% Hard)." },
          { step: "04", title: "COPY SOCRATIC PROMPT", body: "Click COPY PROMPT. The wizard encodes all schema constraints, LaTeX delimiters ($$...$$), and Socratic hint guidelines into the clipboard." },
          { step: "05", title: "PASTE & VALIDATE", body: "Paste the LLM JSON response. FINALIST validates syntax, question options, answers, and achievement criteria in real-time." },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 p-4 bg-panel border border-border/40 hover:border-primary/30 transition-colors">
            <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">{s.step}</span>
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-1">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* LaTeX & Mermaid Rules */}
      <div className="bg-[#0d0e11] border border-border/50 p-5 mb-6">
        <p className="font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-3">// MATHEMATICAL & DIAGRAMMATIC STANDARDS</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-muted-foreground">
          <div className="p-3 bg-panel border border-border">
            <span className="text-foreground font-bold">LaTeX Math Formatting:</span>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              Use <code className="text-primary font-mono">$$...$$</code> for centered block math and <code className="text-primary font-mono">$...$</code> for inline expressions. Rendered automatically via KaTeX.
            </p>
          </div>
          <div className="p-3 bg-panel border border-border">
            <span className="text-foreground font-bold">Mermaid Architecture Diagrams:</span>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              Include <code className="text-primary font-mono">```mermaid ... ```</code> blocks in question explanations for state machines, parse trees, and circuit diagrams.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ShortcutsSection({ register }: SectionProps) {
  return (
    <section id="shortcuts" ref={register("shortcuts")} aria-labelledby="h-shortcuts" className="scroll-mt-24">
      <SectionHeader num="08" title="KEYBOARD SHORTCUTS & ERGONOMICS" />
      <h2 id="h-shortcuts" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Rapid Frictionless Hotkeys
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        Keep your hands on the keyboard for maximum study velocity and zero cognitive disruption.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {[
          { key: "1  2  3  4", action: "Select MCQ Option A, B, C, or D", context: "Live Quiz Session" },
          { key: "Enter / Space", action: "Submit Answer / Next Question", context: "Live Quiz Session" },
          { key: "H", action: "Trigger Socratic Hint", context: "Live Quiz Session" },
          { key: "Space / Enter", action: "Flip Card & Reveal Answer", context: "Flashcard Console" },
          { key: "1 / 2", action: "Rate 'Still Learning' vs 'Got It'", context: "Flashcard Console" },
          { key: "R / Enter", action: "Play Again (Restart Mode)", context: "Results Screen" },
          { key: "Esc / H", action: "Return to Home Console", context: "Results & Quiz" },
          { key: "Tab / Shift+Tab", action: "Navigate Accessible Focus Ring", context: "Universal" },
          { key: "Esc", action: "Close Modals / Overlays", context: "Universal" },
        ].map((item) => (
          <div key={item.key} className="p-4 bg-panel border border-border/50 hover:border-primary/30 transition-colors flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <kbd className="px-2 py-1 bg-[#0d0e11] border border-primary/40 text-primary font-bold text-xs rounded shadow-[0_0_8px_hsla(var(--primary),0.1)]">
                {item.key}
              </kbd>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest">{item.context}</span>
            </div>
            <p className="font-sans text-xs text-foreground font-semibold">{item.action}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function TipsSection({ register }: SectionProps) {
  return (
    <section id="tips" ref={register("tips")} aria-labelledby="h-tips" className="scroll-mt-24">
      <SectionHeader num="09" title="TIPS & COGNITIVE HYGIENE" />
      <h2 id="h-tips" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Socratic Strategies for Elite Retention
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        Practical evidence-backed habits to maximize retention velocity and eliminate cognitive fatigue.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIPS.map((tip) => (
          <div key={tip.label} className="p-5 bg-panel border border-border/50 hover:border-primary/30 transition-colors border-glow-on-hover">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
              <p className="font-mono text-xs font-bold text-primary tracking-[0.15em] uppercase">{tip.label}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectLinksSection({ register }: SectionProps) {
  return (
    <section id="project-links" ref={register("project-links")} aria-labelledby="h-links" className="scroll-mt-24">
      <SectionHeader num="10" title="OPEN DATA CONTRACT & REPO" />
      <h2 id="h-links" className="font-sans text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Open Source & Community Ecosystem
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-6">
        FINALIST MOLD V2 is built with open data formats, strict TypeScript contracts, and zero lock-in.
      </p>

      <div className="space-y-3 mb-10">
        {[
          {
            label: "GitHub Repository",
            href: "https://github.com/AhmedNasser-bug/finals-qb",
            sub: "github.com/AhmedNasser-bug/finals-qb",
            desc: "Full source code, Next.js 16 architecture, test suite, and open issue tracker.",
          },
          {
            label: "Report an Issue / Feature Request",
            href: "https://github.com/AhmedNasser-bug/finals-qb/issues",
            sub: "github.com/AhmedNasser-bug/finals-qb/issues",
            desc: "Found a bug or have a suggestion? Open an issue on GitHub.",
          },
          {
            label: "Contributor & Subject Authoring Guidelines",
            href: "https://github.com/AhmedNasser-bug/finals-qb/blob/main/CONTRIBUTORS.md",
            sub: "CONTRIBUTORS.md",
            desc: "Learn how to author and submit custom academic subjects to the community repository.",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 p-5 bg-panel border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div>
              <p className="font-mono text-xs font-bold text-foreground group-hover:text-primary tracking-wide uppercase mb-1 transition-colors">
                {link.label}
              </p>
              <p className="font-mono text-[10px] text-primary/70 tracking-widest mb-1.5">{link.sub}</p>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{link.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" aria-hidden="true" />
          </a>
        ))}
      </div>

      <div className="pt-8 border-t border-border/30 text-center font-mono text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase">
        FINALIST MOLD V2 · OPERATIONAL PROTOCOL · 100% OFFLINE-FIRST · ZERO TRACKING
      </div>
    </section>
  )
}
