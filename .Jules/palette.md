## 2024-05-10 - Add Focus Visible to Interactive Buttons
**Learning:** Found that custom buttons within `game-screen.tsx` were lacking `focus-visible` states, a common a11y issue in custom Next.js components. Keyboard users had no visual indicator of their focused element.
**Action:** When creating custom interactive elements (buttons, toggles, etc.), always add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color]` tailwind classes to ensure WCAG compliant focus indicators.
