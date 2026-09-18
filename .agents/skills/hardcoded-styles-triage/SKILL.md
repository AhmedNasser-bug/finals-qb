---
name: hardcoded-styles-triage
description: Systematically scans, audits, triages, and refactors hardcoded colors, arbitrary hex classes, and non-semantic Tailwind styles across the codebase to ensure 100% compliance with dynamic theme changing and dark/light modes. Use whenever asked to "triage hardcoded styles", "refactor styles", "remove hardcoded colors", "fix theme styling", "audit styling", "theme compatibility pass", "make styles dynamic", or "run daily styles pass".
---

# Hardcoded Styles Triage & Refactor Skill (`hardcoded-styles-triage`)

An autonomous, precision engineering protocol to search, isolate, and refactor hardcoded styling patterns across the MOLD V2 codebase into dynamic HSL semantic design tokens.

---

## 1. Trigger & Scope Conditions

Trigger this skill whenever:
- The user or a daily sleeper agent requests styling triage, theme audits, or hardcoded color elimination.
- A new component or feature has introduced raw hex codes (`#[0-9a-fA-F]{3,8}`) or static color scales (`zinc-*`, `amber-*`, `emerald-*`).
- Testing theme switching reveals visual clashes in alternative themes (e.g. Cyber Emerald, Crimson Dracula, Nordic Frost) or Light Mode.

---

## 2. Core Detection Categories

The scanner and agent target 5 primary classes of styling regressions:

1. **Arbitrary Hex Classes**:
   - `bg-[#07080a]`, `bg-[#101115]`, `bg-[#111215]`, `bg-[#0d0e11]`, `bg-[#1b1b1f]`, `bg-[#2a2a2a]`
   - `text-[#fecc17]`, `text-[#4ae176]`, `text-[#a4acba]`, `text-[#e5e2e1]`, `text-[#930013]`
   - `border-[#fecc17]`, `border-[#4ae176]`, `border-[#353534]`
2. **Static Neutral & Monochromatic Scales**:
   - `text-zinc-300`, `text-zinc-400`, `text-zinc-500`, `text-zinc-600`, `text-zinc-700`
   - `bg-zinc-800`, `bg-zinc-900`, `bg-zinc-950`
   - `border-zinc-700`, `border-zinc-800`
   - `hover:border-zinc-700/80`, `hover:bg-zinc-800/20`
3. **Literal White / Black Classes**:
   - `text-white`, `hover:text-white` (breaks in Light Mode)
   - `bg-black`, `bg-black/30`, `bg-black/40`
   - `text-black` on primary accents without `text-primary-foreground`
4. **Hardcoded RGBA Glows & Shadows**:
   - `shadow-[0_0_15px_rgba(254,204,23,...)]` (hardcodes amber glow; breaks in emerald/crimson/nordic themes)
5. **Inline SVG Hardcoded Colors**:
   - `fill="#fecc17"`, `stroke="#fecc17"` instead of `currentColor` or `hsl(var(--primary))`

---

## 3. Execution Workflow

### Step 1: Run Automated Triage Scanner
Execute the bundled triage scanner to discover all offending files and sort by violation density:
```bash
python .agents/skills/hardcoded-styles-triage/scripts/triage_styles.py --min 1
```
For JSON output:
```bash
python .agents/skills/hardcoded-styles-triage/scripts/triage_styles.py --json
```

### Step 2: Select Target Component Batch
Prioritize high-impact components based on the scan results:
1. Core UI screens: `components/mold/home/`, `components/mold/game/`, `components/mold/subject/`
2. Common overlays & wizards: `add-questions-wizard.tsx`, `subject-importer-steps.tsx`
3. Shared telemetry & results: `game-header.tsx`, `results-screen-components.tsx`, `stats-screen.tsx`

### Step 3: Refactor Using the Translation Matrix
Consult `.agents/skills/hardcoded-styles-triage/references/token-map.md` and apply targeted replacements using `replace_file_content`:

| Hardcoded Pattern | Target Dynamic Semantic Token |
|---|---|
| `bg-[#07080a]` | `bg-card` |
| `bg-[#0d0e11]` | `bg-card` or `bg-secondary/40` |
| `bg-[#101115]`, `bg-[#111215]` | `bg-panel` |
| `bg-[#121318]/50` | `hover:bg-secondary/60` |
| `text-[#fecc17]`, `bg-[#fecc17]` | `text-primary`, `bg-primary` |
| `text-[#4ae176]`, `bg-[#4ae176]` | `text-primary`, `bg-primary` (or `text-emerald-400` for pure semantic status) |
| `text-[#a4acba]` | `text-muted-foreground` |
| `text-zinc-300` | `text-foreground` |
| `text-zinc-400`, `text-zinc-500` | `text-muted-foreground` |
| `text-white` | `text-foreground` |
| `text-black` (on primary badge) | `text-primary-foreground` |
| `border-zinc-700`, `border-zinc-800` | `border-border` |
| `hover:border-zinc-700/80` | `hover:border-primary/50` |
| `hover:bg-zinc-800/20` | `hover:bg-secondary/60` |
| `rgba(254, 204, 23, ...)` | `hsl(var(--primary)/...)` or `border-glow` |

### Step 4: Verify Zero Regressions
Ensure that the refactor did not break existing functionality or types:
```bash
# 1. Run full unit test suite (Must pass 100%)
pnpm test

# 2. Verify clean production build
pnpm build
```

### Step 5: Update Triage Ledger
Record the refactored files and count reductions in `.agents/triages/hardcoded-styles-registry.json`.

---

## 4. Ledger File Schema (`.agents/triages/hardcoded-styles-registry.json`)

```json
{
  "lastAudit": "2026-09-18T18:00:00Z",
  "totalRefactorsCompleted": 12,
  "history": [
    {
      "date": "2026-09-18",
      "component": "components/mold/subject/subject-importer-steps.tsx",
      "violationsRemoved": 42,
      "tokensApplied": ["bg-card", "bg-panel", "text-foreground", "text-muted-foreground", "text-primary", "border-primary"],
      "testsPassing": true
    }
  ]
}
```

---

## 5. Completion Checklist
- [ ] Automated scan completed.
- [ ] Target file refactored using semantic HSL tokens.
- [ ] No raw hex classes remaining in target file.
- [ ] `pnpm test` passes 100% with 0 failures.
- [ ] `pnpm build` compiles cleanly.
- [ ] Triage ledger updated.
