## 2024-05-12 - Missing ARIA Labels and Focus Rings in Modals/Setup
**Learning:** Icon-only buttons (like Encyclopedia in action-hub) and semantic inputs (search in encyclopedia, textarea in importer) frequently miss ARIA labels across the UI. Modals and secondary setup panels often forget to include standard tailwind `focus-visible` utilities, negatively impacting keyboard navigation. Additionally, loading buttons can benefit from `aria-busy` to communicate state clearly to screen readers.
**Action:** When creating new components, default to adding `aria-label` for icon buttons, ensure `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` is applied to all interactive elements, and add `aria-busy` for loading states to provide a complete accessibility experience.

## 2026-05-13 - Added aria-pressed for Keyboard/Screen Reader A11y
**Learning:** Custom UI elements like Mode Cards, Question Count pills, and Category Tiles that act as toggleable selections often miss standard accessibility attributes. Without `aria-pressed`, screen readers cannot announce the active state of these elements.
**Action:** Always include `aria-pressed={isActive}` on any custom `<button>` or `<div>` that functions as a toggle or selection option to ensure full accessibility.

## 2026-05-14 - Missed Accessibility on Custom Error/Fallback Buttons
**Learning:** Fallback error boundaries and low-level recovery screens often miss basic accessibility polish (like `aria-label` or `focus-visible` styling) because they are rarely tested during happy path development.
**Action:** When auditing for a11y, specifically seek out Error Boundaries and generic fallback UI to ensure their recovery actions (like 'RETURN TO HOME') are as accessible as the core application.
## 2026-05-18 - Added proper accessible live regions to dynamic feedback elements
**Learning:** React components that change text dynamically based on user interaction (like button states changing from 'Copy' to 'Copied!' or empty search states) must have their text wrapped in `aria-live` regions or `role="status"`. Otherwise, screen readers may silently skip the text change.
**Action:** When creating text that represents async feedback or empty states, always add `aria-live="polite"` inside a `<span>` wrapper or `role="status"` to the container element.

## 2026-05-15 - Add aria-busy to Asynchronous Loading Buttons
**Learning:** Buttons that trigger asynchronous actions and enter a loading state (like fetching an external resource or processing data) often use `disabled={isLoading}` to prevent multiple clicks, but forget to communicate this processing state to screen readers.
**Action:** When a button disables itself to process an action, always add `aria-busy={isLoading}` so screen readers can explicitly announce the element is currently loading/processing rather than just being generically "disabled".
## 2024-05-17 - Disabled States and Contextual Tooltips
**Learning:** Adding the standard HTML `disabled` attribute prevents interaction but doesn't guarantee the clearest screen reader experience. Explicitly pairing it with `aria-disabled="true"` reinforces the state for some tooling. Additionally, users often don't know *why* a button is disabled. Adding a descriptive `title` attribute (e.g., "Confirm deletion first" or "Loading module...") provides essential context directly natively without requiring custom tooltip components. Lastly, providing an `aria-label` to an icon sitting next to readable text within a button causes redundant and annoying screen reader announcements; instead, applying `aria-hidden="true"` to the purely decorative icon is the superior pattern.
**Action:** Always combine `disabled`, `aria-disabled="true"`, and a contextual `title` attribute for inactive interactive elements. Apply `aria-hidden="true"` to decorative icons inside elements that already contain text.

## 2024-05-18 - Missing focus visibility and contextual tooltips
**Learning:** Certain interactive components like toggles and icon-only actions often lack keyboard focus indicators (`focus-visible` classes) or contextual `title` text. Mobile layouts also frequently hide essential actions (like forfeiting a game) inside desktop-only wrappers, making them inaccessible to touch users.
**Action:** Audit all interactive elements to ensure they have explicit focus outlines and `title` attributes where the action may be ambiguous. Always verify that critical session actions are visible in mobile viewport contexts.
