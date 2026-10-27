import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Question, Quiz } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quiz = await db.getQuiz(id, true);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = (await db.getQuizQuestions(id, false)) as Question[];
    return NextResponse.json({ quiz, questions });
  } catch (error: any) {
    console.error("Get admin quiz error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { questions, ...quizUpdates } = body;

    const existing = await db.getQuiz(id);
    if (!existing) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (questions && Array.isArray(questions)) {
      const formattedQuestions: Question[] = questions.map((q: any, idx: number) => ({
        id: q.id || `q-${id}-${idx + 1}`,
        quizId: id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || "",
        difficulty: q.difficulty || "medium",
        topic: q.topic || "General",
        sourceReference: q.sourceReference,
        order: idx + 1,
      }));

      await db.updateQuestionsForQuiz(id, formattedQuestions);
      quizUpdates.totalQuestions = formattedQuestions.length;
    }

    const updatedQuiz = await db.updateQuiz(id, quizUpdates);
    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error: any) {
    console.error("Update quiz error:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.deleteQuiz(id);
    return NextResponse.json({
      success: true,
      message: "Examination paper permanently deleted.",
      deletedId: id,
    });
  } catch (error: any) {
    console.error("Delete quiz error:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
