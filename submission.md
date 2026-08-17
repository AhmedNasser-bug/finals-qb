🎨 Palette: [Add aria-label to import button in top nav bar]

💡 What:
Added an explicit `aria-label` to the 'Import New Subject JSON' icon button in the `TopNavBar` component.

🎯 Why:
The button only contained visible text when rendered on larger screens (and was otherwise an icon-only button). The `aria-label` provides a consistent, explicit description for screen readers, improving accessibility and adherence to WCAG guidelines.

📸 Before/After:
Before: `<button title="Import New Subject JSON" ...>`
After: `<button title="Import New Subject JSON" aria-label="Import New Subject JSON" ...>`

♿ Accessibility:
Provides a clear, programmatic label for assistive technologies navigating the top navigation bar.
