const fs = require('fs');
let content = fs.readFileSync('components/mold/home/side-nav-bar.tsx', 'utf-8');

// The previous regex for icons ended up matching the closing /> and replaced it with /> aria-hidden="true"> which is invalid HTML
// e.g. <TerminalIcon className="w-4 h-4" / aria-hidden="true">

const icons = ['TerminalIcon', 'BarChart3', 'BookOpen', 'Trophy', 'RotateCcw', 'Plus', 'Sparkles', 'Download', 'FileText'];
icons.forEach(icon => {
  content = content.replace(new RegExp(`(<${icon} [^>]+?)( / aria-hidden="true"| /)>`, 'g'), `$1 aria-hidden="true" />`);
});
fs.writeFileSync('components/mold/home/side-nav-bar.tsx', content);
