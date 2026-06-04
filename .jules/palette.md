## 2024-06-04 - Semantic Buttons Ensure Keyboard Access
**Learning:** Replaced an interactive `div` with an `onClick` handler in the navigation bar with a semantic `<button>` tag to ensure the element receives keyboard focus and works with screen readers, demonstrating that native elements are superior to adding multiple `aria` attributes to non-interactive tags.
**Action:** Always default to `<button>` for click actions rather than patching `<div onClick={...}>` with roles.
