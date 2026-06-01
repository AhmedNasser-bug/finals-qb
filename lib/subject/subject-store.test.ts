import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { deriveCategoriesFromSubject } from "./subject-store.ts";
import type { FullSubjectData } from "../types/mold-types.ts";

describe("deriveCategoriesFromSubject", () => {
  const baseSubject: Omit<FullSubjectData, "questions"> = {
    id: "sub-1",
    name: "Test Subject",
    config: {
      title: "Test",
      description: "Test",
    },
  };

  test("returns empty array when questions are empty", () => {
    const subject: FullSubjectData = { ...baseSubject, questions: [] };
    const result = deriveCategoriesFromSubject(subject);
    assert.deepEqual(result, []);
  });

  test("groups questions by category and formats names correctly", () => {
    const subject: FullSubjectData = {
      ...baseSubject,
      questions: [
        { id: "q1", category: "math", type: "MCQ", difficulty: "Easy", question: "q1", options: [], answer: "A" },
        { id: "q2", category: "math", type: "MCQ", difficulty: "Easy", question: "q2", options: [], answer: "A" },
        { id: "q3", category: "science", type: "MCQ", difficulty: "Easy", question: "q3", options: [], answer: "A" },
        { id: "q4", category: "computer-science-basics", type: "MCQ", difficulty: "Easy", question: "q4", options: [], answer: "A" },
      ]
    };
    const result = deriveCategoriesFromSubject(subject);
    assert.strictEqual(result.length, 3);

    // Check Math category
    const mathCat = result.find(c => c.id === "math");
    assert.ok(mathCat);
    assert.strictEqual(mathCat.name, "Math");
    assert.strictEqual(mathCat.questionCount, 2);

    // Check Science category
    const scienceCat = result.find(c => c.id === "science");
    assert.ok(scienceCat);
    assert.strictEqual(scienceCat.name, "Science");
    assert.strictEqual(scienceCat.questionCount, 1);

    // Check Computer Science Basics category
    const csCat = result.find(c => c.id === "computer-science-basics");
    assert.ok(csCat);
    assert.strictEqual(csCat.name, "Computer Science Basics");
    assert.strictEqual(csCat.questionCount, 1);
  });
});
