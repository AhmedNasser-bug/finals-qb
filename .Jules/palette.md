## 2024-05-12 - Missing ARIA Labels and Focus Rings in Modals/Setup
**Learning:** Icon-only buttons (like Encyclopedia in action-hub) and semantic inputs (search in encyclopedia, textarea in importer) frequently miss ARIA labels across the UI. Modals and secondary setup panels often forget to include standard tailwind `focus-visible` utilities, negatively impacting keyboard navigation. Additionally, loading buttons can benefit from `aria-busy` to communicate state clearly to screen readers.
**Action:** When creating new components, default to adding `aria-label` for icon buttons, ensure `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` is applied to all interactive elements, and add `aria-busy` for loading states to provide a complete accessibility experience.

## 2026-05-13 - Added aria-pressed for Keyboard/Screen Reader A11y
**Learning:** Custom UI elements like Mode Cards, Question Count pills, and Category Tiles that act as toggleable selections often miss standard accessibility attributes. Without `aria-pressed`, screen readers cannot announce the active state of these elements.
**Action:** Always include `aria-pressed={isActive}` on any custom `<button>` or `<div>` that functions as a toggle or selection option to ensure full accessibility.
