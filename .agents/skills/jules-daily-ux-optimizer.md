---
name: jules-daily-ux-optimizer
description: GLOBAL UX OPTIMIZATION SKILL. Daily agent skill that scans the codebase across subdirectories (home/, game/, achievement/, subject/, flashcard/), identifies UX improvement opportunities (shortcuts, intuitive tooltips, visual decluttering, feature bundling, color coding, and extensible delight), and implements non-breaking user experience enhancements. Deduplicates via .Jules/ux-registry.json, respects .Jules/palette.md learnings, and ensures 100% test suite compliance. Trigger whenever asked to "optimize user experience", "daily ux agent", "jules ux optimizer", "add UX shortcuts", "declutter UI", "improve tooltips", or "run daily UX pass".
allowed-tools:
  - run_command
  - view_file
  - replace_file_content
  - multi_replace_file_content
  - write_to_file
  - grep_search
  - list_dir
---

# Daily User Experience Optimization Agent Protocol (`jules-daily-ux-optimizer`)

An autonomous, self-learning agent protocol for daily user experience enhancement across the MOLD V2 codebase.

---

## 1. TRIGGER & SCOPE CONDITIONS

MUST be triggered whenever the user or system requests daily UX optimization, UI decluttering, tooltip enhancements, or shortcut additions.

---

## 2. DEDUPLICATION & LEDGER AUDIT

Before writing code:
1. Inspect `.Jules/ux-registry.json` using `view_file`.
2. Inspect `.Jules/palette.md` for historical design rules.
3. Verify the target feature is NOT already present in `ux-registry.json`.

---

## 3. 5-TIER UX TAXONOMY (OPEN-ENDED & EXTENSIBLE)

The priority taxonomy provides baseline guidance, but **the agent is NOT limited to these 5 categories**. The agent is encouraged to discover and implement ANY creative, non-breaking UX innovation (e.g. animation polish, drag-and-drop, export tools, offline badges, smart search):

1. **Tier 1: Quick Action Shortcuts**: One-tap quick import buttons, in-game option hotkeys (`[1-4]`), speedrun launchers (`[1-7]`), parameter reset presets (Default/Mastery/Reset), and global keyboard bindings (`/`, `Esc`).
2. **Tier 2: Intuitive Tooltips & Micro-Labels**: Descriptive desktop `title` tooltips, full-sentence `aria-label`s on acronym buttons, `aria-busy` loading indicators.
3. **Tier 3: Visual Decluttering & Hierarchy**: Collapsible setup panels, hierarchy spacing, removing visual noise, and progressive disclosure.
4. **Tier 4: Smart Feature Bundling**: Logical grouping of challenge vs learning modes, cohesive stat tickers, and category search filters.
5. **Tier 5: Accessible Color Coding & WCAG Ergonomics**: Tailwind HSL semantic design tokens (`bg-background`, `text-primary`), focus rings (`focus-visible`), and minimum 44px–48px mobile touch targets.
6. **Extensible Category**: Any additional non-breaking UX enhancement that adds peace of mind, speed, or visual delight.

---

## 4. MODULAR DIRECTORY MAP & QUALITY STANDARDS

Always target components in their respective subdirectories:
- `components/mold/home/`: `hero-header.tsx`, `action-hub.tsx`, `mode-selector.tsx`, `setup-panel.tsx`, `setup-panel-blocks.tsx`, `performance-table.tsx`, `bottom-mobile-nav.tsx`, `add-questions-wizard.tsx`
- `components/mold/game/`: `game-runner.tsx`, `game-header.tsx`, `question-card-builder.tsx`, `question-card-components.tsx`, `question-card-blocks.tsx`, `game-footer.tsx`, `results-screen.tsx`, `results-screen-components.tsx`
- `components/mold/achievement/`: `achievement-gallery.tsx`, `achievement-toast.tsx`
- `components/mold/subject/`: `subject-importer.tsx`, `subject-selector.tsx`, `encyclopedia-overlay.tsx`
- `components/mold/flashcard/`: `flashcard-screen.tsx`

---

## 5. IMPLEMENTATION & VERIFICATION

1. **Implement UI Changes**: Edit target files using `replace_file_content` or `multi_replace_file_content`. Ensure zero breaking changes to data contracts (`GameState`, `RunRecord`, `FullSubjectData`).
2. **Execute Unit Tests**:
   ```bash
   pnpm test
   ```
   Must pass with 100% success rate (`fail 0`).

3. **Update Ledger Files**:
   - Append completed feature record to `.Jules/ux-registry.json` and increment `totalFeaturesImplemented`.
   - Append operational learning to `.Jules/palette.md`.

---

## 6. COMPLETION REPORT

Output a structured summary detailing:
- Implemented UX features & category.
- Components touched.
- Test verification results.
- Ledger update confirmation.
