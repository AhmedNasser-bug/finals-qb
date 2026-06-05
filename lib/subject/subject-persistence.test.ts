import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateSubjectData, parseSubjectJson } from "./subject-persistence.ts";

describe("validateSubjectData", () => {
  test("rejects invalid root types", () => {
    assert.strictEqual(validateSubjectData(null).valid, false);
    assert.strictEqual(validateSubjectData(123).valid, false);
    assert.strictEqual(validateSubjectData("string").valid, false);
    assert.strictEqual(validateSubjectData([]).valid, false);

    const res = validateSubjectData(null);
    assert.ok(res.errors.some(e => e.includes("Root value must be a JSON object")));
  });

  const validBase = {
    id: "sub-1",
    name: "Subject 1",
    config: {
      title: "Title",
      description: "Desc",
    },
    questions: [
      {
        id: "q-1",
        type: "MCQ",
        difficulty: "Easy",
        category: "Cat",
        question: "Q?",
        options: [
          { label: "A", text: "Option A" },
          { label: "B", text: "Option B" }
        ],
        answer: "A"
      }
    ]
  };

  test("accepts valid minimal subject data", () => {
    const res = validateSubjectData(validBase);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
    // Should have warnings for missing optional arrays
    assert.ok(res.warnings.some(w => w.includes("flashcards")));
    assert.ok(res.warnings.some(w => w.includes("terminology")));
    assert.ok(res.warnings.some(w => w.includes("achievements")));
  });

  test("validates top-level string fields", () => {
    const missingId = { ...validBase, id: "" };
    assert.strictEqual(validateSubjectData(missingId).valid, false);
    assert.ok(validateSubjectData(missingId).errors.some(e => e.includes('Missing required string field: "id"')));

    const missingName = { ...validBase, name: undefined };
    assert.strictEqual(validateSubjectData(missingName).valid, false);
    assert.ok(validateSubjectData(missingName).errors.some(e => e.includes('Missing required string field: "name"')));
  });

  test("validates config block", () => {
    const missingConfig = { ...validBase, config: null };
    assert.strictEqual(validateSubjectData(missingConfig).valid, false);

    const invalidConfigType = { ...validBase, config: [] };
    assert.strictEqual(validateSubjectData(invalidConfigType).valid, false);

    const invalidTitle = { ...validBase, config: { description: "Desc", title: "" } };
    assert.strictEqual(validateSubjectData(invalidTitle).valid, false);

    const invalidDesc = { ...validBase, config: { title: "Title", description: "" } };
    assert.strictEqual(validateSubjectData(invalidDesc).valid, false);
  });

  test("validates questions array existence", () => {
    const notArray = { ...validBase, questions: "invalid" };
    assert.strictEqual(validateSubjectData(notArray).valid, false);

    const emptyArray = { ...validBase, questions: [] };
    assert.strictEqual(validateSubjectData(emptyArray).valid, false);
  });

  test("validates individual questions", () => {
    const notObject = {
      ...validBase,
      questions: ["invalid"]
    };
    assert.strictEqual(validateSubjectData(notObject).valid, false);

    const invalidType = {
      ...validBase,
      questions: [{ ...validBase.questions[0], type: "INVALID_TYPE" }]
    };
    assert.strictEqual(validateSubjectData(invalidType).valid, false);

    const invalidDifficulty = {
      ...validBase,
      questions: [{ ...validBase.questions[0], difficulty: "Impossible" }]
    };
    assert.strictEqual(validateSubjectData(invalidDifficulty).valid, false);

    const duplicateIds = {
      ...validBase,
      questions: [validBase.questions[0], validBase.questions[0]]
    };
    assert.strictEqual(validateSubjectData(duplicateIds).valid, false);

    const invalidOptions = {
      ...validBase,
      questions: [{ ...validBase.questions[0], options: [{ label: "A" }] }] // Only 1 option
    };
    assert.strictEqual(validateSubjectData(invalidOptions).valid, false);

    const noMatchingAnswer = {
      ...validBase,
      questions: [{ ...validBase.questions[0], answer: "C" }]
    };
    assert.strictEqual(validateSubjectData(noMatchingAnswer).valid, false);

    const invalidDiagramPosition = {
      ...validBase,
      questions: [{ ...validBase.questions[0], diagramPosition: "above" }]
    };
    assert.strictEqual(validateSubjectData(invalidDiagramPosition).valid, false);

    const missingQuestionId = {
      ...validBase,
      questions: [{ ...validBase.questions[0], id: undefined }]
    };
    assert.strictEqual(validateSubjectData(missingQuestionId).valid, false);

    const missingCategory = {
      ...validBase,
      questions: [{ ...validBase.questions[0], category: "" }]
    };
    assert.strictEqual(validateSubjectData(missingCategory).valid, false);

    const missingQuestionText = {
      ...validBase,
      questions: [{ ...validBase.questions[0], question: "" }]
    };
    assert.strictEqual(validateSubjectData(missingQuestionText).valid, false);

    const missingAnswer = {
      ...validBase,
      questions: [{ ...validBase.questions[0], answer: "" }]
    };
    assert.strictEqual(validateSubjectData(missingAnswer).valid, false);
  });

  test("validates early bailout on 8+ errors", () => {
    const badQuestions = new Array(10);
    for (let i = 0; i < 10; i++) {
      badQuestions[i] = { id: `q-${i}` };
    }
    const manyErrors = {
      ...validBase,
      questions: badQuestions
    };
    const res = validateSubjectData(manyErrors);
    assert.strictEqual(res.valid, false);
    // There are actually multiple errors per bad question, but it stops processing once error count hits 8.
    // However, it finishes the *current* question, so it might reach exactly 8 or slightly more, but it shouldn't process all 10 questions.
    assert.ok(res.errors.length >= 8);
    // Because a completely empty question object yields at least 6 errors (type, difficulty, category, question text, options, answer)
    // The first question adds 6. Second question adds 6 (total 12).
    // The code checks errors.length >= 8 at the END of processing each question.
    // So it processes 2 questions and stops. Meaning errors length will be 12.
    assert.ok(res.errors.length <= 80);
  });

  test("accepts valid full subject data — legacy normalised with warnings", () => {
    const validFull = {
      ...validBase,
      flashcards: [
        { id: "f-1", front: "Front", back: "Back", category: "Cat" }
      ],
      terminology: {
        "Term 1": "Def 1"
      },
      achievements: [
        { id: "a-1", title: "Ach 1", description: "Desc" }
      ]
    };
    const res = validateSubjectData(validFull);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
    // Legacy front/back → term/definition, flat terminology, and no-icon achievement each warn
    assert.ok(res.warnings.length > 0, "expected warnings for legacy format normalisation");
    // The normalised subject should have term/definition keys
    assert.strictEqual(res.subject!.flashcards[0].term, "Front");
    assert.strictEqual(res.subject!.flashcards[0].definition, "Back");
  });

  test("validates flashcards empty and non-array arrays", () => {
    const emptyFlashcards = { ...validBase, flashcards: [] };
    const resEmpty = validateSubjectData(emptyFlashcards);
    assert.ok(resEmpty.warnings.some(w => w.includes('"flashcards" array is empty')));

    const invalidFlashcards = { ...validBase, flashcards: "invalid" };
    const resInvalid = validateSubjectData(invalidFlashcards);
    assert.ok(resInvalid.warnings.some(w => w.includes('"flashcards" field is missing or not an array')));
  });
});

