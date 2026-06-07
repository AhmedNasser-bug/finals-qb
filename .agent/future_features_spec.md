# Technical Specification: Future Features & Core Upgrades

This document outlines the detailed technical specifications and architectures for the next generation of MOLD V2 features. These upgrades focus on flexibility, user personalization, and an offline-first mobile architecture.

---

## 1. Custom Game Mode Creation (Engine Level)

To allow users to create and tweak custom offline game modes, we decouple the game rules from the UI layouts using the **Strategy Pattern**.

### Proposed Architecture
We will replace the hardcoded `GameModeId` string checks with a registerable `GameModeStrategy` interface.

```typescript
export interface GameModeStrategy {
  id: string;
  label: string;
  description: string;
  tag: string;
  
  // Rule Hooks
  timeLimit: number;          // 0 = untimed, >0 = seconds
  perQuestionTime: (currentIndex: number) => number; // per-question countdown
  livesAllowed: number;       // 0 = infinite, >0 = lives limit
  hintsAllowed: boolean;
  
  // Question Pool Selector
  filterQuestions: (questions: Question[], config: GameConfig) => Question[];
  
  // Custom Scoring/Grade Logic
  calculateScore: (correct: number, wrong: number) => number;
}
```

- **User Customization UI:** Users can define a new mode via a JSON editor or a simple form (e.g. Setting: "Mode Name", "10 seconds per question", "3 lives", "Easy questions only").
- **State Integration:** The custom mode is saved in the user's local subject file under `config.customModes` and loaded dynamically into the `GAME_MODES` registry.

---

## 2. Bring-Your-Own-Key (BYOK) AI Pipeline

We specify a separate, secure client-side AI pipeline that enables users to input their own API keys (OpenAI / Gemini / Anthropic) to generate and modify subjects and receive in-game tutoring.

### Proposed Architecture

```
[User API Key (Stored in LocalStorage/MMKV)]
                       │
                       ▼
    [Client-side prompt-builder.ts]
                       │ (Validates key & constructs Socratic instructions)
                       ▼
       [Direct API Calls (No Server Proxy)]
                       │
                       ▼
           [FullSubjectData Output]
                       │
                       ▼
   [autoFixSubjectData / Parser Validation]
                       │
                       ▼
              [Active Subject]
```

### Prompt Engineering & Tutoring Pipeline
1. **Subject Generator:** Builds standard `FullSubjectData` JSON files conforming strictly to the LearnLM pedagogical standards (Socratic nudges, no LaTeX, clean explanations).
2. **Subject Modifier:** Allows users to prompt the AI to "add 5 hard questions about DFA minimization" or "convert true/false questions to multiple choice".
3. **In-game Assistant:** Provides Socratic tutoring when the user requests help on a specific question, using the question, the user's selected option, and the correct answer to generate a targeted hint.

---

## 3. Custom Milestone Creation

Currently, milestones are hardcoded based on run history. We will introduce a system for users to create custom milestone rules.

### Specification
Milestones will be evaluated against aggregate runs using a simple rule engine:

```typescript
export interface CustomMilestone {
  id: string;
  title: string;
  description: string;
  rule: {
    metric: "totalRuns" | "averageScore" | "bestStreak" | "totalTime";
    operator: "gte" | "lte" | "eq";
    value: number;
  };
  unlockedAt: string | null;
}
```

- **Evaluation Loop:** On every session completion, the `StatsProvider` iterates over `customMilestones` and evaluates the rules against the computed `AggregateStats`.

---

## 4. Machine Learning & Predictive Statistics

We will upgrade the statistics engine to provide predictive analytics and spaced repetition metrics.

### Proposed ML Features
1. **Response Time Regression:** Use a simple linear regression algorithm (implemented in pure TypeScript to maintain offline capability) to map response time trend lines. This identifies if the user's recall speed is improving over time.
2. **Spaced Repetition System (SRS) Integration:** Use the **SuperMemo-2 (SM-2)** algorithm to predict when a user is likely to forget key terms in the flashcards/terminology modules, placing those cards in their daily review queue.
   - *SM-2 Formula:* Calculate interval ($I$) and ease factor ($EF$) based on user response quality ($q$, rated 0-5):
     $$EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))$$

---

## 5. User DB & Authentication Layer (Offline-First Sync)

To preserve the offline-first USP while allowing cross-device synchronization, we design a hybrid database model.

### Storage & Sync Flow
- **Offline Storage:** Local data resides in **IndexedDB** (web) or **MMKV / SQLite** (mobile).
- **Authentication:** Use Clerk (for web authentication) or simple JWT-based auth (for mobile).
- **Sync Protocol:** On login or reconnection, the client compares run record timestamps.
  - A simple conflicts-resolution algorithm resolves changes (e.g. merging runs by UUID and keeping the highest best-streak records).

---

## 6. Offline-First React Native Mobile Client

To convert the codebase into a mobile app, the platform-agnostic core is packaged as a shared library.

### React Native Migration Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Shared Domain Layer                  │
│   (Types, Grade Formulas, Spaced Repetition Algorithms)  │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                 Shared Application Layer               │
│      (Reducers, Stats logic, Socratic Prompt Builders)  │
└────────────────────────────────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Next.js Web Infra       │ │ React Native Mobile     │
│ - LocalStorage Adapter  │ │ - MMKV Storage Adapter  │
│ - Web DOM Logger        │ │ - Native File System    │
│ - Web DOM Purify        │ │ - React Native Alert UI │
└─────────────────────────┘ └─────────────────────────┘
             │                           │
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Next.js Tailwind UI     │ │ Expo / React Native UI  │
│ (React 19 Components)   │ │ (Native Components)     │
└─────────────────────────┘ └─────────────────────────┘
```

- **Expo Integration:** We use Expo for fast cross-platform deployment.
- **MMKV Storage:** MMKV replaces `localStorage` for high-performance, synchronous data operations on native devices.
- **Tailwind Native:** Use `nativewind` to reuse Tailwind utility classes inside React Native components.
