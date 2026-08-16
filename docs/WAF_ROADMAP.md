# Well-Architected Framework (WAF) Overhaul Audit & Roadmap

**Target Workspace:** `D:\Study\Programming\Projects\finalsv2\finals-qb`

## Executive Summary

| Pillar | Findings Count | Status |
| :--- | :---: | :--- |
| Operational Excellence | 2 | ⚠️ Needs Improvement |
| Security | 14 | ⚠️ Needs Improvement |
| Reliability | 0 | ✅ Compliant |
| Performance Efficiency | 21 | ⚠️ Needs Improvement |
| Cost Optimization | 181 | ⚠️ Needs Improvement |

---

## Prioritized Remediation Roadmap

The following WAF improvements are ranked based on **Impact vs. Effort** (High Impact + Low Effort = High Priority):

| Priority | Pillar | Rule | Target File | Impact | Effort | Score |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| #1 | Security | Hardcoded Secrets | `lib\logger.test.ts:14` | High | Low | 9 |
| #2 | Security | Hardcoded Secrets | `lib\utils\logger.test.ts:6` | High | Low | 9 |
| #3 | Security | SQL Injection Risk | `lib\subject\subject-persistence.ts:774` | High | Medium | 8 |
| #4 | Security | SQL Injection Risk | `lib\subject\subject-persistence.ts:784` | High | Medium | 8 |
| #5 | Security | SQL Injection Risk | `lib\utils\logger.ts:26` | High | Medium | 8 |
| #6 | Security | SQL Injection Risk | `lib\utils\logger.ts:27` | High | Medium | 8 |
| #7 | Security | SQL Injection Risk | `public\examples\system-programming.json:1` | High | Medium | 8 |
| #8 | Security | SQL Injection Risk | `scratch\generate_sp.py:2016` | High | Medium | 8 |
| #9 | Security | SQL Injection Risk | `scripts\generate-component-registry.js:105` | High | Medium | 8 |
| #10 | Operational Excellence | Missing Environment Validation | `proxy.ts:4` | Medium | Low | 7 |
| #11 | Operational Excellence | Missing Environment Validation | `lib\utils\user-storage.ts:12` | Medium | Low | 7 |
| #12 | Security | Insecure Protocols | `lib\utils\url-shortener.test.ts:13` | Medium | Low | 7 |
| #13 | Security | Insecure Protocols | `lib\utils\url-shortener.test.ts:27` | Medium | Low | 7 |
| #14 | Security | Insecure Protocols | `lib\utils\url-shortener.test.ts:45` | Medium | Low | 7 |
| #15 | Security | Insecure Protocols | `lib\utils\url-shortener.test.ts:63` | Medium | Low | 7 |
| #16 | Security | Insecure Protocols | `lib\utils\url-shortener.test.ts:83` | Medium | Low | 7 |
| #17 | Cost Optimization | Aggressive Polling Loop | `lib\game\game-engine.tsx:384` | Medium | Low | 7 |
| #18 | Performance Efficiency | Synchronous File operations in Async code | `lib\subject\subject-sharing.ts:34` | Medium | Medium | 6 |
| #19 | Performance Efficiency | Synchronous File operations in Async code | `lib\subject\subject-sharing.ts:61` | Medium | Medium | 6 |
| #20 | Performance Efficiency | Synchronous File operations in Async code | `lib\subject\subject-sharing.ts:1050` | Medium | Medium | 6 |
| #21 | Performance Efficiency | Synchronous File operations in Async code | `lib\subject\subject-sharing.ts:1098` | Medium | Medium | 6 |
| #22 | Performance Efficiency | Synchronous File operations in Async code | `public\examples\system-programming.json:1` | Medium | Medium | 6 |
| #23 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_ap.py:3368` | Medium | Medium | 6 |
| #24 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:400` | Medium | Medium | 6 |
| #25 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:405` | Medium | Medium | 6 |
| #26 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:428` | Medium | Medium | 6 |
| #27 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:432` | Medium | Medium | 6 |
| #28 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:449` | Medium | Medium | 6 |
| #29 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:477` | Medium | Medium | 6 |
| #30 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:1348` | Medium | Medium | 6 |
| #31 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:1572` | Medium | Medium | 6 |
| #32 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:2079` | Medium | Medium | 6 |
| #33 | Performance Efficiency | Synchronous File operations in Async code | `scratch\generate_sp.py:2144` | Medium | Medium | 6 |
| #34 | Performance Efficiency | Synchronous File operations in Async code | `scripts\tailwind_variable_extractor.py:78` | Medium | Medium | 6 |
| #35 | Performance Efficiency | Synchronous File operations in Async code | `scripts\tailwind_variable_extractor.py:114` | Medium | Medium | 6 |
| #36 | Performance Efficiency | Synchronous File operations in Async code | `scripts\tailwind_variable_extractor.py:149` | Medium | Medium | 6 |
| #37 | Performance Efficiency | Synchronous File operations in Async code | `scripts\tailwind_variable_extractor.py:179` | Medium | Medium | 6 |
| #38 | Performance Efficiency | Synchronous File operations in Async code | `scripts\tailwind_variable_extractor.py:206` | Medium | Medium | 6 |
| #39 | Cost Optimization | Missing Storage Lifecycle / TTL | `components.json:0` | Medium | Medium | 6 |
| #40 | Cost Optimization | Missing Storage Lifecycle / TTL | `docker-compose.yml:0` | Medium | Medium | 6 |
| #41 | Cost Optimization | Missing Storage Lifecycle / TTL | `next-env.d.ts:0` | Medium | Medium | 6 |
| #42 | Cost Optimization | Missing Storage Lifecycle / TTL | `package-lock.json:0` | Medium | Medium | 6 |
| #43 | Cost Optimization | Missing Storage Lifecycle / TTL | `package.json:0` | Medium | Medium | 6 |
| #44 | Cost Optimization | Missing Storage Lifecycle / TTL | `pnpm-workspace.yaml:0` | Medium | Medium | 6 |
| #45 | Cost Optimization | Missing Storage Lifecycle / TTL | `proxy.ts:0` | Medium | Medium | 6 |
| #46 | Cost Optimization | Missing Storage Lifecycle / TTL | `skills-lock.json:0` | Medium | Medium | 6 |
| #47 | Cost Optimization | Missing Storage Lifecycle / TTL | `tailwind.config.ts:0` | Medium | Medium | 6 |
| #48 | Cost Optimization | Missing Storage Lifecycle / TTL | `tsconfig.json:0` | Medium | Medium | 6 |
| #49 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-backend-api\evals\evals.json:0` | Medium | Medium | 6 |
| #50 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-backend-api\scripts\extract-tags.js:0` | Medium | Medium | 6 |
| #51 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\evals\evals.json:0` | Medium | Medium | 6 |
| #52 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\package.json:0` | Medium | Medium | 6 |
| #53 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\proxy.ts:0` | Medium | Medium | 6 |
| #54 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\tsconfig.json:0` | Medium | Medium | 6 |
| #55 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\app\layout.tsx:0` | Medium | Medium | 6 |
| #56 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\app\page.tsx:0` | Medium | Medium | 6 |
| #57 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-orgs\evals\evals.json:0` | Medium | Medium | 6 |
| #58 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\evals\evals.json:0` | Medium | Medium | 6 |
| #59 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\templates\react-basic-auth\package.json:0` | Medium | Medium | 6 |
| #60 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\templates\react-basic-auth\tsconfig.json:0` | Medium | Medium | 6 |
| #61 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\templates\react-basic-auth\vite.config.ts:0` | Medium | Medium | 6 |
| #62 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\templates\react-basic-auth\src\App.tsx:0` | Medium | Medium | 6 |
| #63 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-react-patterns\templates\react-basic-auth\src\main.tsx:0` | Medium | Medium | 6 |
| #64 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-setup\evals\evals.json:0` | Medium | Medium | 6 |
| #65 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\clerk-webhooks\evals\evals.json:0` | Medium | Medium | 6 |
| #66 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\composition-patterns\metadata.json:0` | Medium | Medium | 6 |
| #67 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\react-best-practices\metadata.json:0` | Medium | Medium | 6 |
| #68 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\react-hook-form\metadata.json:0` | Medium | Medium | 6 |
| #69 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\shadcn\agents\openai.yml:0` | Medium | Medium | 6 |
| #70 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\shadcn\evals\evals.json:0` | Medium | Medium | 6 |
| #71 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\tailwind-v4-shadcn\templates\components.json:0` | Medium | Medium | 6 |
| #72 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\tailwind-v4-shadcn\templates\theme-provider.tsx:0` | Medium | Medium | 6 |
| #73 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\tailwind-v4-shadcn\templates\tsconfig.app.json:0` | Medium | Medium | 6 |
| #74 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\tailwind-v4-shadcn\templates\utils.ts:0` | Medium | Medium | 6 |
| #75 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\tailwind-v4-shadcn\templates\vite.config.ts:0` | Medium | Medium | 6 |
| #76 | Cost Optimization | Missing Storage Lifecycle / TTL | `.agents\skills\zod\metadata.json:0` | Medium | Medium | 6 |
| #77 | Cost Optimization | Missing Storage Lifecycle / TTL | `.vscode\settings.json:0` | Medium | Medium | 6 |
| #78 | Cost Optimization | Missing Storage Lifecycle / TTL | `app\actions.ts:0` | Medium | Medium | 6 |
| #79 | Cost Optimization | Missing Storage Lifecycle / TTL | `app\layout.tsx:0` | Medium | Medium | 6 |
| #80 | Cost Optimization | Missing Storage Lifecycle / TTL | `app\page.tsx:0` | Medium | Medium | 6 |
| #81 | Cost Optimization | Missing Storage Lifecycle / TTL | `app\subjects\page.tsx:0` | Medium | Medium | 6 |
| #82 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\theme-provider.tsx:0` | Medium | Medium | 6 |
| #83 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\achievement\achievement-gallery.tsx:0` | Medium | Medium | 6 |
| #84 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\achievement\achievement-toast.tsx:0` | Medium | Medium | 6 |
| #85 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\encyclopedia-overlay.tsx:0` | Medium | Medium | 6 |
| #86 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\footer.tsx:0` | Medium | Medium | 6 |
| #87 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\guide-overlay.tsx:0` | Medium | Medium | 6 |
| #88 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\mermaid-diagram.tsx:0` | Medium | Medium | 6 |
| #89 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\onboarding-screen.tsx:0` | Medium | Medium | 6 |
| #90 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\rich-text.tsx:0` | Medium | Medium | 6 |
| #91 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\share-modal-blocks.tsx:0` | Medium | Medium | 6 |
| #92 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\common\share-modal.tsx:0` | Medium | Medium | 6 |
| #93 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\flashcard\flashcard-components.tsx:0` | Medium | Medium | 6 |
| #94 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\flashcard\flashcard-screen-blocks.tsx:0` | Medium | Medium | 6 |
| #95 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\flashcard\flashcard-screen.tsx:0` | Medium | Medium | 6 |
| #96 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\cheat-sheet-terminal.tsx:0` | Medium | Medium | 6 |
| #97 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-error-boundary.tsx:0` | Medium | Medium | 6 |
| #98 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-footer.tsx:0` | Medium | Medium | 6 |
| #99 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-header.tsx:0` | Medium | Medium | 6 |
| #100 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-icons.tsx:0` | Medium | Medium | 6 |
| #101 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-runner.tsx:0` | Medium | Medium | 6 |
| #102 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\game-stat-cell.tsx:0` | Medium | Medium | 6 |
| #103 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\question-card-blocks.tsx:0` | Medium | Medium | 6 |
| #104 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\question-card-builder.tsx:0` | Medium | Medium | 6 |
| #105 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\question-card-components.tsx:0` | Medium | Medium | 6 |
| #106 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\question-card-types.ts:0` | Medium | Medium | 6 |
| #107 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\question-card.tsx:0` | Medium | Medium | 6 |
| #108 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\results-screen-components.tsx:0` | Medium | Medium | 6 |
| #109 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\game\results-screen.tsx:0` | Medium | Medium | 6 |
| #110 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\achievements-panel.tsx:0` | Medium | Medium | 6 |
| #111 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\action-hub.tsx:0` | Medium | Medium | 6 |
| #112 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\add-questions-wizard.tsx:0` | Medium | Medium | 6 |
| #113 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\bottom-mobile-nav.tsx:0` | Medium | Medium | 6 |
| #114 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\header-well.tsx:0` | Medium | Medium | 6 |
| #115 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\hero-header.tsx:0` | Medium | Medium | 6 |
| #116 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\home-screen-blocks.tsx:0` | Medium | Medium | 6 |
| #117 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\home-screen-components.tsx:0` | Medium | Medium | 6 |
| #118 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\home-screen-types.ts:0` | Medium | Medium | 6 |
| #119 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\home-screen.tsx:0` | Medium | Medium | 6 |
| #120 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\mode-selector.tsx:0` | Medium | Medium | 6 |
| #121 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\performance-table.tsx:0` | Medium | Medium | 6 |
| #122 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\session-stats-panel.tsx:0` | Medium | Medium | 6 |
| #123 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\setup-panel-blocks.tsx:0` | Medium | Medium | 6 |
| #124 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\setup-panel.tsx:0` | Medium | Medium | 6 |
| #125 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\side-nav-bar.tsx:0` | Medium | Medium | 6 |
| #126 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\stats-screen.tsx:0` | Medium | Medium | 6 |
| #127 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\streak-ascent.tsx:0` | Medium | Medium | 6 |
| #128 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\subject-visual-card.tsx:0` | Medium | Medium | 6 |
| #129 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\telemetry-panel.tsx:0` | Medium | Medium | 6 |
| #130 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\home\top-nav-bar.tsx:0` | Medium | Medium | 6 |
| #131 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\example-module-card.tsx:0` | Medium | Medium | 6 |
| #132 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\print-layout.tsx:0` | Medium | Medium | 6 |
| #133 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\share-receiver.tsx:0` | Medium | Medium | 6 |
| #134 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-importer-blocks.tsx:0` | Medium | Medium | 6 |
| #135 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-importer-components.tsx:0` | Medium | Medium | 6 |
| #136 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-importer-steps.tsx:0` | Medium | Medium | 6 |
| #137 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-importer.tsx:0` | Medium | Medium | 6 |
| #138 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-selector-blocks.tsx:0` | Medium | Medium | 6 |
| #139 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-selector-components.tsx:0` | Medium | Medium | 6 |
| #140 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\subject-selector.tsx:0` | Medium | Medium | 6 |
| #141 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\mold\subject\user-subject-card.tsx:0` | Medium | Medium | 6 |
| #142 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\ui\button.tsx:0` | Medium | Medium | 6 |
| #143 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\ui\card.tsx:0` | Medium | Medium | 6 |
| #144 | Cost Optimization | Missing Storage Lifecycle / TTL | `components\ui\input.tsx:0` | Medium | Medium | 6 |
| #145 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\achievement-engine.tsx:0` | Medium | Medium | 6 |
| #146 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\achievement-logic.ts:0` | Medium | Medium | 6 |
| #147 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\active-subject-store.ts:0` | Medium | Medium | 6 |
| #148 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\crypto-utils.ts:0` | Medium | Medium | 6 |
| #149 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game-engine.tsx:0` | Medium | Medium | 6 |
| #150 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\logger.test.ts:0` | Medium | Medium | 6 |
| #151 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\logger.ts:0` | Medium | Medium | 6 |
| #152 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\mold-types.ts:0` | Medium | Medium | 6 |
| #153 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\prompt-builder.ts:0` | Medium | Medium | 6 |
| #154 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\question-card-context.tsx:0` | Medium | Medium | 6 |
| #155 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject-persistence.ts:0` | Medium | Medium | 6 |
| #156 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject-sharing.test.ts:0` | Medium | Medium | 6 |
| #157 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject-sharing.ts:0` | Medium | Medium | 6 |
| #158 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject-store.ts:0` | Medium | Medium | 6 |
| #159 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\url-shortener.ts:0` | Medium | Medium | 6 |
| #160 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\user-storage.ts:0` | Medium | Medium | 6 |
| #161 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils.ts:0` | Medium | Medium | 6 |
| #162 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\achievement\achievement-engine.tsx:0` | Medium | Medium | 6 |
| #163 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\achievement\achievement-logic.test.ts:0` | Medium | Medium | 6 |
| #164 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\achievement\achievement-logic.ts:0` | Medium | Medium | 6 |
| #165 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\cheat-sheet-context.tsx:0` | Medium | Medium | 6 |
| #166 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\cheat-sheet-store.ts:0` | Medium | Medium | 6 |
| #167 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\game-engine.tsx:0` | Medium | Medium | 6 |
| #168 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\question-card-context.tsx:0` | Medium | Medium | 6 |
| #169 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\stats-context.tsx:0` | Medium | Medium | 6 |
| #170 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\stats-logic.test.ts:0` | Medium | Medium | 6 |
| #171 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\stats-utils.ts:0` | Medium | Medium | 6 |
| #172 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\streak-context.tsx:0` | Medium | Medium | 6 |
| #173 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\streak-logic.test.ts:0` | Medium | Medium | 6 |
| #174 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\streak-shield-logic.ts:0` | Medium | Medium | 6 |
| #175 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\streak-utils.ts:0` | Medium | Medium | 6 |
| #176 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\game\visual-formatting.test.ts:0` | Medium | Medium | 6 |
| #177 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\active-subject-store.test.ts:0` | Medium | Medium | 6 |
| #178 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\active-subject-store.ts:0` | Medium | Medium | 6 |
| #179 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\prompt-builder.ts:0` | Medium | Medium | 6 |
| #180 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\subject-persistence.test.ts:0` | Medium | Medium | 6 |
| #181 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\subject-persistence.ts:0` | Medium | Medium | 6 |
| #182 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\subject-sharing.test.ts:0` | Medium | Medium | 6 |
| #183 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\subject-store.test.ts:0` | Medium | Medium | 6 |
| #184 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\subject\subject-store.ts:0` | Medium | Medium | 6 |
| #185 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\types\mold-types.test.ts:0` | Medium | Medium | 6 |
| #186 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\types\mold-types.ts:0` | Medium | Medium | 6 |
| #187 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\accuracy.test.ts:0` | Medium | Medium | 6 |
| #188 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\crypto-utils.test.ts:0` | Medium | Medium | 6 |
| #189 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\crypto-utils.ts:0` | Medium | Medium | 6 |
| #190 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\json-patcher.test.ts:0` | Medium | Medium | 6 |
| #191 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\json-patcher.ts:0` | Medium | Medium | 6 |
| #192 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\logger.test.ts:0` | Medium | Medium | 6 |
| #193 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\logger.ts:0` | Medium | Medium | 6 |
| #194 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\math-renderer.ts:0` | Medium | Medium | 6 |
| #195 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\url-shortener.test.ts:0` | Medium | Medium | 6 |
| #196 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\url-shortener.ts:0` | Medium | Medium | 6 |
| #197 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\user-storage.test.ts:0` | Medium | Medium | 6 |
| #198 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\user-storage.ts:0` | Medium | Medium | 6 |
| #199 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\utils.test.ts:0` | Medium | Medium | 6 |
| #200 | Cost Optimization | Missing Storage Lifecycle / TTL | `lib\utils\utils.ts:0` | Medium | Medium | 6 |
| #201 | Cost Optimization | Missing Storage Lifecycle / TTL | `public\demo-diagram-subject.json:0` | Medium | Medium | 6 |
| #202 | Cost Optimization | Missing Storage Lifecycle / TTL | `public\examples\data-structures.json:0` | Medium | Medium | 6 |
| #203 | Cost Optimization | Missing Storage Lifecycle / TTL | `public\examples\intro-to-cs.json:0` | Medium | Medium | 6 |
| #204 | Cost Optimization | Missing Storage Lifecycle / TTL | `public\examples\robotics-engineering.json:0` | Medium | Medium | 6 |
| #205 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_categories.py:0` | Medium | Medium | 6 |
| #206 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_diagrams.py:0` | Medium | Medium | 6 |
| #207 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_diagram_position.py:0` | Medium | Medium | 6 |
| #208 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_duplicates.py:0` | Medium | Medium | 6 |
| #209 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_flashcard_terminology_mismatch.py:0` | Medium | Medium | 6 |
| #210 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_mermaid_syntax.py:0` | Medium | Medium | 6 |
| #211 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\check_options.py:0` | Medium | Medium | 6 |
| #212 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\inspect_error.js:0` | Medium | Medium | 6 |
| #213 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\merge_subjects.py:0` | Medium | Medium | 6 |
| #214 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\test_merged.js:0` | Medium | Medium | 6 |
| #215 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\validate_ap.py:0` | Medium | Medium | 6 |
| #216 | Cost Optimization | Missing Storage Lifecycle / TTL | `scratch\validate_sp.py:0` | Medium | Medium | 6 |
| #217 | Cost Optimization | Missing Storage Lifecycle / TTL | `scripts\generate-component-registry.js:0` | Medium | Medium | 6 |
| #218 | Cost Optimization | Missing Storage Lifecycle / TTL | `scripts\tailwind_variable_extractor.py:0` | Medium | Medium | 6 |

