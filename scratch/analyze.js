const fs = require('fs');

const content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf8');

// Find autoFixSingleQuestion
const autoFixMatch = content.match(/function autoFixSingleQuestion\([\s\S]*?return qFixed;\n\}/);
if (autoFixMatch) {
    console.log("Found autoFixSingleQuestion. Length:", autoFixMatch[0].length);
}

// Find balanceJsonStack
const balanceMatch = content.match(/function balanceJsonStack\([\s\S]*?return balanced\n\}/);
if (balanceMatch) {
    console.log("Found balanceJsonStack. Length:", balanceMatch[0].length);
}
