import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await db.getQuiz(id, true);

    if (!quiz) {
      return NextResponse.json({ error: "Examination paper not found" }, { status: 404 });
    }

    // Allow admin preview even for draft examinations
    const admin = await getAdminSession(req);
    const isAdmin = Boolean(admin && admin.role === "admin");

    if (quiz.status !== "published" && !isAdmin) {
      return NextResponse.json({ error: "Examination paper is currently unpublished" }, { status: 404 });
    }

    // Return paper metadata
    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        category: quiz.category,
        isDailyPaper: quiz.isDailyPaper,
        durationMinutes: quiz.durationMinutes,
        totalQuestions: quiz.totalQuestions,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        language: quiz.language,
        reviewPolicy: quiz.reviewPolicy,
        status: quiz.status,
      },
    });
  } catch (error: any) {
    console.error("Get quiz metadata error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