### Detailed Findings

#### #1. [Security] Hardcoded Secrets
- **File:** `lib\logger.test.ts:14`
- **Description:** Potential hardcoded credentials, secret keys, or api tokens detected.
- **Impact:** `High` | **Effort:** `Low`
- **Snippet:**
```
logger.info({ secret: 'my-secret' });
```

#### #2. [Security] Hardcoded Secrets
- **File:** `lib\utils\logger.test.ts:6`
- **Description:** Potential hardcoded credentials, secret keys, or api tokens detected.
- **Impact:** `High` | **Effort:** `Low`
- **Snippet:**
```
const result = maskData({ api_key: '12345', password: 'my-password', safe_key: 'safe_value', token: 1234, secret: true });
```

#### #3. [Security] SQL Injection Risk
- **File:** `lib\subject\subject-persistence.ts:774`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
return { addition: "\\" + nextChar, charsConsumed: 2, wasFixed: false };
```

#### #4. [Security] SQL Injection Risk
- **File:** `lib\subject\subject-persistence.ts:784`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
addition: "\\u" + str[i + 2] + str[i + 3] + str[i + 4] + str[i + 5],
```

#### #5. [Security] SQL Injection Risk
- **File:** `lib\utils\logger.ts:26`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
if (p2) return p1 + p2 + "[REDACTED]" + p4;
```

#### #6. [Security] SQL Injection Risk
- **File:** `lib\utils\logger.ts:27`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
if (p5) return p1 + p5 + "[REDACTED]" + p7;
```

