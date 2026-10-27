import { describe, it, expect } from "vitest";
import { askExamAgent } from "../src/lib/agent-chat";

describe("AI Exam Agent Chat", () => {
  it("generates aptitude questions when requested", async () => {
    const res = await askExamAgent({
      message: "generate 3 aptitude questions on time and work",
      numQuestions: 3,
    });

    expect(res).toBeDefined();
    expect(res.reply).toBeDefined();
    expect(typeof res.reply).toBe("string");
    expect(res.questions.length).toBeGreaterThanOrEqual(1);

    const firstQ = res.questions[0];
    expect(firstQ.questionText.length).toBeGreaterThan(10);
    expect(firstQ.options.length).toBe(4);
    expect(firstQ.correctAnswerIndex).toBeGreaterThanOrEqual(0);
    expect(firstQ.correctAnswerIndex).toBeLessThan(4);
    expect(firstQ.explanation.length).toBeGreaterThan(5);
  }, 15000);

  it("generates english questions when requested", async () => {
    const res = await askExamAgent({
      message: "generate 2 english grammar questions",
      numQuestions: 2,
    });

    expect(res.questions.length).toBeGreaterThanOrEqual(1);
    expect(res.suggestedPrompts.length).toBeGreaterThan(0);
  }, 15000);
});
