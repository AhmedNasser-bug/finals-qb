const fs = require('fs');
let content = fs.readFileSync('components/mold/home/stats-screen.tsx', 'utf-8');

// Add title to 'onReturnHome' button
content = content.replace(
  /(<button\s*onClick={onReturnHome}[^>]*?)(>)/,
  `$1 title="Return to core"$2`
);

// Add title to 'handleReset' confirmation buttons
content = content.replace(
   /(<button\s*onClick={handleReset}[^>]*?)(>)/,
   `$1 title="Confirm Wipe Data"$2`
);

content = content.replace(
  /(<button\s*onClick=\{\(\) => setShowConfirmReset\(false\)\}[^>]*?)(>)/,
  `$1 title="Cancel Wipe Data"$2`
);

// Add aria-hidden to decorative icons
const icons = ['ArrowLeft', 'AlertTriangle'];
icons.forEach(icon => {
  content = content.replace(new RegExp(`(<${icon} [^>]+?)( /)?(>)`, 'g'), `$1 aria-hidden="true" />`);
});

fs.writeFileSync('components/mold/home/stats-screen.tsx', content);
