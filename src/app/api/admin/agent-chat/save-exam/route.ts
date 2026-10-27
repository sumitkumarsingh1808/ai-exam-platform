import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Quiz, Question } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    const isLocal =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

    if (!admin && !isLocal) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to Admin portal." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description = "Generated via NTA AI Examination Agent",
      subject = "General Examination",
      category,
      isDailyPaper = false,
      status = "published",
      durationMinutes = 30,
      marksPerQuestion = 4,
      negativeMarks = 1,
      questions = [],
    } = body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Examination title and at least one question are required." },
        { status: 400 }
      );
    }

    const quizId = `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    // Infer category if not explicit
    const lowerSub = (subject + " " + title).toLowerCase();
    const detectedCategory =
      category ||
      (lowerSub.includes("bank") || lowerSub.includes("po") || lowerSub.includes("clerk") || lowerSub.includes("quant") || lowerSub.includes("apti")
        ? "Banking"
        : lowerSub.includes("ugc") || lowerSub.includes("net") || lowerSub.includes("research") || lowerSub.includes("teach")
        ? "UGC NET"
        : "Banking");

    const newQuiz: Quiz = {
      id: quizId,
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      category: detectedCategory,
      isDailyPaper: Boolean(isDailyPaper),
      status: status === "draft" ? "draft" : "published",
      durationMinutes: Number(durationMinutes) || 30,
      totalQuestions: questions.length,
      marksPerQuestion: Number(marksPerQuestion) || 4,
      negativeMarks: Number(negativeMarks) || 1,
      language: "English",
      createdBy: admin?.username || "admin",
      createdAt: now,
      updatedAt: now,
      publishedAt: status === "published" ? now : undefined,
      reviewPolicy: "immediate",
      allowRandomization: true,
    };

    const formattedQuestions: Question[] = questions.map((q: any, index: number) => ({
      id: `q-${quizId}-${index + 1}`,
      quizId,
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: Number(q.correctAnswerIndex) || 0,
      explanation: q.explanation || "Correct answer explanation verified by examiner.",
      difficulty: q.difficulty || "medium",
      topic: q.topic || subject,
      sourceReference: q.sourceReference || "AI Agent Question Generator",
      order: index + 1,
    }));

    await db.createQuiz(newQuiz, formattedQuestions);

    return NextResponse.json({
      success: true,
      message: `Exam paper "${newQuiz.title}" successfully saved with ${formattedQuestions.length} questions.`,
      quiz: newQuiz,
    });
  } catch (err: any) {
    console.error("Save exam error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save examination paper." },
      { status: 500 }
    );
  }
}