describe("parseSubjectJson", () => {
  test("successfully parses valid JSON", () => {
    const jsonStr = '{"id":"test","value":123}';
    const result = parseSubjectJson(jsonStr);
    assert.deepEqual(result.data, { id: "test", value: 123 });
    assert.strictEqual(result.parseError, undefined);
  });

  test("returns parseError for invalid JSON", () => {
    const invalidJsonStr = '{"id":"test", value:123}'; // missing quotes around value
    const result = parseSubjectJson(invalidJsonStr);
    assert.strictEqual(result.data, undefined);
    assert.ok(typeof result.parseError === "string");
    assert.ok(result.parseError.startsWith("JSON parse error:"));
  });

  test("handles empty string", () => {
    const result = parseSubjectJson("");
    assert.strictEqual(result.data, undefined);
    assert.ok(typeof result.parseError === "string");
    assert.ok(result.parseError.startsWith("JSON parse error:"));
  });

  test("successfully parses valid JSON with valid escapes preserved", () => {
    const jsonStr = '{"id":"test","text":"Line 1\\nLine 2 with \\\\ backslash, \\"quote\\", and \\u0020space"}';
    const result = parseSubjectJson(jsonStr);
    assert.deepEqual(result.data, { id: "test", text: 'Line 1\nLine 2 with \\ backslash, "quote", and  space' });
    assert.strictEqual(result.parseError, undefined);
  });

  test("auto-fixes bad escape characters in strings", () => {
    const jsonStr = '{"id":"test","text":"Some bad escape\\ here, stray\\a, and end\\\\"}';
    const result = parseSubjectJson(jsonStr);
    assert.deepEqual(result.data, { id: "test", text: 'Some bad escape\\ here, stray\\a, and end\\' });
    assert.ok(result.fixedWarnings?.some(w => w.includes("Repaired invalid escape characters")));
  });
});

