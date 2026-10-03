const fs = require('fs');
const content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf8');

const match = content.match(/if \(typeof qObj\.answer !== "string".*?return qFixed;/s);
if (match) {
    console.log(match[0]);
} else {
    console.log("No match found");
}
