# PR Validation Rules

Before submitting a Pull Request, ensure your changes adhere to our validation rules.

## Pre-Commit Checks

1. **Formatting and Linting**
   Ensure code is properly formatted and passes all linting rules:
   ```bash
   pnpm lint
   ```
   *(Note: Rely on `pnpm build` or `pnpm test` if linting fails due to environment issues locally)*

2. **Test Suite Passes**
   All tests must pass successfully:
   ```bash
   pnpm test
   ```

3. **Build Verification**
   Verify that the application builds without errors:
   ```bash
   pnpm build
   ```

## Pull Request Description
Your PR description must include:
- **What**: A clear summary of the exact mutations.
- **Why**: The problem solved or feature added.
- **Impact**: How it affects adjacent systems or user experience.

## Performance/UX Changes
If acting as a specialized agent (e.g., **Bolt** for performance, **Palette** for UX), ensure you have updated your respective journal in `.Jules/` and formatted your PR title correctly (e.g., `⚡ Bolt: [improvement]` or `🎨 Palette: [improvement]`).
