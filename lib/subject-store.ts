import type { Question, Flashcard, Terminology, FullSubjectData } from "@/lib/mold-types"

// ─── Demo Question Bank ───────────────────────────────────────────────────────
// 20 questions covering Theory of Computation, matching the DEMO_SUBJECT categories.
// In production, replace this with a real JSON import or API fetch.

const DEMO_QUESTIONS: Question[] = [
  // ── Finite Automata ──────────────────────────────────────────────────────
  {
    id: "q1", type: "MCQ", difficulty: "Easy", category: "finite-automata",
    question: "A Deterministic Finite Automaton (DFA) must have exactly how many transitions per state per input symbol?",
    options: [{ label: "A", text: "Zero" }, { label: "B", text: "One" }, { label: "C", text: "At most one" }, { label: "D", text: "Any number" }],
    answer: "B",
    explanation: "In a DFA, for every state and input symbol, there is exactly one transition — no ambiguity.",
    hint: "The 'D' in DFA stands for deterministic.",
  },
  {
    id: "q2", type: "TrueFalse", difficulty: "Easy", category: "finite-automata",
    question: "Every NFA (Non-deterministic Finite Automaton) has an equivalent DFA that accepts the same language.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "A",
    explanation: "By the subset construction theorem, every NFA can be converted to an equivalent DFA.",
    hint: "Think about the subset (powerset) construction.",
  },
  {
    id: "q3", type: "MCQ", difficulty: "Medium", category: "finite-automata",
    question: "Which of the following is NOT a closure property of regular languages?",
    options: [{ label: "A", text: "Union" }, { label: "B", text: "Intersection" }, { label: "C", text: "Complement" }, { label: "D", text: "Infinite intersection" }],
    answer: "D",
    explanation: "Regular languages are closed under finite Boolean operations, but an infinite intersection of regular languages need not be regular.",
    hint: "Consider what happens with infinitely many constraints.",
  },
  {
    id: "q4", type: "MCQ", difficulty: "Hard", category: "finite-automata",
    question: "The Pumping Lemma for regular languages states that for a sufficiently long string w, w can be split as xyz where which condition must hold?",
    options: [
      { label: "A", text: "|xy| ≤ p and y ≠ ε, and xy^i z ∈ L for all i ≥ 0" },
      { label: "B", text: "|xz| ≤ p and y ≠ ε, and xy^i z ∈ L for all i ≥ 1" },
      { label: "C", text: "|xy| ≤ p and x ≠ ε, and xy^i z ∈ L for all i ≥ 0" },
      { label: "D", text: "|y| ≤ p and y ≠ ε, and xy^i z ∈ L for all i ≥ 0" },
    ],
    answer: "A",
    explanation: "The Pumping Lemma requires |xy| ≤ p (the pumping length), y ≠ ε, and that xy^i z ∈ L for all i ≥ 0.",
    hint: "The constraint is on the prefix xy, not on x or z alone.",
  },

  // ── Context-Free Grammars ────────────────────────────────────────────────
  {
    id: "q5", type: "MCQ", difficulty: "Easy", category: "context-free",
    question: "Which of the following languages is context-free but NOT regular?",
    options: [
      { label: "A", text: "{ aⁿbⁿ | n ≥ 0 }" },
      { label: "B", text: "{ w | w has equal a's and b's (any order) }" },
      { label: "C", text: "{ a* }" },
      { label: "D", text: "A and B" },
    ],
    answer: "D",
    explanation: "Both { aⁿbⁿ } and the equal-count language are context-free but not regular. { a* } is regular.",
    hint: "Regular languages cannot count arbitrarily.",
  },
  {
    id: "q6", type: "TrueFalse", difficulty: "Medium", category: "context-free",
    question: "Context-free languages are closed under intersection.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "B",
    explanation: "CFL is NOT closed under intersection. The intersection of two CFLs may not be context-free (e.g. { aⁿbⁿcⁿ }).",
    hint: "Think about whether a PDA can track two simultaneous counts.",
  },
  {
    id: "q7", type: "MCQ", difficulty: "Hard", category: "context-free",
    question: "The Cocke-Younger-Kasami (CYK) algorithm parses a string of length n using a grammar in Chomsky Normal Form in time:",
    options: [{ label: "A", text: "O(n)" }, { label: "B", text: "O(n²)" }, { label: "C", text: "O(n³)" }, { label: "D", text: "O(2ⁿ)" }],
    answer: "C",
    explanation: "CYK is a dynamic programming algorithm with O(n³ |G|) time complexity, where |G| is the grammar size.",
    hint: "It fills a triangular table of size O(n²) with O(n) work per cell.",
  },

  // ── Turing Machines ──────────────────────────────────────────────────────
  {
    id: "q8", type: "MCQ", difficulty: "Easy", category: "turing-machines",
    question: "A Turing machine differs from a finite automaton primarily because it has:",
    options: [
      { label: "A", text: "More states" },
      { label: "B", text: "An infinite read/write tape" },
      { label: "C", text: "Multiple input alphabets" },
      { label: "D", text: "Non-deterministic transitions" },
    ],
    answer: "B",
    explanation: "The key distinction is the infinite read/write tape, giving Turing machines unlimited memory.",
    hint: "Think about what resource is unbounded.",
  },
  {
    id: "q9", type: "TrueFalse", difficulty: "Medium", category: "turing-machines",
    question: "A multi-tape Turing machine is strictly more powerful than a single-tape Turing machine.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "B",
    explanation: "Multi-tape TMs are more efficient (up to quadratic speedup) but accept exactly the same class of languages.",
    hint: "Power refers to what languages can be decided, not how fast.",
  },
  {
    id: "q10", type: "MCQ", difficulty: "Hard", category: "turing-machines",
    question: "The Church-Turing thesis states that:",
    options: [
      { label: "A", text: "Every function computable by an algorithm is computable by a Turing machine" },
      { label: "B", text: "Turing machines can solve NP-hard problems in polynomial time" },
      { label: "C", text: "All programming languages are equally expressive" },
      { label: "D", text: "Deterministic and non-deterministic TMs accept the same languages" },
    ],
    answer: "A",
    explanation: "The Church-Turing thesis is the claim that any effectively computable function is Turing-computable. It is a thesis, not a theorem.",
    hint: "It is a philosophical claim about the limits of algorithmic computation.",
  },

  // ── Complexity Theory ────────────────────────────────────────────────────
  {
    id: "q11", type: "MCQ", difficulty: "Easy", category: "complexity",
    question: "Which complexity class contains problems solvable in polynomial time by a deterministic TM?",
    options: [{ label: "A", text: "NP" }, { label: "B", text: "P" }, { label: "C", text: "PSPACE" }, { label: "D", text: "EXP" }],
    answer: "B",
    hint: "The 'P' stands for Polynomial.",
  },
  {
    id: "q12", type: "TrueFalse", difficulty: "Medium", category: "complexity",
    question: "If a problem is NP-complete, it means the problem is both in NP and NP-hard.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "A",
    explanation: "NP-complete is precisely the intersection of NP and NP-hard.",
  },
  {
    id: "q13", type: "MCQ", difficulty: "Hard", category: "complexity",
    question: "Cook's theorem (1971) established that which problem is NP-complete?",
    options: [
      { label: "A", text: "Graph Coloring" },
      { label: "B", text: "Boolean Satisfiability (SAT)" },
      { label: "C", text: "Knapsack" },
      { label: "D", text: "Travelling Salesman" },
    ],
    answer: "B",
    explanation: "Cook proved SAT was the first NP-complete problem, providing the foundation for NP-completeness theory.",
    hint: "This was the foundational NP-completeness result.",
  },
  {
    id: "q14", type: "MCQ", difficulty: "Hard", category: "complexity",
    question: "PSPACE is the class of problems solvable with polynomial space. Which containment is known to be strict?",
    options: [
      { label: "A", text: "P ⊊ PSPACE" },
      { label: "B", text: "NP ⊊ PSPACE" },
      { label: "C", text: "PSPACE ⊊ EXP" },
      { label: "D", text: "P ⊊ NP" },
    ],
    answer: "C",
    explanation: "By the Space Hierarchy Theorem, PSPACE ⊊ EXPSPACE, and by Savitch's theorem combined with time-space relations, PSPACE ⊊ EXP is known to be strict.",
    hint: "The hierarchy theorems prove strict containments for sufficiently different resource bounds.",
  },

  // ── Decidability ─────────────────────────────────────────────────────────
  {
    id: "q15", type: "TrueFalse", difficulty: "Easy", category: "decidability",
    question: "The Halting Problem is undecidable.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "A",
    explanation: "Turing proved in 1936 that no algorithm can determine whether an arbitrary program halts on arbitrary input.",
    hint: "This is one of the most famous results in computer science.",
  },
  {
    id: "q16", type: "MCQ", difficulty: "Medium", category: "decidability",
    question: "Rice's theorem states that any non-trivial semantic property of a Turing machine's language is:",
    options: [
      { label: "A", text: "Decidable" },
      { label: "B", text: "Semi-decidable" },
      { label: "C", text: "Undecidable" },
      { label: "D", text: "In NP" },
    ],
    answer: "C",
    explanation: "Rice's theorem proves that all non-trivial properties of the languages accepted by TMs are undecidable.",
    hint: "This is a sweeping undecidability result derived from the Halting Problem.",
  },
  {
    id: "q17", type: "MCQ", difficulty: "Hard", category: "decidability",
    question: "A language is recursively enumerable (RE) if and only if:",
    options: [
      { label: "A", text: "A TM decides it (halts on all inputs)" },
      { label: "B", text: "A TM recognizes it (halts and accepts on strings in the language; may loop on others)" },
      { label: "C", text: "A finite automaton accepts it" },
      { label: "D", text: "A PDA accepts it" },
    ],
    answer: "B",
    explanation: "Recursively enumerable means a TM recognizer exists — it accepts strings in L but may loop on strings not in L.",
    hint: "RE does not require the TM to halt on all inputs.",
  },

  // ── Regular Languages ────────────────────────────────────────────────────
  {
    id: "q18", type: "MCQ", difficulty: "Easy", category: "regular-languages",
    question: "Which formalism is NOT equivalent in expressive power to regular languages?",
    options: [
      { label: "A", text: "DFA" },
      { label: "B", text: "NFA" },
      { label: "C", text: "Regular expressions" },
      { label: "D", text: "Pushdown automata" },
    ],
    answer: "D",
    explanation: "PDAs recognise context-free languages, which strictly contain the regular languages.",
    hint: "PDAs have a stack which provides extra memory.",
  },
  {
    id: "q19", type: "TrueFalse", difficulty: "Medium", category: "regular-languages",
    question: "The complement of every regular language is also regular.",
    options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
    answer: "A",
    explanation: "Regular languages are closed under complement — simply swap accept/reject states in the DFA.",
    hint: "Closure under complement follows directly from DFA construction.",
  },
  {
    id: "q20", type: "MCQ", difficulty: "Hard", category: "regular-languages",
    question: "Myhill-Nerode theorem provides a necessary and sufficient condition for a language to be regular. It characterises regularity by:",
    options: [
      { label: "A", text: "Existence of a regular grammar" },
      { label: "B", text: "Finiteness of the number of equivalence classes of the Myhill-Nerode relation" },
      { label: "C", text: "Pumping Lemma being satisfied" },
      { label: "D", text: "Existence of an NFA with polynomial states" },
    ],
    answer: "B",
    explanation: "The Myhill-Nerode theorem says a language is regular iff the right congruence relation ≡_L has finitely many equivalence classes.",
    hint: "Each equivalence class corresponds to a DFA state in the minimal automaton.",
  },
]

