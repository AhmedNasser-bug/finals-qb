# Component Registry

This document provides an automated component registry that outlines the exact properties, slots, state dependencies, and performance characteristics of each UI module in the frontend repository.

## UI Modules

### `components/mold/achievement-gallery.tsx`
- **Exports:**
  - `export function AchievementGallery({ onClose }: { onClose: () => void }) {`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/achievement-toast.tsx`
- **Exports:**
  - `export function useAchievementToast() {`
  - `export function AchievementToastContainer({ toasts, onDismiss }: AchievementToastContainerProps) {`
- **Props/Interfaces:**
  - **AchievementToastContainerProps**
    - `toasts: ToastItem[]`
    - `onDismiss: (id: string) => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/action-hub.tsx`
- **Exports:**
  - `export function ActionHub({`
- **Props/Interfaces:**
  - **ActionHubProps**
    - `onInitialize: () => void`
    - `onEncyclopedia: () => void`
    - `selectedMode: GameModeId`
    - `disabled?: boolean`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/encyclopedia-overlay.tsx`
- **Exports:**
  - `export function EncyclopediaOverlay({ subject, onClose }: EncyclopediaOverlayProps) {`
- **Props/Interfaces:**
  - **EncyclopediaOverlayProps**
    - `subject: FullSubjectData`
    - `onClose: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/flashcard-screen.tsx`
- **Exports:**
  - `export function FlashcardScreen({ flashcards, onComplete, onReturnHome }: FlashcardScreenProps) {`
- **Props/Interfaces:**
  - **FlashcardScreenProps**
    - `flashcards: Flashcard[]`
    - `onComplete: () => void`
    - `onReturnHome: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/footer.tsx`
- **Exports:**
  - `export function Footer({ rightText = "OFFLINE FIRST", className }: FooterProps) {`
- **Props/Interfaces:**
  - **FooterProps**
    - `rightText?: string`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-error-boundary.tsx`
- **Exports:**
  - *None found or using default export.*
- **Props/Interfaces:**
  - **Props**
    - `onReturnHome: () => void`
    - `children: ReactNode`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-footer.tsx`
- **Exports:**
  - `export function GameFooter({ onHintRequest }: { onHintRequest: () => void }) {`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-header.tsx`
- **Exports:**
  - `export function GameHeader({ onForfeit }: { onForfeit: () => void }) {`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-icons.tsx`
- **Exports:**
  - `export function BoltIcon({ className }: { className?: string }) {`
  - `export function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {`
  - `export function CheckIcon({ className }: { className?: string }) {`
  - `export function XIcon({ className }: { className?: string }) {`
  - `export function LightbulbIcon({ className }: { className?: string }) {`
  - `export function CheckCircleIcon({ className }: { className?: string }) {`
  - `export function RadioIcon({ className }: { className?: string }) {`
  - `export function SkipIcon({ className }: { className?: string }) {`
  - `export function ChevronRightIcon({ className }: { className?: string }) {`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-runner.tsx`
- **Exports:**
  - `export function GameRunner({ config, subject, runs, onReturnHome, onRunComplete, onRunSaved }: GameRunnerProps) {`
- **Props/Interfaces:**
  - **GameRunnerProps**
    - `config: GameConfig`
    - `subject: FullSubjectData`
    - `runs: RunRecord[]`
    - `onReturnHome: () => void`
    - `onRunComplete?: () => void`
    - `onRunSaved?: (run: RunRecord) => void`
  - **InnerProps**
    - `onReturnHome: () => void`
    - `onRunComplete?: () => void`
    - `onRunSaved?: (run: RunRecord) => void`
    - `config: GameConfig`
    - `runs: RunRecord[]`
    - `showUnlocks: (unlocked: Achievement[]) => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/game-stat-cell.tsx`
- **Exports:**
  - `export function StatCell({`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/hero-header.tsx`
- **Exports:**
  - `export function HeroHeader({ subject, achievements, onTrophyClick, className }: HeroHeaderProps) {`
- **Props/Interfaces:**
  - **HeroHeaderProps**
    - `subject: SubjectData`
    - `achievements: Achievement[]`
    - `onTrophyClick?: () => void`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/home-screen.tsx`
- **Exports:**
  - `export function HomeScreen({`
- **Props/Interfaces:**
  - **HomeScreenProps**
    - `activeSubject: FullSubjectData`
    - `allSubjectIds: string[]`
    - `onAddSubject: (subject: FullSubjectData) => void`
    - `onChangeSubject: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/mermaid-diagram.tsx`
- **Exports:**
  - `export function MermaidDiagram({ chart, id, className }: MermaidDiagramProps) {`
- **Props/Interfaces:**
  - **MermaidDiagramProps**
    - `chart: string`
    - `id: string`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/mode-selector.tsx`
- **Exports:**
  - `export function ModeSelector({ selected, onSelect, className }: ModeSelectorProps) {`
- **Props/Interfaces:**
  - **ModeSelectorProps**
    - `selected: GameModeId`
    - `onSelect: (id: GameModeId) => void`
    - `className?: string`
  - **ModeGroupProps**
    - `label: string`
    - `modes: GameMode[]`
    - `selected: GameModeId`
    - `onSelect: (id: GameModeId) => void`
    - `accent: "danger" | "success"`
  - **ModeCardProps**
    - `mode: GameMode`
    - `icon: React.ReactNode`
    - `isSelected: boolean`
    - `onSelect: (id: GameModeId) => void`
    - `selectedClass: string`
    - `accentClass: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/onboarding-screen.tsx`
- **Exports:**
  - `export function OnboardingScreen({ onSubjectAdded }: OnboardingScreenProps) {`
- **Props/Interfaces:**
  - **OnboardingScreenProps**
    - `onSubjectAdded: (subject: FullSubjectData) => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/performance-table.tsx`
- **Exports:**
  - `export function PerformanceTable({ runs, stats, className }: PerformanceTableProps) {`
- **Props/Interfaces:**
  - **PerformanceTableProps**
    - `runs: RunRecord[]`
    - `stats: AggregateStats`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/question-card.tsx`
- **Exports:**
  - `export function QuestionCard({`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/results-screen.tsx`
- **Exports:**
  - `export function ResultsScreen({ onReturnHome, onPlayAgain }: ResultsScreenProps) {`
- **Props/Interfaces:**
  - **ResultsScreenProps**
    - `onReturnHome: () => void`
    - `onPlayAgain: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/rich-text.tsx`
- **Exports:**
  - `export function parseRichTextParts(content: string) {`
  - `export function RichText({ content, className, id = "q" }: RichTextProps) {`
- **Props/Interfaces:**
  - **RichTextProps**
    - `content: string`
    - `className?: string`
    - `id?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/setup-panel.tsx`
- **Exports:**
  - `export function SetupPanel({`
- **Props/Interfaces:**
  - **SetupPanelProps**
    - `config: SetupConfig`
    - `onChange: (patch: Partial<SetupConfig>) => void`
    - `selectedMode: GameModeId`
    - `categories: CategoryData[]`
    - `className?: string`
  - **CategoryTileProps**
    - `id: string | null`
    - `name: string`
    - `questionCount: number`
    - `selected: boolean`
    - `onSelect: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/share-modal.tsx`
- **Exports:**
  - `export function ShareModal({ subject, onClose }: ShareModalProps) {`
- **Props/Interfaces:**
  - **ShareModalProps**
    - `subject: FullSubjectData`
    - `onClose: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/share-receiver.tsx`
- **Exports:**
  - `export function ShareReceiver({ payload, onAccept, onDecline }: ShareReceiverProps) {`
- **Props/Interfaces:**
  - **ShareReceiverProps**
    - `payload: string`
    - `onAccept: (subject: FullSubjectData) => void`
    - `onDecline: () => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/streak-ascent.tsx`
- **Exports:**
  - `export const STREAK_TIERS: StreakTier[] = [`
  - `export function getStreakTier(streak: number): StreakTier {`
  - `export function getNextMilestone(streak: number): number | null {`
  - `export function StreakAscent({ currentStreak, bestStreak, isAtRisk = false, className }: StreakAscentProps) {`
- **Props/Interfaces:**
  - **StreakAscentProps**
    - `currentStreak: number`
    - `bestStreak: number`
    - `isAtRisk?: boolean // If true, make the flame flicker more intensely/look fragile`
    - `className?: string`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/subject-importer.tsx`
- **Exports:**
  - `export function SubjectImporter({ onImport, onCancel, existingIds = [] }: SubjectImporterProps) {`
- **Props/Interfaces:**
  - **SubjectImporterProps**
    - `onImport: (subject: FullSubjectData) => void`
    - `onCancel: () => void`
    - `existingIds?: string[]`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/mold/subject-selector.tsx`
- **Exports:**
  - `export function SubjectSelector({`
- **Props/Interfaces:**
  - **SubjectSelectorProps**
    - `subjects: FullSubjectData[]`
    - `onSelect: (subject: FullSubjectData) => void`
    - `onAddSubject: (subject: FullSubjectData) => void`
    - `onRemoveSubject: (id: string) => void`
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Managed locally with `useState`.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/theme-provider.tsx`
- **Exports:**
  - `export function ThemeProvider({ children, ...props }: ThemeProviderProps) {`
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/ui/button.tsx`
- **Exports:**
  - *None found or using default export.*
- **Props/Interfaces:**
  - **ButtonProps**
    - *Extends other interfaces or empty.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/ui/card.tsx`
- **Exports:**
  - *None found or using default export.*
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

### `components/ui/input.tsx`
- **Exports:**
  - *None found or using default export.*
- **Props/Interfaces:**
  - *None explicitly defined.*
- **Client-Side Lazy-Loading Logic:** Uses static imports and hydration pipelines. Lazy-loading logic with `next/dynamic` is not utilized.
- **State Dependencies:** Stateless component.
- **Performance Characteristics:** Highly cohesive module ensuring isolated re-renders.
- **Edge-case Input Handling & Validation:** Validated dynamically with strict null checking. Forms should handle missing/invalid properties with error boundaries or fallback elements.

## Architecture Notes

### Content Hydration & Asset Delivery
The application relies heavily on `localStorage` and `sessionStorage` for data persistence and state sharing (e.g., passing active subjects). Asset delivery logic leverages Turbopack.

### Routing States
Root page handles active study session. Sub-routing exists for subject selection. Navigation state transitions depend entirely on client-side routing logic rather than traditional SSR state injection.
