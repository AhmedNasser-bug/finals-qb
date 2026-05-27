---
name: pr-triage-release-cleanup
description: >-
  Standardized agent skill for pull request triage, release orchestration, and jules remote session context analysis & cleanup. Includes Vercel status check overrides, categorized .Jules log rules, and remote session pruning.
---

# Pull Request Triage, Release Orchestration, and Session Cleanup

## Overview

This skill enables the agent to audit, classify, group, and merge large-scale pull requests, resolve merge conflicts from outdated base commits (such as updates to `.Jules/palette.md` and component files), bypass Vercel deployment status checks via local administrative overrides, and prune completed `jules` CLI remote tracking sessions.

It ensures that standard guidelines for security (SSR XSS), accessibility (A11y), logging (PII), multi-tenant builds, and testing are preserved during release integration.

## Dependencies

- **Administrative Git Privileges:** Necessary to perform direct pushes bypassing UI merge blocks.
- **GitHub MCP Server or CLI:** Authenticated to manage pull requests and issues.
- **Jules CLI:** Globally available to list, update, and close remote tracking sessions.
- **Node.js Environment:** Node v20+ to run local test suites (`test-runner.mjs`).

## Quick Start

To initiate this skill, trigger it with:

```text
Run the PR triage and session cleanup skill to categorize open PRs, merge safe changes, resolve base conflicts, and prune finished Jules CLI sessions.
```

---

## Workflow

### 1. Preparation & Remote Context Gathering

#### 1.1. Automated Repository Scanning
- Inspect remote branches and active git commit trees:
  ```bash
  python "scratch/collect_context.py"
  ```
- *Fallback:* If the Python script is missing, run:
  ```bash
  git branch -r
  git log -n 10 --oneline
  ```

#### 1.2. Fetch Jules CLI Session List
- Run the remote session list command to view VM contexts:
  ```bash
  jules remote list --session
  ```
- Map active and completed session IDs directly to their corresponding pull request numbers.

---

### 2. Classification & Duplicate Triage

#### 2.1. Close Already Integrated PRs
- Locate PRs that are already merged or implemented on `main`. Close them with the message:
  > *"Closing this pull request as these changes are already integrated and fully functional on the main branch. Thank you!"*

#### 2.2. Filter & Consolidate Redundancies
- When multiple PRs address the same issue, merge only the most robust version and close the others.
- **Groupings:**
  *   **Group A (SSR XSS):** Merge the version utilizing `isomorphic-dompurify` uniformly across server and client render loops.
  *   **Group B (Logging PII):** Merge the version using strict, declarative capture-groups in `lib/logger.ts` to keep JSON logs valid.
  *   **Group C (Focus & A11y):** Merge the version with proper focus rings (`focus-visible`) and descriptive announcements (`role="status"`).

---

### 3. Outdated Base Branch Conflict Resolution

When merging branches built on outdated base commits, conflicts may occur in central documentation (`AGENTS.md`, `.Jules/palette.md`) or UI files:

1. **Local Working Branch:**
   ```bash
   git checkout -b temp-workflow-merge
   ```
2. **Sequential Merging:** Merge feature branches one by one.
3. **Conflict Guidelines:**
   - **For `.Jules/palette.md`:** Always combine incoming learning blocks from both branches. Never overwrite historical learnings.
   - **For Component UI accessibility:** Retain descriptive `aria-label` elements and focus rings. Never simplify or omit accessibility structures.
   - **For Untracked Files:** Stash or clean conflicting local files before proceeding with the merge.

---

### 4. Integration, Testing, & Vercel Bypass

#### 4.1. Local Test Verification
- Run the centralized test runner suite before pushing:
  ```bash
  node --experimental-strip-types --import ./test-runner.mjs --test lib/accuracy.test.ts lib/crypto-utils.test.ts lib/mold-types.test.ts lib/subject-persistence.test.ts
  ```
- **Validation Criteria:** 32/32 tests must pass with `fail 0`.

#### 4.2. Vercel Status Check Override (Administrative Bypass)
- **The Problem:** Merges on `main` may be blocked in the GitHub UI due to missing status check updates (e.g. mismatched Vercel deployment names like `Production – finals-qb` vs. actual posted checks like `Vercel – Production`).
- **The Fix:**
  1. **Align GitHub Status Checks:** Go to **Settings** -> **Branches** -> edit `main` protection -> update required check names to match active Vercel integrations.
  2. **Verify Vercel Git Integration:** Confirm the repository mapping in the Vercel Project Settings.
  3. **Local Merge Fallback:** If blocked, perform merges locally, verify tests, and run a direct push:
     ```bash
     git push origin main
     ```

---

### 5. Jules CLI Session Pruning & Feedback

#### 5.1. Session Branch Cleanup
- For all sessions returned by the `jules CLI` as completed, delete their remote feature tracking branches:
  ```powershell
  git push origin --delete [branch-name]
  ```
- Run a final fetch prune to sync local tracking:
  ```bash
  git fetch --prune
  ```

#### 5.2. Awaiting User Feedback Actions
- For active sessions that have been consolidated and successfully integrated, reply or close them with:
  > *"Merged and integrated successfully on the main branch. Closing this task."*

#### 5.3. Prompt Improvements for Future Automation
When instructing future automated sessions, enforce these structural rules to prevent conflicts:
1. **Append Tests:** "Consolidate all new test cases by appending them directly into central files (e.g., `lib/mold-types.test.ts`) rather than creating separate files."
2. **Log Preservation:** "When updating PII filters in `lib/logger.ts`, use strict, declarative capture-groups to avoid scrubbing JSON syntax characters (double quotes, commas)."
3. **Isomorphic Uniformity:** "Replace client-side DOMPurify with isomorphic-dompurify to guarantee uniform sanitization during SSR rendering phases."

---

## Reference Rules (.Jules Directory)

Ensure all integrated code complies with these category-specific files inside the `.Jules/` folder:
- **`security.md`:** Enforces `isomorphic-dompurify` and strict Mermaid config (`securityLevel: 'strict'`).
- **`logging.md`:** Requires declarative capture-group masking in `lib/logger.ts` to preserve JSON structural characters.
- **`accessibility.md`:** Enforces focus indicators (`focus-visible`), decorative icon hiding (`aria-hidden="true"`), and dynamic screen-reader announcement regions.
- **`multi_tenant.md`:** Requires absolute Next.js build separation (`NEXT_DIST_DIR`) in Docker setups to prevent cross-tenant cache collisions.
- **`testing.md`:** Prohibits fragmented test files and enforces the official `node --experimental-strip-types` test execution runner.

---

## Common Mistakes

- **Creating Fragmented Test Files:** Creating individual test files instead of appending test cases to central files (e.g., `lib/mold-types.test.ts`) causes merge conflicts.
- **Bypassing isomorphic-dompurify:** Using client-side DOMPurify or unsafe HTML rendering in SSR contexts breaks server execution.
- **Discarding Historical Learnings:** Deleting portions of `.Jules/palette.md` during conflict resolution instead of merging and appending new entries.
- **Scrubbing JSON Characters in Logs:** Writing naive regex replacement masks in `lib/logger.ts` that accidentally strip quotes or colons, invalidating JSON outputs.
