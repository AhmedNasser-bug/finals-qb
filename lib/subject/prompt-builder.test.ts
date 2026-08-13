import { test, describe } from "node:test";
import assert from "node:assert";
import { SubjectPromptBuilder } from "./prompt-builder.ts";

describe("SubjectPromptBuilder", () => {
  test("builds prompt with default values", () => {
    const builder = new SubjectPromptBuilder();
    const prompt = builder.build();

    // Topic
    assert.ok(prompt.includes("[YOUR TOPIC HERE]"), "Should include default topic");
    assert.ok(prompt.includes("Theme: [YOUR TOPIC HERE]"), "Should include theme topic");

    // Persona
    assert.ok(prompt.includes("Socratic tutor"), "Should include default persona");

    // Scaffolding
    assert.ok(prompt.includes("Socratic Guiding Nudges (Hints)"), "Should include socratic nudge hint instructions");

    // Formats
    assert.ok(prompt.includes("HTML Rich Text"), "Should include html formatting");
    assert.ok(prompt.includes("Mermaid Visual Diagrams"), "Should include diagram formatting");
    assert.ok(prompt.includes("diagramPosition"), "Should include diagram in schema"); // Fixed space

    // Question count
    assert.ok(prompt.includes("EXACTLY 30 unique"), "Should include default question count");

    // Reference bank
    assert.ok(prompt.includes("REFERENCE DOCUMENT CONSTRAINTS"), "Should include reference bank constraints");
  });

  test("can change topic", () => {
    const builder = new SubjectPromptBuilder();
    builder.setTopic("Quantum Physics");
    const prompt = builder.build();
    assert.ok(prompt.includes("Theme: Quantum Physics"), "Should include new topic");
    assert.ok(!prompt.includes("[YOUR TOPIC HERE]"), "Should not include default topic");

    // Check trim
    builder.setTopic("  String Theory  ");
    const promptTrim = builder.build();
    assert.ok(promptTrim.includes("Theme: String Theory"), "Should trim topic");

    // Check empty ignores
    builder.setTopic("   ");
    const promptEmpty = builder.build();
    assert.ok(promptEmpty.includes("Theme: String Theory"), "Should ignore empty topic strings and keep previous");
  });

  test("can change persona", () => {
    const builder = new SubjectPromptBuilder();
    builder.setPersona("designer");
    const promptDesigner = builder.build();
    assert.ok(promptDesigner.includes("senior curriculum designer"), "Should include designer persona text");

    builder.setPersona("explorer");
    const promptExplorer = builder.build();
    assert.ok(promptExplorer.includes("concept explorer"), "Should include explorer persona text");
  });

  test("can set question count", () => {
    const builder = new SubjectPromptBuilder();
    builder.setQuestionCount(50);
    const prompt = builder.build();
    assert.ok(prompt.includes("EXACTLY 50 unique"), "Should include new question count");

    // Invalid count (<= 0) should be ignored
    builder.setQuestionCount(-5);
    const promptInvalid = builder.build();
    assert.ok(promptInvalid.includes("EXACTLY 50 unique"), "Should ignore invalid question count");
  });

  test("can toggle reference bank", () => {
    const builder = new SubjectPromptBuilder();
    builder.setUseReferenceBank(false);
    const prompt = builder.build();
    assert.ok(!prompt.includes("REFERENCE DOCUMENT CONSTRAINTS"), "Should exclude reference bank constraints when false");
  });

  test("can toggle scaffolding options", () => {
    const builder = new SubjectPromptBuilder();

    // Remove default
    builder.toggleScaffolding("socratic_nudge", false);
    const prompt1 = builder.build();
    assert.ok(!prompt1.includes("Socratic Guiding Nudges (Hints)"), "Should not include socratic nudge");
    assert.ok(prompt1.includes("Question Hints"), "Should include basic hints when socratic is off");

    // Add metacognitive
    builder.toggleScaffolding("metacognitive", true);
    const prompt2 = builder.build();
    assert.ok(prompt2.includes("Metacognitive Explanations"), "Should include metacognitive explanations");

    // Add cognitive load
    builder.toggleScaffolding("cognitive_load", true);
    const prompt3 = builder.build();
    assert.ok(prompt3.includes("Cognitive Load Management"), "Should include cognitive load management");
  });

  test("can toggle format options", () => {
    const builder = new SubjectPromptBuilder();

    // Remove defaults
    builder.toggleFormat("html", false);
    builder.toggleFormat("diagrams", false);
    const prompt = builder.build();

    assert.ok(!prompt.includes("HTML Rich Text"), "Should not include HTML rich text");
    assert.ok(prompt.includes("Plain Text: Keep the question text clean"), "Should include plain text instructions");

    assert.ok(!prompt.includes("Mermaid Visual Diagrams"), "Should not include Mermaid diagrams");
    assert.ok(!prompt.includes("\"diagram\":"), "Should not include diagram in JSON schema");
  });

  test("can toggle output options", () => {
    const builder = new SubjectPromptBuilder();
    builder.toggleOutput("flashcards", true);
    // Outputs tracking doesn't dynamically modify the output yet, but we should test the method functionality
    assert.strictEqual(typeof builder.toggleOutput, "function");
    const prompt = builder.build();
    assert.ok(prompt.length > 0);
  });

  test("can apply preset", () => {
    const builder = new SubjectPromptBuilder();
    builder.applyPreset({
      persona: "designer",
      scaffolding: ["metacognitive"],
      formats: [],
      outputs: ["mcq_tf"],
      questionCount: 15,
      useReferenceBank: false
    });

    const prompt = builder.build();
    assert.ok(prompt.includes("senior curriculum designer"), "Should have preset persona");
    assert.ok(prompt.includes("Metacognitive Explanations"), "Should have preset scaffolding");
    assert.ok(prompt.includes("EXACTLY 15 unique"), "Should have preset question count");
    assert.ok(!prompt.includes("REFERENCE DOCUMENT CONSTRAINTS"), "Should have preset reference bank usage");
    assert.ok(!prompt.includes("HTML Rich Text"), "Should have preset formats (no html)");
  });
});
