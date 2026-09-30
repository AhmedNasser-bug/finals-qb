function balanceJsonStack(str) {
  const stack = [];
  let inString = false;
  let escaped = false;

  let braceCount = 0;
  let bracketCount = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      stack.push('{');
      braceCount++;
    } else if (char === '[') {
      stack.push('[');
      bracketCount++;
    } else if (char === '}') {
      if (stack[stack.length - 1] === '{') {
        stack.pop();
        braceCount--;
      } else if (braceCount > 0) {
        // Find the last '{'
        const idx = stack.lastIndexOf('{');
        if (idx !== -1) {
          // Adjust bracket counts for any dropped '['
          for (let j = idx + 1; j < stack.length; j++) {
            if (stack[j] === '[') bracketCount--;
          }
          stack.length = idx;
          braceCount--;
        }
      }
    } else if (char === ']') {
      if (stack[stack.length - 1] === '[') {
        stack.pop();
        bracketCount--;
      } else if (bracketCount > 0) {
        // Find the last '['
        const idx = stack.lastIndexOf('[');
        if (idx !== -1) {
          // Adjust brace counts for any dropped '{'
          for (let j = idx + 1; j < stack.length; j++) {
            if (stack[j] === '{') braceCount--;
          }
          stack.length = idx;
          bracketCount--;
        }
      }
    }
  }

  let balanced = str.trim();
  if (inString) balanced += '"';

  if (balanced.endsWith(",")) {
    balanced = balanced.slice(0, -1);
  }

  while (stack.length > 0) {
    const top = stack.pop();
    if (top === '{') balanced += '}';
    else if (top === '[') balanced += ']';
  }

  return balanced;
}
console.log(balanceJsonStack('{"a": [1, 2, '));
console.log(balanceJsonStack('{"a": [1, 2, ]}'));
