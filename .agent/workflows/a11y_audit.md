# Workflow: Accessibility (A11y) Audit (a11y_audit)

A narrow workflow designed to audit and implement strict accessibility standards across UI components, particularly focusing on focus visibility, ARIA landmarks, and dynamic state announcements.

---

## 1. Prerequisites & Dependencies

- [ ] Target UI components identified for auditing.

---

## 2. Execution Protocol

### Step 1: Verify Focus Outlines
- **Action**: Ensure all interactive elements (buttons, inputs) contain Tailwind focus indicators: `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`.

### Step 2: Audit Dynamic Feedback
- **Action**: Locate any dynamic text or states (e.g. error messages, "Copied" tags, empty search results). Ensure they are wrapped in `role="status"`, `role="alert"`, or include `aria-live="polite"`.

### Step 3: Handle Decorative Icons
- **Action**: Search for SVG icons nested within text buttons. Verify they contain `aria-hidden="true"` to prevent redundant screen reader announcements.

### Step 4: Fix Nested Buttons
- **Action**: Check for nested `<button>` tags (invalid HTML). Refactor inner actions into `<div role="button" tabIndex={0}>` with an `onKeyDown` handler (Space/Enter).

---

## 3. Reference Materials
- [Accessibility Rules](../../.Jules/accessibility.md)
