const fs = require('fs');
const content = fs.readFileSync('components/mold/home/stats-screen.tsx', 'utf-8');
const buttonRegex = /<button[\s\S]*?<\/button>/g;
const buttons = content.match(buttonRegex);
if(buttons) {
  buttons.forEach((btn, index) => {
    if (!btn.includes('title=')) {
      console.log(`Button ${index + 1} missing title: ${btn.slice(0, 50).replace(/\n/g, ' ')}...`);
    }
  });
}
