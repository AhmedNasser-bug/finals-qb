const fs = require('fs');

let content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf-8');

const target = `function balanceJsonStack(str: string): string {
  const stack: ("{" | "[")[] = []
  let inString = false
  let escaped = false

  let braceCount = 0;
  let bracketCount = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue;

    if (char === '{') {
      stack.push('{')
      braceCount++
    } else if (char === '[') {
      stack.push('[')
      bracketCount++
    } else if (char === '}') {
      if (stack[stack.length - 1] === '{') {
        stack.pop()
        braceCount--
      } else if (braceCount > 0) {
        let idx = stack.length - 1
        while (idx >= 0 && stack[idx] !== '{') {
          if (stack[idx] === '[') bracketCount--
          idx--
        }
        if (idx >= 0) {
          stack.length = idx
          braceCount--
        }
      }
    } else if (char === ']') {
      if (stack[stack.length - 1] === '[') {
        stack.pop()
        bracketCount--
      } else if (bracketCount > 0) {
        let idx = stack.length - 1
        while (idx >= 0 && stack[idx] !== '[') {
          if (stack[idx] === '{') braceCount--
          idx--
        }
        if (idx >= 0) {
          stack.length = idx
          bracketCount--
        }
      }
    }
  }

  let balanced = str.trim()
  if (inString) balanced += '"'

  if (balanced.endsWith(",")) {
    balanced = balanced.slice(0, -1)
  }

  while (stack.length > 0) {
    const top = stack.pop()
    if (top === '{') balanced += '}'
    else if (top === '[') balanced += ']'
  }

  return balanced
}`;

const replacement = `function balanceJsonStack(str: string): string {
  const stack: ("{" | "[")[] = []
  let inString = false
  let escaped = false

  const counts = { brace: 0, bracket: 0 };

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue;

    if (char === '{') {
      stack.push('{')
      counts.brace++
    } else if (char === '[') {
      stack.push('[')
      counts.bracket++
    } else if (char === '}' || char === ']') {
      processStackClosure(stack, char, counts);
    }
  }

  let balanced = str.trim()
  if (inString) balanced += '"'

  if (balanced.endsWith(",")) {
    balanced = balanced.slice(0, -1)
  }

  while (stack.length > 0) {
    const top = stack.pop()
    if (top === '{') balanced += '}'
    else if (top === '[') balanced += ']'
  }

  return balanced
}`;

if (content.includes(target)) {
  fs.writeFileSync('lib/subject/subject-persistence.ts', content.replace(target, replacement));
  console.log('subject-persistence.ts balanced patched successfully');
} else {
  console.log('subject-persistence.ts balanced target not found');
}
