import { NextRequest, NextResponse } from "next/server";
import { getUserSession, getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClientExamQuestion } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const user = await getUserSession(req);
    const admin = await getAdminSession(req);
    const isAdmin = Boolean(admin && admin.role === "admin");
    const searchParams = req.nextUrl.searchParams;
    const attemptId = searchParams.get("attemptId");

    const quiz = await db.getQuiz(quizId, true);
    if (!quiz) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    let attempt = null;
    if (attemptId) {
      attempt = await db.getAttempt(attemptId);
    } else if (user) {
      const attempts = await db.listAttempts({ userId: user.uid, quizId });
      attempt = attempts.find(
        (a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() > Date.now()
      );
    }

    // Serverless cold-start fallback: create in-memory attempt if attemptId was requested but missing on this instance
    if (attemptId && !attempt) {
      const now = new Date();
      const durationMs = (quiz.durationMinutes || 60) * 60 * 1000;
      const deadline = new Date(now.getTime() + durationMs);
      const fallbackAttempt = {
        id: attemptId,
        quizId: quiz.id,
        quizTitle: quiz.title,
        userId: user?.uid || (isAdmin ? "admin-tester" : "candidate-student"),
        userName: user?.displayName || (isAdmin ? "Admin Examiner" : "Candidate Student"),
        userEmail: user?.email || "candidate@exam.nta",
        status: "in_progress" as const,
        startedAt: now.toISOString(),
        deadlineAt: deadline.toISOString(),
        answers: {},
      };
      await db.createAttempt(fallbackAttempt);
      attempt = fallbackAttempt;
    }

    // CRITICAL SECURITY: clientSafe = true hides correctAnswerIndex and explanation!
    const clientSafeQuestions = (await db.getQuizQuestions(quizId, true)) as ClientExamQuestion[];

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        durationMinutes: quiz.durationMinutes,
        totalQuestions: quiz.totalQuestions,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        language: quiz.language,
      },
      attempt,
      questions: clientSafeQuestions,
      serverTime: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Exam load error:", error);
    return NextResponse.json({ error: "Failed to load examination" }, { status: 500 });
  }
}
