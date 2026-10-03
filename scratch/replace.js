const fs = require('fs');
let content = fs.readFileSync('lib/subject/subject-persistence.ts', 'utf8');

// The instruction is to refactor blocks exhibiting complex conditional hierarchies.
// autoFixSingleQuestion and balanceJsonStack are two prime candidates.

const autoFixRegex = /(function autoFixSingleQuestion\([\s\S]*?return qFixed;\n\})/;

let autoFixReplacement = `function autoFixSingleQuestion(
  qObj: Record<string, unknown>,
  i: number,
  seenIds: Set<string>,
  VALID_TYPES: Set<string>,
  VALID_DIFFICULTIES: Set<string>,
  warnings: string[]
): boolean {
  let qFixed = false;

  // 1. Auto-Fix ID
  if (typeof qObj.id !== "string" || qObj.id.trim() === "") {
    qObj.id = \`q-gen-\${i + 1}\`;
    qFixed = true;
  } else if (seenIds.has(qObj.id as string)) {
    const oldId = qObj.id as string;
    qObj.id = \`\${oldId}-\${i}\`;
    seenIds.add(qObj.id as string);
    warnings.push(\`questions[\${i}]: Duplicate ID "\${oldId}" automatically renamed to "\${qObj.id}".\`);
    qFixed = true;
  } else {
    seenIds.add(qObj.id as string);
  }

  // 2. Auto-Fix Type
  if (typeof qObj.type !== "string" || !VALID_TYPES.has(qObj.type)) {
    const originalType = qObj.type;
    qObj.type = Array.isArray(qObj.options) && qObj.options.length === 2 ? "TrueFalse" : "MCQ";
    warnings.push(\`questions[\${i}]: Invalid type "\${originalType}" automatically set to "\${qObj.type}".\`);
    qFixed = true;
  }

  if (qObj.type === "TrueFalse" && Array.isArray(qObj.options) && qObj.options.length !== 2) {
    qObj.type = "MCQ";
    warnings.push(\`questions[\${i}]: TrueFalse question had \${qObj.options.length} options; converted to MCQ.\`);
    qFixed = true;
  }

  // 3. Auto-Fix Difficulty
  if (typeof qObj.difficulty !== "string" || !VALID_DIFFICULTIES.has(qObj.difficulty)) {
    qObj.difficulty = "Medium";
    qFixed = true;
  }

  // 4. Auto-Fix Category
  if (typeof qObj.category !== "string" || qObj.category.trim() === "") {
    qObj.category = "general";
    qFixed = true;
  }

  // 5. Auto-Fix Question Text
  if (typeof qObj.question !== "string" || qObj.question.trim() === "") {
    qObj.question = "No question text provided.";
    qFixed = true;
  }

  // 6. Auto-Fix Options
  if (!Array.isArray(qObj.options) || qObj.options.length < 2) {
    if (qObj.type === "TrueFalse") {
      qObj.options = [{ label: "A", text: "True" }, { label: "B", text: "False" }];
    } else {
      qObj.options = [
        { label: "A", text: "Option A" },
        { label: "B", text: "Option B" },
        { label: "C", text: "Option C" },
        { label: "D", text: "Option D" },
      ];
    }
    warnings.push(\`questions[\${i}]: Missing options — generated default choices.\`);
    qFixed = true;
  }

  const labels = ["A", "B", "C", "D", "E", "F"];
  const normalizedOptions = new Array((qObj.options as unknown[]).length);
  for (let optIdx = 0; optIdx < (qObj.options as unknown[]).length; optIdx++) {
    const opt = (qObj.options as any[])[optIdx];
    if (typeof opt !== "object" || opt === null) {
      normalizedOptions[optIdx] = { label: labels[optIdx] || "X", text: "Option Option" };
    } else {
      const label = typeof opt.label === "string" && opt.label.trim() !== "" ? opt.label.toUpperCase() : (labels[optIdx] || "X");
      const text = typeof opt.text === "string" && opt.text.trim() !== "" ? opt.text : \`Option \${label}\`;
      normalizedOptions[optIdx] = { label, text };
    }
  }
  qObj.options = normalizedOptions;

  // Helper for answer mapping
  const tryMapBooleanAnswer = () => {
    if (qObj.type !== "TrueFalse" && normalizedOptions.length !== 2) return false;
    const isTrueMatch = ["TRUE", "YES", "T", "1"].includes(qObj.answer as string);
    const isFalseMatch = ["FALSE", "NO", "F", "0"].includes(qObj.answer as string);

    if (isTrueMatch || isFalseMatch) {
      const oldAnswer = qObj.answer;
      qObj.answer = isTrueMatch ? "A" : "B";
      warnings.push(\`questions[\${i}]: Boolean answer "\${oldAnswer}" automatically mapped to option label "\${qObj.answer}".\`);
      qFixed = true;
      return true;
    }
    return false;
  };

  const tryMapTextAnswer = () => {
    const matchedOpt = normalizedOptions.find((opt: any) => opt.text.toUpperCase() === qObj.answer);
    if (matchedOpt) {
      const oldAnswer = qObj.answer;
      qObj.answer = matchedOpt.label;
      warnings.push(\`questions[\${i}]: Answer text "\${oldAnswer}" automatically remapped to label "\${qObj.answer}".\`);
      qFixed = true;
      return true;
    }
    return false;
  };

  const applyDefaultAnswer = () => {
    const oldAnswer = qObj.answer;
    qObj.answer = normalizedOptions[0].label;
    warnings.push(\`questions[\${i}]: Unresolved answer "\${oldAnswer}" automatically reset to first option label "\${qObj.answer}".\`);
    qFixed = true;
  };

  // 7. Auto-Fix Answer
  if (typeof qObj.answer !== "string" || qObj.answer.trim() === "") {
    qObj.answer = "A";
    qFixed = true;
  } else {
    qObj.answer = qObj.answer.toUpperCase().trim();
    const hasLabel = normalizedOptions.some((opt: any) => opt.label === qObj.answer);

    if (!hasLabel) {
      if (!tryMapTextAnswer()) {
        if (!tryMapBooleanAnswer()) {
          applyDefaultAnswer();
        }
      }
    }
  }

  // 8. Auto-Fix Explanation and Hint
  if (typeof qObj.explanation !== "string" || qObj.explanation.trim() === "") {
    qObj.explanation = \`Option \${qObj.answer} is correct.\`;
    qFixed = true;
  }
  if (typeof qObj.hint !== "string" || qObj.hint.trim() === "") {
    qObj.hint = "Focus on the key terminology and relationships described.";
    qFixed = true;
  }

  return qFixed;
}`;

let newContent = content.replace(autoFixRegex, autoFixReplacement);

// balanceJsonStack replacement
const balanceRegex = /(function balanceJsonStack\(str: string\): string \{[\s\S]*?\n\})/;

let balanceReplacement = `function balanceJsonStack(str: string): string {
  const stack: ("{" | "[")[] = []
  let inString = false
  let escaped = false

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
    } else if (char === '[') {
      stack.push('[')
    } else if (char === '}') {
      processStackClosure(stack, '}')
    } else if (char === ']') {
      processStackClosure(stack, ']')
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

newContent = newContent.replace(balanceRegex, balanceReplacement);

fs.writeFileSync('scratch/subject-persistence.ts', newContent, 'utf8');
console.log("Wrote scratch file.");
