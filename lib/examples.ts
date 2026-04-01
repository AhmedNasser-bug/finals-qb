import { FullSubjectData } from "./mold-types"

export const EXAMPLES = [
  {
    id: "jp-n5",
    name: "Japanese N5 Vocab",
    version: "1.0.0",
    description: "A foundational set of vocabulary required for the JLPT N5 examination.",
    totalQuestions: 5,
    totalFlashcards: 2,
    totalCategories: 2
  },
  {
    id: "classical-mechanics",
    name: "Classical Mechanics",
    version: "1.0.0",
    description: "Core principles of classical physics, including Newton's laws and kinematics.",
    totalQuestions: 2,
    totalFlashcards: 1,
    totalCategories: 1
  }
];

export function getExampleSubject(id: string): FullSubjectData | null {
  if (id === "jp-n5") {
    return {
      id: "jp-n5",
      name: "Japanese N5 Vocab",
      config: {
        title: "Japanese N5 Vocab",
        description: "A foundational set of vocabulary required for the JLPT N5 examination.",
        version: "1.0.0"
      },
      categories: [
        { id: "verbs", name: "Verbs", description: "Common verbs" },
        { id: "nouns", name: "Nouns", description: "Common nouns" }
      ],
      questions: [
        { id: "q1", category: "verbs", type: "MCQ", question: "To eat", options: [{label:"A",text:"Taberu"}, {label:"B",text:"Nomu"}], answer: "A", explanation: "Taberu means to eat.", difficulty: "Easy" },
        { id: "q2", category: "verbs", type: "MCQ", question: "To drink", options: [{label:"A",text:"Taberu"}, {label:"B",text:"Nomu"}], answer: "B", explanation: "Nomu means to drink.", difficulty: "Easy" },
        { id: "q3", category: "nouns", type: "MCQ", question: "Cat", options: [{label:"A",text:"Neko"}, {label:"B",text:"Inu"}], answer: "A", explanation: "Neko means cat.", difficulty: "Easy" },
        { id: "q4", category: "nouns", type: "MCQ", question: "Dog", options: [{label:"A",text:"Neko"}, {label:"B",text:"Inu"}], answer: "B", explanation: "Inu means dog.", difficulty: "Easy" },
        { id: "q5", category: "nouns", type: "MCQ", question: "Bird", options: [{label:"A",text:"Neko"}, {label:"B",text:"Tori"}], answer: "B", explanation: "Tori means bird.", difficulty: "Easy" }
      ],
      flashcards: [
        { id: "f1", category: "verbs", term: "To eat", definition: "Taberu" },
        { id: "f2", category: "nouns", term: "Cat", definition: "Neko" }
      ],
      achievements: [], terminology: {}
    }
  }

  if (id === "classical-mechanics") {
    return {
      id: "classical-mechanics",
      name: "Classical Mechanics",
      config: {
        title: "Classical Mechanics",
        description: "Core principles of classical physics, including Newton's laws and kinematics.",
        version: "1.0.0"
      },
      categories: [
        { id: "newton", name: "Newton's Laws", description: "The three laws of motion" }
      ],
      questions: [
        { id: "q1", category: "newton", type: "MCQ", question: "F = ?", options: [{label:"A",text:"ma"}, {label:"B",text:"mv"}], answer: "A", explanation: "Force equals mass times acceleration.", difficulty: "Easy" },
        { id: "q2", category: "newton", type: "TrueFalse", question: "Every action has an equal and opposite reaction.", options: [{label:"A",text:"True"}, {label:"B",text:"False"}], answer: "A", explanation: "Newton's Third Law.", difficulty: "Easy" }
      ],
      flashcards: [
        { id: "f1", category: "newton", term: "Newton's Second Law", definition: "F = ma" }
      ],
      achievements: [], terminology: {}
    }
  }

  return null
}