#### #7. [Security] SQL Injection Risk
- **File:** `public\examples\system-programming.json:1`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
{"id":"system-programming","name":"System Programming","config":{"title":"System Programming Mastery","description":"Master OS architectures, multi-pr
```

#### #8. [Security] SQL Injection Risk
- **File:** `scratch\generate_sp.py:2016`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
"flowchart LR\n  Unsafe[\"system(\\\"cat \\\" + input)\"] -->|Shell Parser| Vulnerable[\"Vulnerable to Injection\"]\n  Safe[\"execve(\\\"/bin/cat\\\",
```

#### #9. [Security] SQL Injection Risk
- **File:** `scripts\generate-component-registry.js:105`
- **Description:** Raw string formatting/concatenation detected in SQL or database execution query.
- **Impact:** `High` | **Effort:** `Medium`
- **Snippet:**
```
formattedEdgeCases[i] = '- ' + edgeCases[i];
```

#### #10. [Operational Excellence] Missing Environment Validation
- **File:** `proxy.ts:4`
- **Description:** Environment variables accessed without default fallbacks or structure checks.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const hasClerk = !!process.env.CLERK_SECRET_KEY
```

#### #11. [Operational Excellence] Missing Environment Validation
- **File:** `lib\utils\user-storage.ts:12`
- **Description:** Environment variables accessed without default fallbacks or structure checks.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
export const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

#### #12. [Security] Insecure Protocols
- **File:** `lib\utils\url-shortener.test.ts:13`
- **Description:** Insecure protocol (HTTP/FTP) used instead of HTTPS/SFTP.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const result = await shortenUrl("http://example.com");
```

#### #13. [Security] Insecure Protocols
- **File:** `lib\utils\url-shortener.test.ts:27`
- **Description:** Insecure protocol (HTTP/FTP) used instead of HTTPS/SFTP.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const result = await shortenUrl("http://example.com");
```

#### #14. [Security] Insecure Protocols
- **File:** `lib\utils\url-shortener.test.ts:45`
- **Description:** Insecure protocol (HTTP/FTP) used instead of HTTPS/SFTP.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const result = await shortenUrl("http://example.com");
```

#### #15. [Security] Insecure Protocols
- **File:** `lib\utils\url-shortener.test.ts:63`
- **Description:** Insecure protocol (HTTP/FTP) used instead of HTTPS/SFTP.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const result = await shortenUrl("http://example.com");
```

#### #16. [Security] Insecure Protocols
- **File:** `lib\utils\url-shortener.test.ts:83`
- **Description:** Insecure protocol (HTTP/FTP) used instead of HTTPS/SFTP.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
const result = await shortenUrl("http://example.com");
```

#### #17. [Cost Optimization] Aggressive Polling Loop
- **File:** `lib\game\game-engine.tsx:384`
- **Description:** Fast interval/polling timers (<5000ms) consume unnecessary CPU cycles and bandwidth.
- **Impact:** `Medium` | **Effort:** `Low`
- **Snippet:**
```
tickRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000)
```

#### #18. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `lib\subject\subject-sharing.ts:34`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
writer.write(bytes)
```

#### #19. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `lib\subject\subject-sharing.ts:61`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
writer.write(new Uint8Array(compressed)).catch(() => {})
```

#### #20. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `lib\subject\subject-sharing.ts:1050`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
iframeDoc.write(htmlContent)
```

#### #21. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `lib\subject\subject-sharing.ts:1098`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
iframeDoc.write(htmlContent)
```

#### #22. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `public\examples\system-programming.json:1`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
{"id":"system-programming","name":"System Programming","config":{"title":"System Programming Mastery","description":"Master OS architectures, multi-pr
```

#### #23. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_ap.py:3368`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
f.write(single_line_json)
```

#### #24. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:400`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"Which sequence outlines the steps taken during a standard C system call trace like `read(fd, buf, count)`?<br>[EXAMINE DIAGRAM]",
```

#### #25. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:405`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"sequenceDiagram\n  UserApp->>Library: read(fd, buf, size)\n  Library->>Kernel: Trap Instruction (Switch to Mode 0)\n  Kernel->>Kernel: Execute Read S
```

#### #26. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:428`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
["open(), read(), write(), close()", "fopen(), fread(), fwrite(), fclose()", "printf(), malloc(), free(), exit()  ", "scanf(), strcat(), strcpy(), str
```

#### #27. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:432`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"graph TD\n  App[\"User App\"] -->|Library Call| Lib[\"fopen() / fread() (C Library)\"]\n  Lib -->|System Call| Sys[\"open() / read() (OS Kernel)\"]\n
```

#### #28. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:449`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"How do you inspect what went wrong after a failed `open()` or `read()` call?",
```

#### #29. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:477`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"graph LR\n  Index[\"Syscall Number (e.g. 3)\"] --> Table[\"Syscall Table\"]\n  Table -->|Index 3| Handler[\"sys_read() Kernel Address\"]\n  Handler -
```

#### #30. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:1348`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
["shmget() to allocate segment -> shmat() to attach to address space", "malloc() to allocate heap -> fork() to duplicate stack pointer registers", "op
```

#### #31. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:1572`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"Wait (P): `sem--; if (sem < 0) { block_calling_thread(); }`. Signal (V): `sem++; if (sem <= 0) { wakeup_waiting_thread(); }`.",
```

#### #32. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:2079`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"This is a Hardware Abstraction Layer (HAL). The application calls `dev->write()`. Swapping the driver struct (e.g. from UART to USB) changes the func
```

#### #33. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scratch\generate_sp.py:2144`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
"flowchart TD\n  App[\"Application Code\"] -->|write()| VFS[\"Virtual File System (VFS) API\"]\n  VFS -->|Redirects| D1[\"Regular File on Disk\"]\n  V
```

#### #34. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scripts\tailwind_variable_extractor.py:78`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
content = f.read()
```

#### #35. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scripts\tailwind_variable_extractor.py:114`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
content = f.read()
```

#### #36. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scripts\tailwind_variable_extractor.py:149`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
f.write(updated_content)
```

#### #37. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scripts\tailwind_variable_extractor.py:179`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
content = f.read()
```

#### #38. [Performance Efficiency] Synchronous File operations in Async code
- **File:** `scripts\tailwind_variable_extractor.py:206`
- **Description:** Blocking synchronous file operations inside an async function.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
f.write(updated_content)
```

#### #39. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #40. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `docker-compose.yml:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #41. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `next-env.d.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #42. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `package-lock.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #43. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `package.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #44. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `pnpm-workspace.yaml:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #45. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `proxy.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #46. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `skills-lock.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #47. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `tailwind.config.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #48. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `tsconfig.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #49. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-backend-api\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #50. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-backend-api\scripts\extract-tags.js:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #51. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #52. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\package.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #53. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\proxy.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #54. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\tsconfig.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #55. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\app\layout.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #56. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-nextjs-patterns\templates\nextjs-basic-auth\app\page.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #57. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-orgs\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #58. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #59. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\templates\react-basic-auth\package.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #60. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\templates\react-basic-auth\tsconfig.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #61. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\templates\react-basic-auth\vite.config.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #62. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\templates\react-basic-auth\src\App.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #63. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-react-patterns\templates\react-basic-auth\src\main.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #64. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-setup\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #65. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\clerk-webhooks\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #66. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\composition-patterns\metadata.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #67. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\react-best-practices\metadata.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #68. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\react-hook-form\metadata.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #69. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\shadcn\agents\openai.yml:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #70. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\shadcn\evals\evals.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #71. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\tailwind-v4-shadcn\templates\components.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #72. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\tailwind-v4-shadcn\templates\theme-provider.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #73. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\tailwind-v4-shadcn\templates\tsconfig.app.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #74. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\tailwind-v4-shadcn\templates\utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #75. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\tailwind-v4-shadcn\templates\vite.config.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #76. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.agents\skills\zod\metadata.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #77. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `.vscode\settings.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #78. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `app\actions.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #79. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `app\layout.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #80. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `app\page.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #81. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `app\subjects\page.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #82. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\theme-provider.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #83. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\achievement\achievement-gallery.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #84. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\achievement\achievement-toast.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #85. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\encyclopedia-overlay.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #86. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\footer.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #87. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\guide-overlay.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #88. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\mermaid-diagram.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #89. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\onboarding-screen.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #90. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\rich-text.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #91. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\share-modal-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #92. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\common\share-modal.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #93. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\flashcard\flashcard-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #94. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\flashcard\flashcard-screen-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #95. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\flashcard\flashcard-screen.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #96. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\cheat-sheet-terminal.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #97. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-error-boundary.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #98. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-footer.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #99. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-header.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #100. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-icons.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #101. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-runner.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #102. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\game-stat-cell.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #103. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\question-card-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #104. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\question-card-builder.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #105. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\question-card-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #106. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\question-card-types.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #107. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\question-card.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #108. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\results-screen-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #109. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\game\results-screen.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #110. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\achievements-panel.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #111. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\action-hub.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #112. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\add-questions-wizard.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #113. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\bottom-mobile-nav.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #114. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\header-well.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #115. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\hero-header.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #116. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\home-screen-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #117. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\home-screen-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #118. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\home-screen-types.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #119. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\home-screen.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #120. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\mode-selector.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #121. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\performance-table.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #122. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\session-stats-panel.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #123. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\setup-panel-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #124. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\setup-panel.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #125. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\side-nav-bar.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #126. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\stats-screen.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #127. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\streak-ascent.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #128. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\subject-visual-card.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #129. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\telemetry-panel.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #130. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\home\top-nav-bar.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #131. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\example-module-card.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #132. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\print-layout.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #133. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\share-receiver.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #134. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-importer-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #135. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-importer-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #136. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-importer-steps.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #137. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-importer.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #138. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-selector-blocks.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #139. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-selector-components.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #140. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\subject-selector.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #141. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\mold\subject\user-subject-card.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #142. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\ui\button.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #143. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\ui\card.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #144. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `components\ui\input.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #145. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\achievement-engine.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #146. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\achievement-logic.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #147. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\active-subject-store.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #148. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\crypto-utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #149. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game-engine.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #150. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\logger.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #151. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\logger.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #152. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\mold-types.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #153. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\prompt-builder.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #154. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\question-card-context.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #155. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject-persistence.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #156. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject-sharing.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #157. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject-sharing.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #158. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject-store.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #159. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\url-shortener.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #160. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\user-storage.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #161. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #162. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\achievement\achievement-engine.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #163. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\achievement\achievement-logic.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #164. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\achievement\achievement-logic.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #165. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\cheat-sheet-context.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #166. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\cheat-sheet-store.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #167. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\game-engine.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #168. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\question-card-context.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #169. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\stats-context.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #170. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\stats-logic.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #171. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\stats-utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #172. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\streak-context.tsx:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #173. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\streak-logic.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #174. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\streak-shield-logic.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #175. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\streak-utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #176. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\game\visual-formatting.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #177. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\active-subject-store.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #178. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\active-subject-store.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #179. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\prompt-builder.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #180. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\subject-persistence.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #181. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\subject-persistence.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #182. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\subject-sharing.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #183. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\subject-store.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #184. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\subject\subject-store.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #185. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\types\mold-types.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #186. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\types\mold-types.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #187. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\accuracy.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #188. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\crypto-utils.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #189. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\crypto-utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #190. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\json-patcher.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #191. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\json-patcher.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #192. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\logger.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #193. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\logger.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #194. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\math-renderer.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #195. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\url-shortener.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #196. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\url-shortener.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #197. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\user-storage.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #198. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\user-storage.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #199. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\utils.test.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #200. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `lib\utils\utils.ts:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #201. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `public\demo-diagram-subject.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #202. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `public\examples\data-structures.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #203. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `public\examples\intro-to-cs.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #204. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `public\examples\robotics-engineering.json:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #205. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_categories.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #206. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_diagrams.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #207. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_diagram_position.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #208. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_duplicates.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #209. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_flashcard_terminology_mismatch.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #210. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_mermaid_syntax.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #211. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\check_options.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #212. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\inspect_error.js:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #213. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\merge_subjects.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #214. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\test_merged.js:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #215. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\validate_ap.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #216. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scratch\validate_sp.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #217. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scripts\generate-component-registry.js:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```

#### #218. [Cost Optimization] Missing Storage Lifecycle / TTL
- **File:** `scripts\tailwind_variable_extractor.py:0`
- **Description:** No document expiration or lifecycle configurations found in database models or storage configs.
- **Impact:** `Medium` | **Effort:** `Medium`
- **Snippet:**
```
N/A (Rule negation: element missing)
```
