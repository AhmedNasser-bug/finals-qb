# Accessibility (A11y) First Coding Rules

## 1. Focus Visibility
*   **Engineering Rule:** All interactive elements (buttons, inputs, toggle tiles) must have clear keyboard focus indicator outlines. Use Tailwind utility classes `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`.

## 2. Decorative Icons
*   **Engineering Rule:** Consistently append `aria-hidden="true"` to purely decorative, functional, or secondary SVG icons nested inside `<button>` or `<div role="button">` containers that already have descriptive readable text or `aria-label`s.

## 3. Dynamic States & Feedback Announcement
*   **Engineering Rule:** Wrap dynamic text feedback components (e.g. search empty states, async success tags like "Copied!") in live regions (`role="status"` or `aria-live="polite"`) to ensure changes are immediately announced by screen readers.
