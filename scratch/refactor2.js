const fs = require('fs');
const path = 'lib/subject/subject-persistence.ts';
let code = fs.readFileSync(path, 'utf8');

const target = `  let balanced = str.trim()
  const balancedChunks: string[] = [balanced]
  if (inString) balancedChunks.push('"')

  if (balancedChunks[0].endsWith(",")) {
    balancedChunks[0] = balancedChunks[0].slice(0, -1)
  }`;

const newCode = `  let balanced = str.trim()
  if (inString) balanced += '"'

  if (balanced.endsWith(",")) {
    balanced = balanced.slice(0, -1)
  }

  const balancedChunks: string[] = [balanced]`;

code = code.replace(target, newCode);
fs.writeFileSync(path, code);
