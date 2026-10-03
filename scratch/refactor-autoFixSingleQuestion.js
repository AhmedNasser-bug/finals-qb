const fs = require('fs');
const content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf8');

const targetFunctionMatch = content.match(/function autoFixSingleQuestion\([\s\S]*?return qFixed;\n\}/);
if (!targetFunctionMatch) {
    console.error("Function autoFixSingleQuestion not found");
    process.exit(1);
}

const originalFunction = targetFunctionMatch[0];
console.log("Original function length:", originalFunction.length);
