const fs = require('fs');

const path = 'lib/subject/subject-persistence.ts';
let code = fs.readFileSync(path, 'utf8');

const regex = /\} else if \(char === '\}'\) \{[\s\S]*?\} else if \(char === '\]'\) \{[\s\S]*?\n    \}/g;

const replacement = `} else if (char === '}' || char === ']') {
      const isBrace = char === '}';
      const target = isBrace ? '{' : '[';
      const top = stack[stack.length - 1];

      if (top === target) {
        stack.pop();
        if (isBrace) braceCount--; else bracketCount--;
        continue;
      }

      if ((isBrace && braceCount === 0) || (!isBrace && bracketCount === 0)) continue;

      let idx = stack.length - 1;
      while (idx >= 0 && stack[idx] !== target) {
        if (stack[idx] === '{') braceCount--;
        if (stack[idx] === '[') bracketCount--;
        idx--;
      }
      if (idx >= 0) {
        stack.length = idx;
        if (isBrace) braceCount--; else bracketCount--;
      }
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('lib/subject/subject-persistence.ts', code);