const DEMO_FLASHCARDS: Flashcard[] = [
  { id: "f1", term: "DFA", definition: "Deterministic Finite Automaton — a 5-tuple (Q, Σ, δ, q₀, F) where δ: Q × Σ → Q is a total function.", category: "finite-automata" },
  { id: "f2", term: "NFA", definition: "Non-deterministic Finite Automaton — transitions may lead to multiple states or ε-moves.", category: "finite-automata" },
  { id: "f3", term: "Context-Free Grammar", definition: "A grammar G = (V, Σ, R, S) whose productions have the form A → γ, used to generate context-free languages.", category: "context-free" },
  { id: "f4", term: "Pushdown Automaton (PDA)", definition: "A finite automaton augmented with a stack, recognising exactly the context-free languages.", category: "context-free" },
  { id: "f5", term: "Turing Machine", definition: "A 7-tuple model of computation with an infinite tape and read/write head, defining the class of decidable/RE languages.", category: "turing-machines" },
  { id: "f6", term: "P", definition: "The class of decision problems solvable by a deterministic TM in polynomial time.", category: "complexity" },
  { id: "f7", term: "NP", definition: "The class of decision problems verifiable in polynomial time; equivalently, solvable by a non-deterministic TM in polynomial time.", category: "complexity" },
  { id: "f8", term: "NP-Complete", definition: "A problem in NP to which every NP problem polynomial-time reduces. SAT was the first NP-complete problem (Cook, 1971).", category: "complexity" },
  { id: "f9", term: "Halting Problem", definition: "The problem of determining whether an arbitrary TM halts on a given input — proven undecidable by Turing (1936).", category: "decidability" },
  { id: "f10", term: "Rice's Theorem", definition: "All non-trivial semantic properties of TM-computed languages are undecidable.", category: "decidability" },
]

