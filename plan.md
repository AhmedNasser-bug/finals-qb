1. **Add `type="button"` and `aria-label` to buttons without them.**
   - In `components/mold/home/stats-screen.tsx`:
     - `Return to core` button: Add `type="button"` and `aria-label="Return to core dashboard"`.
   - In `components/mold/home/hero-header.tsx`:
     - `SWITCH SUBJECT` button: Add `type="button"`.
     - `IMPORT NEW` button: Add `type="button"`.
     - `SIGN IN` button: Add `type="button"` and `aria-label="Sign in"`.
   - In `components/mold/home/top-nav-bar.tsx`:
     - `Mute audio synthesizer` button: Add `type="button"`.
     - `Change color theme palette` button: Add `type="button"`.
     - `Switch workspace page layout` button: Add `type="button"`.
     - `Import New Subject JSON` button: Add `type="button"`.
     - `SIGN IN` button: Add `type="button"` and `aria-label="Sign in"`.
   - In `components/mold/home/achievements-panel.tsx`:
     - `View All Achievements` button: Add `type="button"` and `aria-label="View all achievements"`.
   - In `components/mold/home/bottom-mobile-nav.tsx`:
     - `Open Core Dashboard` button: Add `type="button"`.
     - `Open Stats Dashboard` button: Add `type="button"`.
     - `Open Encyclopedia` button: Add `type="button"`.
     - `Open Achievement Gallery` button: Add `type="button"`.
     - `Switch Subject` button: Add `type="button"`.

2. **Run format/lint checks.**
   - Run `pnpm test`.
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

3. **Submit the PR.**
   - Submit the branch with the required PR format (`🎨 Palette: [UX improvement]`).
