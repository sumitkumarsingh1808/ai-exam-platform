import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Question } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await db.getAttempt(id);

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Role and IDOR verification
    const admin = await getAdminSession(req);
    const user = await getUserSession(req);

    const isOwner = user && user.uid === attempt.userId;
    const isAdmin = admin && admin.role === "admin";

    // Allow if owner or admin, or if attempt is demo candidate
    if (!isAdmin && !isOwner && !attempt.userId.startsWith("candidate-")) {
      return NextResponse.json(
        { error: "Access denied. You can only view your own examination results." },
        { status: 403 }
      );
    }

    const quiz = await db.getQuiz(attempt.quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Answer review policy check
    const canReviewQuestions =
      isAdmin ||
      quiz.reviewPolicy === "immediate" ||
      (quiz.reviewPolicy === "after_close" && quiz.status === "archived");

    let reviewQuestions: any[] = [];
    if (canReviewQuestions) {
      const questions = (await db.getQuizQuestions(attempt.quizId, false)) as Question[];
      reviewQuestions = questions.map((q) => {
        const userAns = attempt.answers[q.id];
        const selectedOption = userAns?.selectedOption ?? null;
        const isAnswered =
          userAns &&
          (userAns.status === "answered" || userAns.status === "answered_marked_for_review") &&
          selectedOption !== null;

        const isCorrect = isAnswered && selectedOption === q.correctAnswerIndex;
        let marks = 0;
        if (isAnswered) {
          marks = isCorrect ? quiz.marksPerQuestion : -quiz.negativeMarks;
        }

        return {
          id: q.id,
          order: q.order,
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
          sourceReference: q.sourceReference,
          selectedOption,
          isAnswered,
          isCorrect,
          marks,
        };
      });
    }

    return NextResponse.json({
      attempt,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        reviewPolicy: quiz.reviewPolicy,
      },
      canReviewQuestions,
      reviewQuestions,
    });
  } catch (error: any) {
    console.error("Result fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
