import React from "react"
import { cn } from "@/lib/utils"

export type SectionId =
  | "overview"
  | "quick-start"
  | "game-modes"
  | "the-science"
  | "scoring"
  | "ai-import"
  | "tips"
  | "project-links"

export function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[10px] text-primary/40 tracking-wider">──</span>
      <span className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase font-bold shrink-0">
        SECTION {num} // {title}
      </span>
      <div className="flex-1 h-px bg-primary/15" />
    </div>
  )
}

export function OverviewSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="overview" ref={register("overview")} aria-labelledby="h-overview">
      <SectionHeader num="01" title="OVERVIEW" />
      <h1 id="h-overview" className="font-sans text-3xl lg:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
        Mastery Through Desirable Difficulty.
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mb-8">
        FINALIST is not a casual study tool. It is a high-fidelity learning terminal built on peer-reviewed cognitive science — spaced repetition, active retrieval, and metacognitive feedback — packaged in a zero-tracking, offline-first engine.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { val: "7", label: "STUDY MODES" },
          { val: "100%", label: "OFFLINE" },
          { val: "0 B", label: "DATA SENT" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-panel border border-border/50 p-5 flex flex-col gap-2 hover:border-primary/30 transition-colors duration-200">
            <span className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
            <span className="font-mono text-4xl font-light text-primary leading-none">{val}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function QuickStartSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="quick-start" ref={register("quick-start")} aria-labelledby="h-quickstart">
      <SectionHeader num="02" title="QUICK START" />
      <h2 id="h-quickstart" className="sr-only">Quick Start Guide</h2>
      <div className="space-y-3">
        {[
          {
            num: "01",
            title: "Open the Import Wizard",
            body: 'Click IMPORT in the top nav or on the subject selection screen. The 5-step wizard opens — start at "Preset & Topic."',
          },
          {
            num: "02",
            title: "Configure your subject",
            body: "Set your topic name, select a pedagogical preset (Balanced, Conceptual, etc.), and calibrate the difficulty bias and question volume.",
          },
          {
            num: "03",
            title: "Generate JSON with any AI",
            body: "Copy the generated AI prompt. Paste it into ChatGPT, Claude, Gemini, or any capable LLM. It returns a fully structured FullSubjectData JSON blob.",
          },
          {
            num: "04",
            title: "Paste & validate",
            body: "Paste the AI response into the wizard's final step. FINALIST validates every field in real-time — question count, difficulty spread, achievement conditions — and shows a full preview.",
          },
          {
            num: "05",
            title: "Select a mode and start",
            body: "From the home screen, pick any of the 7 study modes. Configure time limit, hints, and question count. Press INITIALIZE PROTOCOL to begin.",
          },
        ].map((step) => (
          <div key={step.num} className="flex gap-4 p-5 bg-panel border border-border/40 hover:border-primary/25 transition-colors duration-200">
            <div className="shrink-0 w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-primary">{step.num}</span>
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-1">{step.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function GameModesSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="game-modes" ref={register("game-modes")} aria-labelledby="h-gamemodes">
      <SectionHeader num="03" title="GAME MODES" />
      <h2 id="h-gamemodes" className="sr-only">Game Modes Reference</h2>
      <div className="mb-6 p-4 bg-[#0d0e11] border border-border/40">
        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-3">// INTERFACE PREVIEW — MODE SELECTOR</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["SPEEDRUN", "BLITZ", "HARDCORE", "SURVIVAL"].map((m, i) => (
            <div key={m} className={cn(
              "border p-2.5 font-mono text-[10px] tracking-wider text-center",
              i === 0 ? "border-primary/60 bg-primary/5 text-primary shadow-[0_0_8px_rgba(254,204,23,0.15)]" : "border-border/40 text-muted-foreground/50"
            )}>
              {m}
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-panel border-b-2 border-primary/30">
              {["MODE", "TIME LIMIT", "DIFFICULTY", "BEST FOR"].map((h) => (
                <th key={h} className="py-3 px-4 font-mono text-[10px] text-primary tracking-[0.15em] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {GAME_MODES.map((row, i) => (
              <tr key={row.mode} className={cn("transition-colors hover:bg-panel/50", i % 2 === 0 ? "bg-background" : "bg-panel/30")}>
                <td className="py-3 px-4 font-mono text-xs font-bold text-foreground">{row.mode}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{row.limit}</td>
                <td className={cn("py-3 px-4 font-mono text-xs", row.diffColor)}>{row.diff}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ScienceSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="the-science" ref={register("the-science")} aria-labelledby="h-science">
      <SectionHeader num="04" title="THE SCIENCE" />
      <h2 id="h-science" className="sr-only">Research Foundation</h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
        Every design decision in FINALIST maps to peer-reviewed cognitive science. These are the five studies that form its pedagogical foundation.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {CITATIONS.map((c) => (
          <div key={c.title} className="bg-[#0d0e11] border-l-[3px] border-primary p-5 flex flex-col gap-3 hover:bg-panel/50 transition-colors duration-200">
            <div>
              <p className="font-mono text-xs font-bold text-foreground tracking-wider uppercase mb-1">{c.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {c.authors} <span className="text-primary/60">·</span> {c.year}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.finding}</p>
            <div className="pt-3 border-t border-border/30">
              <span className="font-mono text-[9px] text-primary/60 tracking-[0.15em] uppercase">{c.journal}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ScoringSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="scoring" ref={register("scoring")} aria-labelledby="h-scoring">
      <SectionHeader num="05" title="SCORING & GRADES" />
      <h2 id="h-scoring" className="sr-only">Scoring and Grade System</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-panel border border-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 bg-[#0d0e11]">
            <p className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.2em] uppercase">GRADE THRESHOLDS</p>
          </div>
          <table className="w-full" role="table">
            <thead className="sr-only">
              <tr><th>Grade</th><th>Min Accuracy</th></tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {GRADES.map((g) => (
                <tr key={g.grade} className="hover:bg-primary/3 transition-colors">
                  <td className="py-3 px-5">
                    <span className={cn("font-mono text-xl font-bold tracking-tight", g.color)}>{g.grade}</span>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-muted-foreground tracking-widest">{g.min} ACCURACY</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#0d0e11] border border-border/40 p-5 flex flex-col gap-3">
          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase">// INTERFACE PREVIEW — RESULTS SCREEN</p>
          <div className="flex flex-col items-center gap-4 flex-1 justify-center py-4">
            <div className="w-20 h-20 border-2 border-primary/60 flex items-center justify-center shadow-[0_0_20px_rgba(254,204,23,0.2)]">
              <span className="font-mono text-3xl font-bold text-primary">S+</span>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {[["ACC", "97%"], ["STREAK", "12"], ["TIME", "4:22"]].map(([label, val]) => (
                <div key={label} className="border border-border/40 p-2 text-center">
                  <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest">{label}</p>
                  <p className="font-mono text-sm font-bold text-foreground">{val}</p>
                </div>
              ))}
            </div>
            <div className="w-full border border-border/30 py-1.5 text-center font-mono text-[10px] text-muted-foreground/50 tracking-widest">
              [ HOME ] &nbsp; [ PLAY AGAIN ]
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-panel border border-border/30 font-mono text-xs text-muted-foreground">
        <span className="text-primary/70">// </span>
        Accuracy = correct ÷ (correct + wrong). Skipped questions do not count against you — only answered ones.
      </div>
    </section>
  )
}

export function AIImportSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="ai-import" ref={register("ai-import")} aria-labelledby="h-import">
      <SectionHeader num="06" title="AI IMPORT WIZARD" />
      <h2 id="h-import" className="sr-only">AI Import Wizard Guide</h2>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
        The 5-step wizard generates a structured JSON subject file using any capable LLM. No API key required — you copy a prompt, paste the AI response back.
      </p>
      <div className="mb-6 bg-[#0d0e11] border border-border/40 p-4">
        <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-3">// INTERFACE PREVIEW — IMPORT WIZARD</p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {["PRESET", "BIAS", "VOLUME", "PROMPT", "LOAD"].map((s, i) => (
            <div key={s} className="flex items-center shrink-0">
              <div className={cn(
                "border px-3 py-1.5 font-mono text-[10px] tracking-widest",
                i === 3 ? "border-primary/60 bg-primary/5 text-primary" : "border-border/30 text-muted-foreground/40"
              )}>
                {String(i + 1).padStart(2, "0")} {s}
              </div>
              {i < 4 && <div className="w-6 h-px bg-primary/20 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[
          { step: "01", title: "PRESET & TOPIC", body: 'Enter your subject name and pick a pedagogical preset. "Balanced" is recommended for most subjects.' },
          { step: "02", title: "SUBJECT BIAS", body: "Calibrate the split between Theoretical (conceptual understanding) and Technical (applied problem-solving) questions." },
          { step: "03", title: "VOLUME CALIBRATION", body: "Set total question count (10–100), flashcard count, and difficulty distribution (Easy / Medium / Hard %)." },
          { step: "04", title: "PROMPT GENERATION", body: "Copy the ready-made AI prompt. Replace nothing — your configuration is already embedded. Paste into any LLM." },
          { step: "05", title: "LOAD & VALIDATE", body: "Paste the AI response JSON. FINALIST validates schema, question count, difficulty spread, and achievement conditions in real-time." },
        ].map((s) => (
          <div key={s.step} className="flex gap-4 p-4 bg-panel border border-border/30 hover:border-primary/20 transition-colors">
            <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">{s.step}</span>
            <div>
              <p className="font-mono text-[10px] font-bold text-foreground tracking-widest uppercase mb-1">{s.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function TipsSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="tips" ref={register("tips")} aria-labelledby="h-tips">
      <SectionHeader num="07" title="TIPS & TRICKS" />
      <h2 id="h-tips" className="sr-only">Tips and Tricks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIPS.map((tip) => (
          <div key={tip.label} className="p-5 bg-panel border border-border/40 hover:border-primary/25 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
              <p className="font-mono text-[10px] font-bold text-primary tracking-[0.15em] uppercase">{tip.label}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectLinksSection({ register }: { register: (id: SectionId) => (el: HTMLElement | null) => void }) {
  return (
    <section id="project-links" ref={register("project-links")} aria-labelledby="h-links">
      <SectionHeader num="08" title="PROJECT LINKS" />
      <h2 id="h-links" className="sr-only">Project Links</h2>
      <div className="space-y-3">
        {[
          {
            label: "GitHub Repository",
            href: "https://github.com/AhmedNasser-bug/finals-qb",
            sub: "github.com/AhmedNasser-bug/finals-qb",
            desc: "Full source code, roadmap, and open issues.",
          },
          {
            label: "Report an Issue",
            href: "https://github.com/AhmedNasser-bug/finals-qb/issues",
            sub: "github.com/AhmedNasser-bug/finals-qb/issues",
            desc: "Found a bug or have a feature request? Open a GitHub Issue.",
          },
          {
            label: "Contribution Guide",
            href: "https://github.com/AhmedNasser-bug/finals-qb/blob/main/CONTRIBUTORS.md",
            sub: "CONTRIBUTORS.md",
            desc: "How to contribute subjects, bug fixes, or new study modes.",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 p-5 bg-panel border border-border/40 hover:border-primary/40 hover:bg-primary/3 transition-all duration-200 group"
          >
            <div>
              <p className="font-mono text-xs font-bold text-foreground group-hover:text-primary tracking-wide uppercase mb-1 transition-colors">
                {link.label}
              </p>
              <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-1.5">{link.sub}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
            </div>
            <ExternalLinkIcon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 shrink-0 mt-1 transition-colors" aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="mt-10 pt-8 border-t border-border/20 text-center">
        <p className="font-mono text-[9px] text-muted-foreground/30 tracking-[0.2em] uppercase">
          FINALIST MASTERY PROTOCOL · v2.0 · Offline-first · Zero tracking
        </p>
      </div>
    </section>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

export function StackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-3.5 h-3.5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
