import { describe, it, expect } from "vitest";
import { sanitizeCsvCell, calculateExamSummary, formatTimeLeft } from "../src/lib/utils";
import { AnswerItem } from "../src/lib/types";

describe("Utility Functions & Security", () => {
  it("sanitizes CSV cells against formula injection", () => {
    expect(sanitizeCsvCell("=CMD('calc')")).toBe("\"'=CMD('calc')\"");
    expect(sanitizeCsvCell("+12345")).toBe("\"'+12345\"");
    expect(sanitizeCsvCell("-50")).toBe("\"'-50\"");
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("\"'@SUM(A1:A10)\"");
    expect(sanitizeCsvCell("Normal Candidate Name")).toBe('"Normal Candidate Name"');
  });

  it("formats countdown seconds into HH:MM:SS", () => {
    expect(formatTimeLeft(3665)).toBe("01:01:05");
    expect(formatTimeLeft(180)).toBe("00:03:00");
    expect(formatTimeLeft(0)).toBe("00:00:00");
  });

  it("calculates accurate question palette summary counts", () => {
    const questionIds = ["q1", "q2", "q3", "q4", "q5"];
    const answers: Record<string, AnswerItem> = {
      q1: { selectedOption: 0, status: "answered" },
      q2: { selectedOption: null, status: "not_answered" },
      q3: { selectedOption: null, status: "marked_for_review" },
      q4: { selectedOption: 2, status: "answered_marked_for_review" },
      // q5 is not in answers, so treated as not_visited
    };

    const summary = calculateExamSummary(questionIds, answers);
    expect(summary.total).toBe(5);
    expect(summary.answered).toBe(1);
    expect(summary.notAnswered).toBe(1);
    expect(summary.markedForReview).toBe(1);
    expect(summary.answeredAndMarkedForReview).toBe(1);
    expect(summary.notVisited).toBe(1);
  });
});
