import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await db.getQuiz(id);

    if (!quiz || quiz.status !== "published") {
      return NextResponse.json({ error: "Quiz not found or not published" }, { status: 404 });
    }

    // Only return metadata, never questions/answers here
    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        durationMinutes: quiz.durationMinutes,
        totalQuestions: quiz.totalQuestions,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        language: quiz.language,
        reviewPolicy: quiz.reviewPolicy,
      },
    });
  } catch (error: any) {
    console.error("Get quiz metadata error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
