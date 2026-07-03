const fs = require('fs');
const content = fs.readFileSync('components/mold/home/stats-screen.tsx', 'utf-8');
const iconRegex = /<(ArrowLeft|AlertTriangle)[^>]*>/g;
const icons = content.match(iconRegex);
if(icons) {
  icons.forEach((icon, index) => {
    if (!icon.includes('aria-hidden')) {
      console.log(`Icon ${index + 1} missing aria-hidden: ${icon}`);
    }
  });
}
