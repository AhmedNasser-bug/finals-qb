## **Step 4: PR Validation Rules**

Before submitting a Pull Request, ensure your code passes the following validation criteria:

* **No "XXX" Markers:** Automated scanning tools will flag and fail PRs containing `XXX` placeholder markers. Please resolve or remove them.
* **Clean Console:** Ensure obsolete `// Fix [X]:` comments for implemented features are removed from your code.
* **Tests Pass:** All logic changes must be covered by a unit test (in `.test.ts` files), and running `pnpm test` must yield a 100% success rate.
* **Format:** Adhere to codebase standards (no native `pnpm format` script exists).
* **Linting:** Ensure your code passes Next.js linting (note: running `next lint` directly might fail due to a known configuration issue. Focus on passing `pnpm build` and `pnpm test` as the primary gates).
* **Accessibility:** Validate screen reader compatibility and semantic HTML (e.g., `aria-live`, correct button elements).
* **Architecture Rules:** Ensure proper use of single `useEffect` guards and early returns.