import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    let quiz = await db.getQuiz(id, true);

    // Self-hydrate custom quiz if this serverless instance hasn't seen it yet
    if (!quiz && (body.quiz || body.customQuizData?.quiz)) {
      const q = body.quiz || body.customQuizData?.quiz;
      const questions = body.questions || body.customQuizData?.questions || [];
      await db.syncCustomQuizzes([q], questions);
      quiz = await db.getQuiz(id, true);
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const newStatus = quiz.status === "published" ? "draft" : "published";
    const updated = await db.updateQuiz(id, {
      status: newStatus,
      publishedAt: newStatus === "published" ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
      quiz: updated,
    });
  } catch (error: any) {
    console.error("Publish toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle publish status" }, { status: 500 });
  }
}
