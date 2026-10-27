import { describe, it, expect } from "vitest";
import { calculateQuizScore } from "../src/lib/scoring";
import { Question, AnswerItem } from "../src/lib/types";

describe("Scoring Logic with NTA Examination Rules", () => {
  const mockQuestions: Question[] = [
    {
      id: "q1",
      quizId: "test-quiz",
      questionText: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswerIndex: 1, // '4'
      explanation: "2 + 2 = 4",
      difficulty: "easy",
      topic: "Math",
      order: 1,
    },
    {
      id: "q2",
      quizId: "test-quiz",
      questionText: "Capital of India?",
      options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
      correctAnswerIndex: 1, // 'New Delhi'
      explanation: "New Delhi is the capital",
      difficulty: "easy",
      topic: "Geography",
      order: 2,
    },
    {
      id: "q3",
      quizId: "test-quiz",
      questionText: "Speed of light?",
      options: ["3e8 m/s", "1e6 m/s", "5e7 m/s", "300 m/s"],
      correctAnswerIndex: 0, // '3e8 m/s'
      explanation: "Approx 3 * 10^8 m/s",
      difficulty: "medium",
      topic: "Physics",
      order: 3,
    },
    {
      id: "q4",
      quizId: "test-quiz",
      questionText: "Unanswered question?",
      options: ["A", "B", "C", "D"],
      correctAnswerIndex: 2,
      explanation: "Test",
      difficulty: "hard",
      topic: "General",
      order: 4,
    },
  ];

  it("calculates full score correctly when all answers are correct", () => {
    const answers: Record<string, AnswerItem> = {
      q1: { selectedOption: 1, status: "answered" },
      q2: { selectedOption: 1, status: "answered" },
      q3: { selectedOption: 0, status: "answered" },
      q4: { selectedOption: 2, status: "answered" },
    };

    const result = calculateQuizScore(mockQuestions, answers, 4, 1);
    expect(result.score).toBe(16);
    expect(result.maximumScore).toBe(16);
    expect(result.percentage).toBe(100);
    expect(result.correctCount).toBe(4);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(0);
    expect(result.accuracy).toBe(100);
  });

  it("applies negative marking for incorrect answers", () => {
    const answers: Record<string, AnswerItem> = {
      q1: { selectedOption: 1, status: "answered" }, // Correct (+4)
      q2: { selectedOption: 0, status: "answered" }, // Incorrect (-1)
      q3: { selectedOption: 0, status: "answered" }, // Correct (+4)
      q4: { selectedOption: 1, status: "answered" }, // Incorrect (-1)
    };

    const result = calculateQuizScore(mockQuestions, answers, 4, 1);
    // 4 - 1 + 4 - 1 = 6
    expect(result.score).toBe(6);
    expect(result.maximumScore).toBe(16);
    expect(result.percentage).toBe(37.5);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(2);
    expect(result.unansweredCount).toBe(0);
    expect(result.accuracy).toBe(50);
  });

  it("treats 'answered_marked_for_review' as valid evaluated answer according to NTA guidelines", () => {
    const answers: Record<string, AnswerItem> = {
      q1: { selectedOption: 1, status: "answered_marked_for_review" }, // Correct (+4)
      q2: { selectedOption: null, status: "marked_for_review" }, // Marked without answer -> 0
      q3: { selectedOption: null, status: "not_visited" }, // Not visited -> 0
      q4: { selectedOption: null, status: "not_answered" }, // Not answered -> 0
    };

    const result = calculateQuizScore(mockQuestions, answers, 4, 1);
    expect(result.score).toBe(4);
    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(3);
  });
});
