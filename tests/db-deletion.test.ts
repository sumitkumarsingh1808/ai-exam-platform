import { describe, it, expect } from "vitest";
import { db } from "../src/lib/db";
import { Quiz, Question } from "../src/lib/types";

describe("Database Quiz Management & Deletion", () => {
  it("creates, lists, and permanently deletes a quiz with tombstones", async () => {
    const testQuizId = `quiz-test-delete-${Date.now()}`;
    const testQuiz: Quiz = {
      id: testQuizId,
      title: "Temporary Test Deletion Paper",
      subject: "Test Subject",
      category: "Banking",
      status: "published",
      durationMinutes: 15,
      totalQuestions: 1,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      language: "English",
      reviewPolicy: "immediate",
      allowRandomization: true,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const testQuestions: Question[] = [
      {
        id: `q-${testQuizId}-1`,
        quizId: testQuizId,
        questionText: "What is 2 + 2?",
        options: ["1", "2", "3", "4"],
        correctAnswerIndex: 3,
        explanation: "Simple addition",
        difficulty: "easy",
        topic: "Arithmetic",
        order: 1,
      },
    ];

    // 1. Create Quiz
    await db.createQuiz(testQuiz, testQuestions);

    // Verify it exists in published list
    const initialList = await db.listQuizzes(false);
    expect(initialList.some((q) => q.id === testQuizId)).toBe(true);

    const fetchedQuiz = await db.getQuiz(testQuizId);
    expect(fetchedQuiz).not.toBeNull();
    expect(fetchedQuiz?.id).toBe(testQuizId);

    // 2. Delete Quiz
    const deleted = await db.deleteQuiz(testQuizId);
    expect(deleted).toBe(true);

    // 3. Verify it is gone from listQuizzes
    const afterDeleteList = await db.listQuizzes(false);
    expect(afterDeleteList.some((q) => q.id === testQuizId)).toBe(false);

    // 4. Verify getQuiz returns null
    const afterDeleteQuiz = await db.getQuiz(testQuizId);
    expect(afterDeleteQuiz).toBeNull();

    // 5. Verify questions are removed
    const questions = await db.getQuizQuestions(testQuizId);
    expect(questions.length).toBe(0);
  });

  it("handles registerDeletedQuizzes synchronization cleanly", async () => {
    const syncQuizId = `quiz-test-sync-${Date.now()}`;
    const testQuiz: Quiz = {
      id: syncQuizId,
      title: "Sync Paper",
      subject: "Sync Subject",
      category: "UGC NET",
      status: "published",
      durationMinutes: 20,
      totalQuestions: 1,
      marksPerQuestion: 2,
      negativeMarks: 0,
      language: "English",
      reviewPolicy: "immediate",
      allowRandomization: true,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.createQuiz(testQuiz, []);

    // Register via sync batch
    await db.registerDeletedQuizzes([syncQuizId]);

    const quiz = await db.getQuiz(syncQuizId);
    expect(quiz).toBeNull();

    const list = await db.listQuizzes(true);
    expect(list.some((q) => q.id === syncQuizId)).toBe(false);
  });

  it("always preserves seed quizzes and synchronizes custom quizzes across instances", async () => {
    // Check that official seed quizzes exist
    const seedQuiz = await db.getQuiz("quiz-banking-live-mock");
    expect(seedQuiz).not.toBeNull();
    expect(seedQuiz?.id).toBe("quiz-banking-live-mock");

    // Sync a new custom quiz
    const customQuizId = `quiz-custom-sync-${Date.now()}`;
    const customQuiz: Quiz = {
      id: customQuizId,
      title: "Self-Healed Custom Paper",
      subject: "Banking",
      category: "Banking",
      status: "published",
      durationMinutes: 30,
      totalQuestions: 1,
      marksPerQuestion: 1,
      negativeMarks: 0.25,
      language: "English",
      reviewPolicy: "immediate",
      allowRandomization: true,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const customQuestions: Question[] = [
      {
        id: `q-${customQuizId}-1`,
        quizId: customQuizId,
        questionText: "What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        correctAnswerIndex: 1,
        difficulty: "easy",
        topic: "General",
        order: 1,
      },
    ];

    await db.syncCustomQuizzes([customQuiz], customQuestions);

    const fetchedCustom = await db.getQuiz(customQuizId);
    expect(fetchedCustom).not.toBeNull();
    expect(fetchedCustom?.title).toBe("Self-Healed Custom Paper");

    const questions = await db.getQuizQuestions(customQuizId);
    expect(questions.length).toBe(1);

    // Clean up
    await db.deleteQuiz(customQuizId);
  });
});
