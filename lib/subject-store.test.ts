import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { deriveCategoriesFromSubject } from "./subject-store.ts";
import type { FullSubjectData, Question } from "./mold-types.ts";

describe("subject-store", () => {
  describe("deriveCategoriesFromSubject", () => {
    test("handles empty questions array", () => {
      const subject: FullSubjectData = {
        id: "test",
        name: "Test",
        config: { title: "Test", description: "Desc" },
        questions: []
      };

      const categories = deriveCategoriesFromSubject(subject);
      assert.deepEqual(categories, []);
    });

    test("counts single category correctly and formats name", () => {
      const subject: FullSubjectData = {
        id: "test",
        name: "Test",
        config: { title: "Test", description: "Desc" },
        questions: [
          { category: "finite-automata" } as Question,
          { category: "finite-automata" } as Question,
          { category: "finite-automata" } as Question
        ]
      };

      const categories = deriveCategoriesFromSubject(subject);
      assert.strictEqual(categories.length, 1);
      assert.deepEqual(categories[0], {
        id: "finite-automata",
        name: "Finite Automata",
        questionCount: 3
      });
    });

    test("counts multiple categories correctly", () => {
      const subject: FullSubjectData = {
        id: "test",
        name: "Test",
        config: { title: "Test", description: "Desc" },
        questions: [
          { category: "cat-one" } as Question,
          { category: "cat-two" } as Question,
          { category: "cat-one" } as Question,
          { category: "cat-three" } as Question
        ]
      };

      const categories = deriveCategoriesFromSubject(subject);
      assert.strictEqual(categories.length, 3);

      const catOne = categories.find(c => c.id === "cat-one");
      assert.strictEqual(catOne?.questionCount, 2);
      assert.strictEqual(catOne?.name, "Cat One");

      const catTwo = categories.find(c => c.id === "cat-two");
      assert.strictEqual(catTwo?.questionCount, 1);

      const catThree = categories.find(c => c.id === "cat-three");
      assert.strictEqual(catThree?.questionCount, 1);
    });
  });
});
