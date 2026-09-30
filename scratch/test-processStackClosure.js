function processStackClosure(stack, char, braceCount, bracketCount) {
  const expectedOpen = char === '}' ? '{' : '[';
  if (stack[stack.length - 1] === expectedOpen) {
    stack.pop();
    if (char === '}') braceCount--;
    else bracketCount--;
    return { braceCount, bracketCount };
  }

  if (char === '}' && braceCount <= 0) return { braceCount, bracketCount };
  if (char === ']' && bracketCount <= 0) return { braceCount, bracketCount };

  const idx = stack.lastIndexOf(expectedOpen);
  if (idx !== -1) {
    for (let j = idx + 1; j < stack.length; j++) {
      if (stack[j] === '[') bracketCount--;
      if (stack[j] === '{') braceCount--;
    }
    stack.length = idx;
    if (char === '}') braceCount--;
    else bracketCount--;
  }

  return { braceCount, bracketCount };
}

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
    } else if (char === '}' || char === ']') {
      const counts = processStackClosure(stack, char, braceCount, bracketCount);
      braceCount = counts.braceCount;
      bracketCount = counts.bracketCount;
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
