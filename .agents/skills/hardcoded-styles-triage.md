---
name: hardcoded-styles-triage
description: Systematically scans, audits, triages, and refactors hardcoded colors, arbitrary hex classes, and non-semantic Tailwind styles across the codebase to ensure 100% compliance with dynamic theme changing and dark/light modes. Use whenever asked to "triage hardcoded styles", "refactor styles", "remove hardcoded colors", "fix theme styling", "audit styling", "theme compatibility pass", "make styles dynamic", or "run daily styles pass".
allowed-tools:
  - run_command
  - view_file
  - replace_file_content
  - multi_replace_file_content
  - write_to_file
  - grep_search
  - list_dir
---

# Hardcoded Styles Triage & Refactor Skill (`hardcoded-styles-triage`)

An autonomous, precision engineering protocol to search, isolate, and refactor hardcoded styling patterns across the MOLD V2 codebase into dynamic HSL semantic design tokens.

---

## 1. TRIGGER & SCOPE CONDITIONS

Trigger this skill whenever:
- The user or a daily sleeper agent requests styling triage, theme audits, or hardcoded color elimination.
- A new component or feature has introduced raw hex codes (`#[0-9a-fA-F]{3,8}`) or static color scales (`zinc-*`, `amber-*`, `emerald-*`).
- Testing theme switching reveals visual clashes in alternative themes (e.g. Cyber Emerald, Crimson Dracula, Nordic Frost) or Light Mode.

---

## 2. AUTOMATED SCAN & TRIAGE PROTOCOL

Execute the bundled triage scanner to discover all offending files and sort by violation density:
```bash
python .agents/skills/hardcoded-styles-triage/scripts/triage_styles.py --min 1
```

---

## 3. TRANSLATION MATRIX TO DYNAMIC SEMANTIC TOKENS

| Hardcoded Pattern | Target Dynamic Semantic Token | Role / Purpose |
|---|---|---|
| `bg-[#07080a]` | `bg-card` | Base input wells, cards, code previews |
| `bg-[#0d0e11]` | `bg-card` or `bg-secondary/40` | Header top bars, code containers |
| `bg-[#101115]`, `bg-[#111215]` | `bg-panel` | Elevated cards, sidebars, modals |
| `bg-[#121318]/50` | `hover:bg-secondary/60` | Interactive card hover states |
| `text-[#fecc17]`, `bg-[#fecc17]` | `text-primary`, `bg-primary` | Dynamic theme accent (NOT hardcoded amber!) |
| `text-[#4ae176]`, `bg-[#4ae176]` | `text-primary`, `bg-primary` | Primary accent / step indicator |
| `text-[#a4acba]` | `text-muted-foreground` | Subtitles, secondary text |
| `text-zinc-300` | `text-foreground` | Readable body text |
| `text-zinc-400`, `text-zinc-500` | `text-muted-foreground` | Captions, hints, micro labels |
| `text-white` | `text-foreground` | General text, headings (protects Light Mode) |
| `text-black` (on primary badge) | `text-primary-foreground` | High contrast on primary accents |
| `border-zinc-700`, `border-zinc-800` | `border-border` | Default panel borders |
| `hover:border-zinc-700/80` | `hover:border-primary/50` | Interactive card hover borders |
| `hover:bg-zinc-800/20` | `hover:bg-secondary/60` | Interactive item hover |
| `rgba(254, 204, 23, ...)` | `hsl(var(--primary)/...)` or `border-glow` | Dynamic theme-colored glow |

---

## 4. VERIFICATION & QUALITY STANDARDS

1. **Strict Zero Breakage**: Never break existing data contracts (`GameState`, `RunRecord`, `FullSubjectData`, `Question`).
2. **Execute Unit Tests**:
   ```bash
   pnpm test
   ```
   Must pass with 100% success rate (0 failures).
3. **Execute Production Build**:
   ```bash
   pnpm build
   ```
   Must compile cleanly with zero TypeScript or Turbopack errors.
4. **Update Triage Registry**:
   Log refactored components into `.agents/triages/hardcoded-styles-registry.json`.
