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
    if (!quiz || (quiz.status !== "published" && !isAdmin)) {
      return NextResponse.json({ error: "Examination not found or not published" }, { status: 404 });
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
