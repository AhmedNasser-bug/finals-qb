💡 What: Extracted shared page wrapper structure into a new `BasePageWrapper` component and refactored layout components to use it.
🎯 Why: To reduce deeply nested DOM nodes, improve readability, and centralize shared layout logic.
📸 Before/After: Shared wrapper logic like scanlines and navigation nodes were duplicated across 4 layout files; now centralized in `BasePageWrapper`.
♿ Accessibility: No changes to accessibility semantics.
