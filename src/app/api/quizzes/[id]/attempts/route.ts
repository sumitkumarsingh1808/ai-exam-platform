import { NextRequest, NextResponse } from "next/server";
import { getUserSession, getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Attempt } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const user = await getUserSession(req);
    const admin = await getAdminSession(req);
    const isAdmin = Boolean(admin && admin.role === "admin");

    // Fallback demo student if testing without explicit login
    const userId = user?.uid || (isAdmin ? "admin-tester" : "candidate-" + Math.random().toString(36).substring(2, 8));
    const userName = user?.displayName || (isAdmin ? "Admin Examiner (Preview)" : "Candidate " + userId.substring(userId.length - 4));
    const userEmail = user?.email || (isAdmin ? "admin@nta.ac.in" : `${userId}@exam.candidate`);

    const quiz = await db.getQuiz(quizId, true);
    if (!quiz || (quiz.status !== "published" && !isAdmin)) {
      return NextResponse.json({ error: "Examination is not available" }, { status: 404 });
    }

    // Check if user already has an active in_progress attempt
    const existingAttempts = await db.listAttempts({ userId, quizId });
    const activeAttempt = existingAttempts.find(
      (a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() > Date.now()
    );

    if (activeAttempt) {
      return NextResponse.json({
        success: true,
        resumed: true,
        attempt: activeAttempt,
      });
    }

    const now = new Date();
    const durationMs = quiz.durationMinutes * 60 * 1000;
    const deadline = new Date(now.getTime() + durationMs);

    const questions = await db.getQuizQuestions(quizId, true);
    // Initialize initial answers with 'not_visited' for question palette
    const initialAnswers: Attempt["answers"] = {};
    questions.forEach((q, idx) => {
      initialAnswers[q.id] = {
        selectedOption: null,
        status: idx === 0 ? "not_answered" : "not_visited", // first question is visited upon load
      };
    });

    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAttempt: Attempt = {
      id: attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId,
      userName,
      userEmail,
      status: "in_progress",
      startedAt: now.toISOString(),
      deadlineAt: deadline.toISOString(),
      answers: initialAnswers,
    };

    const saved = await db.createAttempt(newAttempt);
    return NextResponse.json({ success: true, attempt: saved });
  } catch (error: any) {
    console.error("Start attempt error:", error);
    return NextResponse.json({ error: "Failed to start examination" }, { status: 500 });
  }
}