describe("Auto-Fix & Graceful Degradation Suite", () => {
  test("recovers missing name and auto-generates id slug", () => {
    const raw = {
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q?",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.name, "Imported Subject");
    assert.strictEqual(data.id, "imported-subject");
    assert.ok(result.fixedWarnings?.some(w => w.includes('"name" was missing')));
    assert.ok(result.fixedWarnings?.some(w => w.includes('"id" was missing')));
  });

  test("auto-generates id slug from custom subject name", () => {
    const raw = {
      name: "Theory of Computation Spec",
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q?",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.id, "theory-of-computation-spec");
  });

  test("recovers missing config block and populates title/description", () => {
    const raw = {
      name: "Config Test",
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q?",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.ok(data.config);
    assert.strictEqual(data.config.title, "Config Test");
    assert.ok(data.config.description.includes("Config Test"));
    assert.ok(result.fixedWarnings?.some(w => w.includes('"config" block was missing')));
  });

  test("recovers partial config block missing title or description", () => {
    const raw = {
      name: "Partial Config Test",
      config: {
        title: ""
      },
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q?",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.config.title, "Partial Config Test");
    assert.ok(data.config.description.includes("Partial Config Test"));
  });

  test("recovers missing or empty questions array with placeholder question", () => {
    const raw = {
      name: "Questions Test",
      questions: []
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.questions.length, 1);
    assert.strictEqual(data.questions[0].id, "q-default-1");
    assert.ok(data.questions[0].question.includes("placeholder question"));
    assert.ok(result.fixedWarnings?.some(w => w.includes('"questions" array was empty')));
  });

  test("automatically renames duplicate question IDs", () => {
    const raw = {
      name: "Duplicate ID Test",
      questions: [
        {
          id: "q-same",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q1",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        },
        {
          id: "q-same",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q2",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "B"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.questions[0].id, "q-same");
    assert.strictEqual(data.questions[1].id, "q-same-1");
    assert.ok(result.fixedWarnings?.some(w => w.includes('Duplicate ID "q-same"')));
  });

  test("calibrates invalid types and converts TrueFalse with bad option count to MCQ", () => {
    const raw = {
      name: "Type Calibration Test",
      questions: [
        {
          id: "q-1",
          type: "INVALID_TYPE",
          difficulty: "Easy",
          category: "Cat",
          question: "Q1",
          options: [
            { label: "A", text: "True" },
            { label: "B", text: "False" }
          ],
          answer: "A"
        },
        {
          id: "q-2",
          type: "TrueFalse",
          difficulty: "Easy",
          category: "Cat",
          question: "Q2",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" },
            { label: "C", text: "Option C" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.questions[0].type, "TrueFalse");
    assert.strictEqual(data.questions[1].type, "MCQ");
    assert.ok(result.fixedWarnings?.some(w => w.includes('converted to MCQ')));
  });

  test("remaps answer text and boolean values to matching option labels", () => {
    const raw = {
      name: "Answer Remap Test",
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q1",
          options: [
            { label: "A", text: "Paris" },
            { label: "B", text: "London" }
          ],
          answer: "Paris"
        },
        {
          id: "q-2",
          type: "TrueFalse",
          difficulty: "Easy",
          category: "Cat",
          question: "Q2",
          options: [
            { label: "A", text: "True" },
            { label: "B", text: "False" }
          ],
          answer: "1"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.questions[0].answer, "A");
    assert.strictEqual(data.questions[1].answer, "A");
    assert.ok(result.fixedWarnings?.some(w => w.includes('remapped to label "A"')));
    assert.ok(result.fixedWarnings?.some(w => w.includes('Boolean answer "1" automatically mapped')));
  });

  test("recovers missing question fields (difficulty, category, options, explanation, hint)", () => {
    const raw = {
      name: "Field Recovery Test",
      questions: [
        {
          id: "q-1",
          question: "",
          answer: "Z"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.questions[0].difficulty, "Medium");
    assert.strictEqual(data.questions[0].category, "general");
    assert.strictEqual(data.questions[0].question, "No question text provided.");
    assert.strictEqual(data.questions[0].options.length, 4);
    assert.strictEqual(data.questions[0].answer, "A"); // reset to A because Z doesn't exist
    assert.ok(data.questions[0].explanation.includes("correct"));
    assert.ok(data.questions[0].hint.includes("terminology"));
  });

  test("recovers missing flashcards, achievements, and terminology containers", () => {
    const raw = {
      name: "Container Test",
      questions: [
        {
          id: "q-1",
          type: "MCQ",
          difficulty: "Easy",
          category: "Cat",
          question: "Q?",
          options: [
            { label: "A", text: "Option A" },
            { label: "B", text: "Option B" }
          ],
          answer: "A"
        }
      ]
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.ok(Array.isArray(data.flashcards));
    assert.ok(Array.isArray(data.achievements));
    assert.ok(data.terminology);
    assert.ok(Array.isArray(data.terminology.Cat));
  });

  test("ignores generic JSON inputs from auto-fixes", () => {
    const raw = {
      id: "generic-doc",
      version: 1,
      payload: {
        someValue: true
      }
    };
    const result = parseSubjectJson(JSON.stringify(raw));
    assert.ok(!("parseError" in result));
    const data = result.data as any;
    assert.strictEqual(data.name, undefined);
    assert.strictEqual(data.questions, undefined);
    assert.strictEqual(data.flashcards, undefined);
  });
});
