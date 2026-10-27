import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateQuizScore } from "@/lib/scoring";
import { Question } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await db.getAttempt(id);

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Prevent duplicate submissions
    if (attempt.status === "submitted") {
      return NextResponse.json({
        success: true,
        alreadySubmitted: true,
        message: "This examination has already been submitted.",
        attempt,
      });
    }

    const body = await req.json().catch(() => ({}));
    const incomingAnswers = body.answers || {};

    const finalAnswers = {
      ...attempt.answers,
      ...incomingAnswers,
    };

    const quiz = await db.getQuiz(attempt.quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Associated quiz not found" }, { status: 404 });
    }

    // Retrieve real questions with correct answer indices
    const questions = (await db.getQuizQuestions(attempt.quizId, false)) as Question[];

    const scoreResult = calculateQuizScore(
      questions,
      finalAnswers,
      quiz.marksPerQuestion,
      quiz.negativeMarks
    );

    const now = new Date();
    const startTime = new Date(attempt.startedAt).getTime();
    const timeTakenSeconds = Math.max(0, Math.round((now.getTime() - startTime) / 1000));

    const updatedAttempt = await db.updateAttempt(id, {
      status: "submitted",
      submittedAt: now.toISOString(),
      answers: finalAnswers,
      score: scoreResult.score,
      maximumScore: scoreResult.maximumScore,
      percentage: scoreResult.percentage,
      correctCount: scoreResult.correctCount,
      incorrectCount: scoreResult.incorrectCount,
      unansweredCount: scoreResult.unansweredCount,
      timeTakenSeconds,
    });

    return NextResponse.json({
      success: true,
      scoreResult,
      attempt: updatedAttempt,
    });
  } catch (error: any) {
    console.error("Submit attempt error:", error);
    return NextResponse.json(
      { error: "Failed to submit examination: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
