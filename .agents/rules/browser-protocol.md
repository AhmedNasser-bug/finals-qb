# Browser Testing Protocol

## Mandate: Exclusive Use of `/browser` Subagent

To maintain pristine process hygiene, avoid orphaned browser daemons, and ensure unified UI testing:

1. **NO RAW PLAYWRIGHT SCRIPTS:**
   - Never write, generate, or execute ad-hoc standalone Playwright Python/Node automation scripts directly via `run_command`.
   - Never spawn detached headless Chrome/Chromium background processes manually.

2. **ALWAYS USE `/browser` SUBAGENT:**
   - For all browser automation, visual regression checks, UX audits, screenshot captures, and web verification tasks, always invoke and delegate to the specialized `/browser` subagent.
   - The `/browser` subagent manages browser lifecycle, cookies, devtools, and viewports safely without memory leaks.
