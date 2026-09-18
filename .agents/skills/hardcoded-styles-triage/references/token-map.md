# MOLD V2 Design System Token & Refactor Translation Map

This reference document defines the translation matrix from legacy hardcoded hex codes, static Tailwind scales, and literal color classes to dynamic, theme-responsive HSL CSS variable semantic tokens.

---

## 1. Core Principles

1. **Strict Semantic Variables**: All colors must adapt to the 7 registered themes (`amberPhosphor`, `cyberEmerald`, `midnightSapphire`, `crimsonDracula`, `solarSepia`, `synthwaveNeon`, `nordicFrost`) and the light/dark modes.
2. **No Raw Hex Codes in Component ClassNames**: Never use `bg-[#...]`, `text-[#...]`, `border-[#...]`, or `ring-[#...]`.
3. **No Literal `text-white` or `bg-black` in Layouts**:
   - `text-white` fails in Light Mode. Use `text-foreground` or `text-primary-foreground` (for contrast on primary buttons).
   - `bg-black` fails in Light Mode. Use `bg-background`, `bg-card`, or `bg-panel`.
4. **No Static Color Scales for Themed Elements**:
   - Avoid `text-zinc-400`, `text-zinc-500`, `border-zinc-800`.
   - Use `text-muted-foreground` and `border-border`.

---

## 2. Direct Translation Matrix

| Legacy / Hardcoded Pattern | Semantic Design Token | Role / Context |
|---|---|---|
| `bg-[#07080a]` | `bg-card` | Base input wells, code blocks, cards |
| `bg-[#0d0e11]` | `bg-card` / `bg-secondary/40` | Header top bars, code containers |
| `bg-[#101115]`, `bg-[#111215]` | `bg-panel` | Elevated cards, sidebars, modal bodies |
| `bg-[#121318]/50`, `bg-[#121318]` | `bg-secondary/60` | Interactive card hover states |
| `bg-[#1b1b1f]`, `bg-[#1c1b1b]` | `bg-panel` / `bg-secondary` | Elevated compact buttons |
| `bg-[#2a2a2a]` | `bg-secondary` | Selected option wells |
| `text-[#fecc17]`, `bg-[#fecc17]` | `text-primary`, `bg-primary` | Dynamic theme accent (NOT always amber!) |
| `border-[#fecc17]` | `border-primary` | Active selection border |
| `text-[#4ae176]`, `bg-[#4ae176]` | `text-primary` / `bg-primary` | Primary accent or step labels |
| `text-[#a4acba]` | `text-muted-foreground` | Subtitle descriptions, secondary info |
| `text-zinc-300` | `text-foreground` | Readable body prose |
| `text-zinc-400`, `text-zinc-500` | `text-muted-foreground` | Micro labels, hints, captions |
| `placeholder:text-zinc-600` | `placeholder:text-muted-foreground/60` | Text input placeholders |
| `border-zinc-700`, `border-zinc-800` | `border-border` | Default card borders |
| `hover:border-zinc-700/80` | `hover:border-primary/50` | Interactive card hover borders |
| `hover:bg-zinc-800/20` | `hover:bg-secondary/60` | Interactive item hover |
| `text-white` | `text-foreground` | General text, headings |
| `text-black` (on primary badge) | `text-primary-foreground` | High-contrast text on primary background |
| `bg-black/30`, `bg-black/40` | `bg-secondary/30` | Semi-transparent nested panels |
| `border-glow-success` | `border-glow` | Theme glow |
| `shadow-[0_0_..._rgba(254,204,23,...)]` | `shadow-[0_0_..._hsl(var(--primary)/...)]` | Theme-reactive glow shadow |

---

## 3. Registered Theme Tokens in `lib/themes/theme-types.ts`

Each theme defines:
- `background`: Page base background (`bg-background`)
- `foreground`: Primary text color (`text-foreground`)
- `card`: Surface background for cards/wells (`bg-card`)
- `cardForeground`: Text on card surfaces (`text-card-foreground`)
- `popover`: Flyouts, tooltips, popovers (`bg-popover`)
- `popoverForeground`: Text inside popovers (`text-popover-foreground`)
- `primary`: Active accent color (`bg-primary`, `text-primary`, `border-primary`)
- `primaryForeground`: Text color when placed over primary accent (`text-primary-foreground`)
- `secondary`: Subtle background for chips/badges (`bg-secondary`, `text-secondary`)
- `muted`: Subdued elements (`bg-muted`)
- `mutedForeground`: Subdued labels, captions, metadata (`text-muted-foreground`)
- `accent`: Highlights (`bg-accent`, `text-accent`)
- `destructive`: Error states, danger buttons (`bg-destructive`, `text-destructive`, `border-destructive`)
- `border`: All borders (`border-border`)
- `ring`: Focus rings (`ring-ring`, `focus-ring`)
