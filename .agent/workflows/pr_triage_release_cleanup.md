# Workflow: Pull Request Triage, Release Orchestration, and Session Cleanup

This workflow defines the standardized, multi-step pipeline for identifying, categorizing, consolidating, merging, and cleaning up massive sets of open pull requests, resolving test conflicts through consolidated appends, bypassing Vercel status check merge blocks via local push administration, and concluding remote tracking sessions. Trigger this workflow when organizing large-scale release flows or cleaning up duplicate and conflicted developer session submissions.

---

## 1. Prerequisites & Dependencies

Before executing this workflow, ensure the executing agent has access to the following environment setups, permissions, and tool catalogs:

- [ ] **Administrative Git Permissions:** Administrative write access to the default branch (e.g. `main`) to allow direct administrative pushes bypassing UI status checks.
- [ ] **GitHub Access & Tools:** Integration with `github-mcp-server` or the GitHub CLI (`gh`) authenticated with repository write scopes.
- [ ] **Jules CLI Availability:** The `jules` command-line utility globally installed and authenticated.
- [ ] **Testing Environment:** Node.js v20+ with native experimental type stripping and test runner support.
- [ ] **Config Files:** Access to central testing runners (e.g. `./test-runner.mjs`) and established test modules.

---

## 2. Structural Phase Blueprint

```mermaid
graph TD
    Start([1. Prep & Triage]) --> Analyze[2. Category & Session Mapping]
    Analyze --> Filter[3. Duplicate Consolidation]
    Filter --> AppendTests[4. Conflict Test Integration]
    AppendTests --> LocalValidate[5. Test Verification]
    LocalValidate --> PushBypass[6. Administrative Direct Push]
    PushBypass --> Cleanup[7. Remote Branch & Session Pruning]
    Cleanup --> End([8. Conclude & Report])

    style Start fill:#439652,stroke:#333,stroke-width:1px
    style LocalValidate fill:#f59e0b,stroke:#333,stroke-width:1px
    style PushBypass fill:#destructive,stroke:#333,stroke-width:1px
```

---

## 3. Step-by-Step Execution Protocol

Apply this strict, sequential protocol to execute the triage, merge, and cleanup flow.

### Phase 1: Preparation, Triage, & Mapping
#### Step 1.1: Query Active Pull Requests & Issues
- **Action:** List all open pull requests and issues using the `github-mcp-server` tool `list_pull_requests` and `list_issues`.
- **Verification Goal:** Retrieve a complete JSON array of open pull requests including numbers, titles, head branch references, and base branch references.
- **Failure Mitigation:** If GitHub API limits or authentication failures occur, fall back to executing `git fetch origin` and listing remote branches via `git branch -r`.

#### Step 1.2: Fetch Jules Session Context
- **Action:** Execute the session listing command to inspect remote VM contexts:
  ```bash
  jules remote list --session
  ```
- **Verification Goal:** Identify active sessions, completed sessions, and sessions marked as `Awaiting User Feedback`. Map the Jules Session IDs directly to their corresponding pull request numbers by parsing descriptions or commit shas.

---

### Phase 2: Core Execution, Consolidation, & Integration
#### Step 2.1: Deprecate Already Integrated Pull Requests
- **Action:** Identify pull requests that are already merged or implemented on `main`. Close them using `update_issue` (setting `state` to `closed`) with the following standardized, polite message:
  > *"Closing this pull request as these changes are already integrated and fully functional on the main branch. Thank you!"*
- **Verification Goal:** The PR status is updated to `closed` in the repository tracking system.

#### Step 2.2: Consolidate Redundant Duplicates
- **Action:** Group pull requests targeting the same logical components and merge only the most robust version, closing the redundant variants:
  *   **Group A (SSR XSS sanitization):** Merge the version integrating `isomorphic-dompurify` cleanly; close the rest with a message referencing the selected version.
  *   **Group B (Logging PII filters):** Merge the version implementing declarative capture-group masking (preserving structural JSON syntax); close the rest.
  *   **Group C (Utility Loop Optimizations):** Merge the version flattening nested control flow loops; close the rest.
  *   **Group D (Focus & Accessibility):** Merge the version implementing comprehensive screen-reader landmarks and focus outlines; close the rest.
