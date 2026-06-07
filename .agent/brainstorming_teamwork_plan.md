# Teamwork Plan: Human-Agent Cooperative Refactoring & Brainstorming

This document outlines the structured 1-week brainstorming and teamwork preview strategy. The objective is to cooperatively transition MOLD V2's architecture from a feature-based structure to a layer-based Clean Architecture, increasing our maintainability rating from 7.0 to 9.5+.

---

## 1. Weekly Schedule: Iteration Breakdown

To ensure high-fidelity delivery and avoid regression, the refactoring roadmap is divided into daily sprints:

```
[Day 1-2: Brainstorming & Auditing] ──> [Day 3-4: Teamwork Preview] ──> [Day 5-6: Refactoring Cycle] ──> [Day 7: Evaluation]
```

| phase / Day | Activity | Team Allocation | Deliverables |
| :--- | :--- | :--- | :--- |
| **Day 1: Audit & Align** | Identify files violating the 300-line limit and analyze state-UI coupling. | Human developer + Scanner Agent | Audit Log of Coupled Modules |
| **Day 2: Brainstorming** | Define clean interfaces for routing, storage, and AI service boundaries. | Interactive Socratic Chat | API Port Specifications (`src/application/ports`) |
| **Day 3: Teamwork Setup** | Configure specialized agent pools in the `.agents` registry. | Human Lead + Orchestrator | Updated agent configurations |
| **Day 4: Teamwork Preview** | Run dry-run refactors (no code modifications) and review diff proposals. | Agent Team (Scanner + Architect) | Proposed Diffs & Dependency Charts |
| **Day 5-6: Refactor Run** | Execute layer-based separation and modularize large components. | Architect Agent + Human verification | Refactored Codebase (Clean Layers) |
| **Day 7: Validation** | Execute automated test suites and calculate final maintainability ratings. | Full Team | Passing tests, final code audit report |

---

## 2. Phase Details: Human-in-the-Loop & Teamwork Previews

### A. The Brainstorming Session (Days 1–2)
During this phase, the human developer sets the architectural constraints, and the agent scaffolds the interfaces. 
- **Focus:** Isolating core application logic (`lib/game/game-engine.tsx`) from the Next.js router and web storage.
- **Port Definition:** Defining the boundaries for:
  1. `KeyValueStore` (to abstract local storage vs. React Native MMKV).
  2. `AppRouter` (to abstract Next.js router vs. React Native navigation).

### B. Agent Teamwork Preview (Days 3–4)
We run an **Agent Teamwork Preview** (using the `self` subagent or similar configurations) to model the refactoring impacts before mutating the main branch.
- **Protocol:**
  1. **Scanner** generates a list of files to modify.
  2. **Architect** clones the workspace in a shared scratch directory.
  3. **Architect** generates dry-run refactored components.
  4. **Orchestrator** generates a visual dependency chart (Mermaid format) and a proposed diff report for the human reviewer.
  5. Human reviews the proposed changes and signs off on the execution.

---

## 3. Evaluation Criteria for Agentic Tasks

To prevent agents from introducing technical debt during refactoring, we evaluate all automated changes against the following scorecard:

| Criterion | Evaluation Metric | Tolerance / Target |
| :--- | :--- | :--- |
| **Cognitive Load** | Presentation components must not exceed 300 lines of code. | Max 300 lines per file (100% compliance) |
| **Encapsulation** | UI components must not import from `infrastructure` directly. | Zero direct imports (compile-time gate) |
| **State Decoupling** | Screen components must use React context or decoupled ports. | No inline logic for storage or routing. |
| **Idempotency** | Repeating the refactor must result in the same output structure. | 100% identical AST (Abstract Syntax Tree) |
| **Test Stability** | The full test suite must pass after the refactoring. | 136/136 tests passing (`pnpm test`) |

---

## 4. Team Roles and Responsibilities

- **Human Developer (Architect/Reviewer):** Sets policies, reviews proposed diffs, approves nightly PRs, and conducts Socratic guidance.
- **Validation Agent (Scanner):** Enforces AST constraints, checks file length policies, and blocks build-breaking PRs.
- **Transformation Agent (Architect):** Deconstructs large files (like `add-questions-wizard.tsx` and `subject-importer-steps.tsx`) into decoupled, atomic screens.
- **Orchestration Agent (DevOps Lead):** Coordinates git branching, handles merge conflicts, runs test suites, and calculates the CE Score.
