const fs = require('fs');
const content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf8');

const regex = /(function balanceJsonStack\(str: string\): string \{[\s\S]*?\n\})/;
const match = content.match(regex);
if (match) {
    console.log("Found balanceJsonStack");
} else {
    console.log("Could not find balanceJsonStack");
}
