import fs from 'fs';

const p1 = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/Part1.json';
const p2 = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/Part2.json';

function inspectFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`--- File: ${filePath} ---`);
    console.log(`Length: ${content.length}`);
    const pos = 35186;
    if (content.length > pos) {
      console.log(`Snippet around ${pos}:`);
      console.log(content.substring(pos - 100, pos + 100));
    }
  }
}

inspectFile(p1);
inspectFile(p2);
