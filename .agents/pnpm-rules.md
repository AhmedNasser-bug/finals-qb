# PNPM Execution Rules & Package Manager Standardization

**Canonical Package Manager:** `pnpm` (`pnpm@10.15.1`)

## Mandatory Directives for All Agents:

1. **Strict PNPM Usage:**
   - Always use `pnpm` for running scripts, building, testing, dev servers, or managing dependencies.
   - **NEVER** run `npm install`, `npm test`, `npm run build`, `yarn`, or `bun`.
   - The repository has `"preinstall": "npx only-allow pnpm"` configured in `package.json` to hard-block non-pnpm commands.

2. **Common Commands:**
   - Run test suite: `pnpm test`
   - Run production build: `pnpm run build`
   - Run development server: `pnpm dev`
   - Add dependencies: `pnpm add <package>`
   - Add dev dependencies: `pnpm add -D <package>`
   - Install dependencies: `pnpm install`

3. **Lockfile Discipline:**
   - `pnpm-lock.yaml` is the **sole source of truth**.
   - `package-lock.json` is banned from this repository. Never generate or commit `package-lock.json`.
   - Whenever updating `package.json`, always run `pnpm install` so `pnpm-lock.yaml` stays synchronized.

4. **CI & Vercel Deployments:**
   - Vercel uses `vercel.json` with `"installCommand": "pnpm install --no-frozen-lockfile"` to guarantee clean, resilient automated builds.
