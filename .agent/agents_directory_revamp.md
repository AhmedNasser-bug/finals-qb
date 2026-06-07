# Technical Specification: Agent Directory Revamp (.agent / .agents)

This document specifies the upgrade roadmap for the workspace `.agent` configuration and single-agent systems. The objective is to make the workspace instruction set tailored, future-proof, and resilient against coding rot.

---

## 1. Upgrade Plan: Core System Prompts

To align future agent runs with Clean Architecture and the Azure Well-Architected Framework (WAF), we update the `.agent/pedagogical_mastery.agent` instructions.

### New Rules to Add
1. **The 300-Line Code Rule:**
   - Any agent modifying a Presentation UI component must enforce a hard limit of **300 lines of code** per file. If a change causes a file to exceed this, the agent must automatically refactor the component into a Compound Component structure.
2. **Layer-Based Import Auditing:**
   - Agents must audit file imports. Presentation UI components are strictly prohibited from importing files directly from the `infrastructure/` directory. Inter-layer communication must occur via ports (`src/application/ports`) or pure entity interfaces (`src/domain`).
3. **Strict Tailwind Variables:**
   - Hardcoded values (such as color codes like `bg-[#131313]` or margins like `m-[7px]`) are forbidden. Agents must map styling configurations to standard CSS variables in `app/globals.css` and use semantic Tailwind classes.
4. **Accuracy Denominators:**
   - Agents must use `calculateAccuracy(score, wrongAnswers)` instead of dividing by `currentIndex` to prevent math errors.

---

## 2. Automated Validation script (`audit_code_hygiene.mjs`)

To enforce these policies automatically during development and CI/CD pipelines, we will add an automated auditing script to the `.agent/skills/` directory.

### [NEW] `lib/utils/audit-hygiene.ts` (Core logic)
This script scans modified files for:
- File length (>300 lines for `.tsx` files).
- Layer-based import violations (e.g. `import ... from "@/src/infrastructure"` inside `presentation/`).
- Direct DOM/Web storage APIs inside domain logic.

---

## 3. Revamped Agent Instructions Structure

We will reorganize the `.agent/` directory to contain:

```
.agent/
  ├── README.md                    # Overview of Agent rules and policies
  ├── pedagogical_mastery.agent    # The core LearnLM prompt configurations
  │
  ├── skills/                      # Specialized agent actions (reusable commands)
  │     ├── a11y_audit.md          # Accessibility check instructions
  │     ├── audit_code_hygiene.md  # Clean architecture and line-limit linting
  │     └── self_annealing.md      # Self-annealing documentation sync
  │
  └── workflows/                   # Pipelines
        ├── run_tests.md           # Instructions to run test suites safely
        └── self_annealing.md      # Routine document synchronization checks
```

### Self-Annealing Syncs (Rule 26)
Every 5 turns, the agent automatically executes the `self_annealing` workflow. This workflow scans `AGENTS.md` and the `.agent/` directory, checks if code changes introduced new files, updates the file map, and prunes old, obsolete rules to prevent instruction bloat.
