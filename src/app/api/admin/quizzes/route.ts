import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizCreateSchema } from "@/lib/validation";
import { Quiz, Question } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await db.listQuizzes(true);
    return NextResponse.json({ quizzes });
  } catch (error: any) {
    console.error("List admin quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = quizCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      subject,
      durationMinutes,
      marksPerQuestion,
      negativeMarks,
      language,
      reviewPolicy,
      allowRandomization,
      status,
      questions: rawQuestions,
    } = parsed.data;

    const quizId = `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const questions: Question[] = rawQuestions.map((q, idx) => ({
      id: `q-${quizId}-${idx + 1}`,
      quizId,
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation || "",
      difficulty: q.difficulty,
      topic: q.topic,
      sourceReference: q.sourceReference,
      order: idx + 1,
    }));

    const quiz: Quiz = {
      id: quizId,
      title,
      description: description || "",
      subject,
      category: parsed.data.category || "Banking",
      isDailyPaper: Boolean(parsed.data.isDailyPaper),
      status,
      durationMinutes,
      totalQuestions: questions.length,
      marksPerQuestion,
      negativeMarks,
      language,
      createdBy: admin.username,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === "published" ? now : undefined,
      reviewPolicy,
      allowRandomization,
    };

    const saved = await db.createQuiz(quiz, questions);
    return NextResponse.json({ success: true, quiz: saved, questionsCount: questions.length });
  } catch (error: any) {
    console.error("Create quiz error:", error);
    return NextResponse.json(
      { error: "Failed to create quiz: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
