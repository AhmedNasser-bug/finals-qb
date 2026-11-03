const { performance } = require('perf_hooks');

const BLOOMS_TAXONOMY_WEIGHTS = {
  // Level 1: Remember / Recall / Knowledge
  remember: 1,
  recall: 1,
  knowledge: 1,
  // Level 2: Understand / Comprehension
  understand: 2,
  comprehend: 2,
  comprehension: 2,
  // Level 3: Apply / Application
  apply: 3,
  application: 3,
  // Level 4: Analyze / Analysis
  analyze: 4,
  analysis: 4,
  // Level 5: Evaluate / Evaluation
  evaluate: 5,
  evaluation: 5,
  // Level 6: Create / Synthesis
  create: 6,
  synthesis: 6,

  // Question difficulty fallbacks
  easy: 1,
  medium: 3,
  hard: 5,
}

function getBloomsWeight(q) {
  if (q.bloomsLevel && typeof q.bloomsLevel === "number") {
    return q.bloomsLevel
  }
  const taxonomy = q.bloomsTaxonomy || q.taxonomy || q.blooms
  if (taxonomy && typeof taxonomy === "string") {
    const key = taxonomy.trim().toLowerCase()
    if (BLOOMS_TAXONOMY_WEIGHTS[key] !== undefined) {
      return BLOOMS_TAXONOMY_WEIGHTS[key]
    }
  }
  if (q.difficulty) {
    const key = q.difficulty.trim().toLowerCase()
    if (BLOOMS_TAXONOMY_WEIGHTS[key] !== undefined) {
      return BLOOMS_TAXONOMY_WEIGHTS[key]
    }
  }
  return 3 // Default to Medium / Apply
}

const questions = [];
for (let i = 0; i < 10000; i++) {
    const difficulties = [' Easy ', '  mEdium', 'Hard   ', 'unknown'];
    questions.push({
        id: 'q' + i,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        category: 'cat1'
    });
}

function runOld() {
    const sorted = [...questions].sort((a, b) => {
        const weightA = getBloomsWeight(a)
        const weightB = getBloomsWeight(b)
        return weightA - weightB
    })
    return sorted;
}

function runNew() {
    const weightMap = new Map();
    for (let i = 0; i < questions.length; i++) {
        weightMap.set(questions[i].id, getBloomsWeight(questions[i]));
    }
    const sorted = [...questions].sort((a, b) => {
        return weightMap.get(a.id) - weightMap.get(b.id)
    });
    return sorted;
}

const start1 = performance.now();
for (let i=0; i<50; i++) runOld();
const end1 = performance.now();
console.log(`Old: ${end1 - start1}ms`);

const start2 = performance.now();
for (let i=0; i<50; i++) runNew();
const end2 = performance.now();
console.log(`New: ${end2 - start2}ms`);