- **Verification Goal:** Redundant branches are closed with direct links to the winning PR to ensure clarity.

#### Step 2.3: Resolve Test Suite Conflicts through Centralized Appending
- **Action:** For pull requests attempting to write new, duplicate, or fragmented unit test files from scratch:
  *   Extract the new test code blocks from the PR's branch.
  *   Append these test suites cleanly into the repository's centralized, category-specific test modules (e.g. `lib/mold-types.test.ts` or `lib/subject-persistence.test.ts`).
  *   Ensure test mock variables conform perfectly to the modernized repository data contract schemas.
- **Verification Goal:** No standalone conflicted test files remain; all tests exist in centralized test modules.

> [!IMPORTANT]
> Never allow independent feature branches to create standalone, duplicate test files. Always consolidate test assertions into unified files to completely prevent git merge conflicts and regression loops.

---

### Phase 3: Integration, Bypass, & Pruning
#### Step 3.1: Run Local Validations
- **Action:** Run the official test runner suite inside the local workspace to ensure 100% of tests pass before push:
  ```bash
  node --experimental-strip-types --import ./test-runner.mjs --test [list of test files]
  ```
- **Verification Goal:** Terminal reports all tests passing successfully with `fail 0`.

#### Step 3.2: Execute Administrative Direct Push Bypass
- **Action:** If GitHub UI merge buttons are blocked due to mismatched environment status checks (e.g. Vercel environment names misalignment):
  *   Perform all branch merges locally on a temporary working branch.
  *   Fast-forward your local `main` branch to match.
  *   Use administrative rights to execute a direct push to the remote branch:
      ```bash
      git push origin main
      ```
- **Verification Goal:** Commits are pushed, and the target pull requests are automatically closed as merged.

#### Step 3.3: Remote Branch and Session Pruning
- **Action:** Run a script to delete all the already merged/closed remote feature branches on `origin`:
  ```powershell
  $branches = @('branch-name-1', 'branch-name-2', ...)
  foreach ($branch in $branches) {
    git push origin --delete $branch
  }
  ```
  Follow up by running a final prune check to synchronize local tracking:
  ```bash
  git fetch --prune
  ```
- **Verification Goal:** `git branch -a` shows only the default branch and current working branches on both local and remote.

---

## 4. Verification & Testing Guidelines

Execute these protocols to verify execution success at the end of the workflow:

### Automated Test Protocols
- **Command to run:**
  ```bash
  node --experimental-strip-types --import ./test-runner.mjs --test lib/accuracy.test.ts lib/crypto-utils.test.ts lib/mold-types.test.ts lib/subject-persistence.test.ts
  ```
- **Expected output signature:**
  ```text
  ℹ tests 32
  ℹ suites 2
  ℹ pass 32
  ℹ fail 0
  ```

### Manual Verification
- Run a final git branch review to verify pristine remote state:
  ```bash
  git branch -a
  ```
- Expected remote branches: `origin/main` (and optionally any open third-party package dependency upgrade branches).

---

## 5. Reference Materials & Seams

- **Centralized Test Modules:**
  *   [`lib/mold-types.test.ts`](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/lib/mold-types.test.ts)
  *   [`lib/subject-persistence.test.ts`](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/lib/subject-persistence.test.ts)
- **Developer Guidelines:** [AGENTS.md](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/AGENTS.md)
- **Known Seams:**
  *   **Vercel Deployment Mismatch:** Status checks posted by integrations might mismatch branch protection requirements. Bypass via administrative push override or align check names in repo settings.
  *   **Line Endings Warning:** CRLF/LF transitions during PowerShell script git pushes. Let Git handle replacements automatically.
