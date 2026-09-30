const fs = require('fs');

let content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf-8');

const target = `function processStackClosure(stack: ("{" | "[")[], char: string) {
  const expectedOpen = char === '}' ? '{' : '[';
  if (stack[stack.length - 1] === expectedOpen) {
    stack.pop();
    return;
  }
  const idx = stack.lastIndexOf(expectedOpen);
  if (idx !== -1) stack.splice(idx);
}`;

const replacement = `function processStackClosure(stack: ("{" | "[")[], char: string, counts: { brace: number, bracket: number }) {
  const expectedOpen = char === '}' ? '{' : '[';
  if (stack[stack.length - 1] === expectedOpen) {
    stack.pop();
    if (char === '}') counts.brace--;
    else counts.bracket--;
    return;
  }

  if (char === '}' && counts.brace <= 0) return;
  if (char === ']' && counts.bracket <= 0) return;

  const idx = stack.lastIndexOf(expectedOpen);
  if (idx !== -1) {
    for (let j = idx + 1; j < stack.length; j++) {
      if (stack[j] === '[') counts.bracket--;
      if (stack[j] === '{') counts.brace--;
    }
    stack.length = idx;
    if (char === '}') counts.brace--;
    else counts.bracket--;
  }
}`;

if (content.includes(target)) {
  fs.writeFileSync('lib/subject/subject-persistence.ts', content.replace(target, replacement));
  console.log('subject-persistence.ts patched successfully');
} else {
  console.log('subject-persistence.ts target not found');
}
