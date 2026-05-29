# Developer Onboarding Playbook

## 3. Pull Request Validation Rules

Before creating a Pull Request, ensure that the following requirements are met:

- **No "XXX" Markers:** Automated scanning tools will flag and fail PRs containing `XXX` placeholder markers. Please resolve or remove them.
- **Clean Console:** Ensure obsolete `// Fix [X]:` comments for implemented features are removed from your code.
- **Tests Pass:** All logic changes must be covered by a unit test (in `.test.ts` files), and running `pnpm test` must yield a 100% success rate.
- **Format:** Adhere to codebase standards (no native `pnpm format` script exists).
- **Linting:** Ensure your code passes Next.js linting (note: running `next lint` directly might fail due to a known configuration issue. Focus on passing `pnpm build` and `pnpm test` as the primary gates).
- **Accessibility:** Validate screen reader compatibility and semantic HTML (e.g., `aria-live`, correct button elements).
- **Architecture Rules:** Ensure proper use of single `useEffect` guards and early returns.
- **Pre-commit Steps:** Always execute unit tests (`pnpm test`) immediately before the pre-commit phase to comply with the Completeness Rule.
- **Architectural Traceability:** Any logic modified must align with `docs/architecture/cross-module-traceability/`.
- **Idempotency:** Any new initialization processes introduced must remain idempotent (e.g. check for existing seeds before creating).