const DEMO_TERMINOLOGY: Terminology = {
  "finite-automata": [
    { term: "Transition function δ", definition: "Maps (state, symbol) → state(s). Total in DFA, partial/powerset in NFA." },
    { term: "Accepting state", definition: "A state in F; if the TM halts in an accepting state, the input is accepted." },
  ],
  "complexity": [
    { term: "Polynomial reduction", definition: "A function f computable in polynomial time such that x ∈ L iff f(x) ∈ L'." },
    { term: "Certificate", definition: "A witness w allowing efficient verification that x ∈ L, used to define NP." },
  ],
}

// ─── Full demo subject in FullSubjectData shape ───────────────────────────────

export const DEMO_FULL_SUBJECT: FullSubjectData = {
  id: "theory-of-computation",
  name: "Theory of Computation",
  config: {
    title: "Theory of Computation",
    description: "Automata, formal languages, Turing machines, and computational complexity.",
    version: "2.0",
    storageKey: "mold_toc",
  },
  questions: DEMO_QUESTIONS,
  flashcards: DEMO_FLASHCARDS,
  terminology: DEMO_TERMINOLOGY,
  achievements: [],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive CategoryData[] from a FullSubjectData (used by SetupPanel / TargetSector grid) */
import type { CategoryData } from "@/lib/mold-types"

export function deriveCategoriesFromSubject(subject: FullSubjectData): CategoryData[] {
  const map = new Map<string, { name: string; count: number }>()

  for (const q of subject.questions) {
    const existing = map.get(q.category)
    if (existing) {
      existing.count++
    } else {
      // Humanise the id: "finite-automata" → "Finite Automata"
      const name = q.category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      map.set(q.category, { name, count: 1 })
    }
  }

  return Array.from(map.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    questionCount: count,
  }))
}
