const fs = require('fs');
const content = fs.readFileSync('components/mold/home/side-nav-bar.tsx', 'utf-8');
const iconRegex = /<(TerminalIcon|BookOpen|Trophy|RotateCcw|Plus|BarChart3|Sparkles|Download|FileText|Terminal)[^>]*>/g;
const icons = content.match(iconRegex);
if(icons) {
  icons.forEach((icon, index) => {
    if (!icon.includes('aria-hidden')) {
      console.log(`Icon ${index + 1} missing aria-hidden: ${icon}`);
    }
  });
}
