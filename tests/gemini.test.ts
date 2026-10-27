import { describe, it, expect } from "vitest";
import { generateFallbackQuestions, extractQuestionsFromText } from "../src/lib/gemini";

describe("Gemini Question Generator & Fallback Engine", () => {
  it("generates valid structured questions when Gemini API key is offline", () => {
    const result = generateFallbackQuestions(
      "UGC NET Paper 1 Mock",
      "Teaching Aptitude",
      3,
      "mixed"
    );

    expect(result.title).toBe("UGC NET Paper 1 Mock");
    expect(result.questions.length).toBe(3);

    result.questions.forEach((q) => {
      expect(q.questionText.length).toBeGreaterThan(10);
      expect(q.options.length).toBe(4);
      expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswerIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(5);
      expect(["easy", "medium", "hard"]).toContain(q.difficulty);
    });
  });

  it("extracts authentic multiple choice questions directly from structured exam papers", () => {
    const samplePaper = `
Q1. The company's sudden announcement was seen as critical by employees.
(a) abrupt, predetermined
(b) strategic, unexpected
(c) transparent, concealed
(d) calculated, improvised

Q2. The government response was criticized.
(a) deliberate, intensify
(b) prudent, alleviate
(c) swift, suppress
(d) ineffectual, exacerbate
`;

    const result = extractQuestionsFromText(samplePaper, "SBI PO Test", "Banking", 2, "medium");
    expect(result.questions.length).toBe(2);
    expect(result.questions[0].questionText).toContain("sudden announcement");
    expect(result.questions[0].options[0]).toBe("abrupt, predetermined");
    expect(result.questions[1].questionText).toContain("government response");
    expect(result.questions[1].options[3]).toBe("ineffectual, exacerbate");
  });
});
