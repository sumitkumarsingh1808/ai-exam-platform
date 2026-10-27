import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Quiz, Question } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let quizzesToSync: Quiz[] = [];
    let questionsToSync: Question[] = [];

    if (body.quiz && typeof body.quiz === "object") {
      quizzesToSync.push(body.quiz);
    }
    if (Array.isArray(body.quizzes)) {
      quizzesToSync.push(...body.quizzes);
    }
    if (Array.isArray(body.questions)) {
      questionsToSync.push(...body.questions);
    }

    if (quizzesToSync.length === 0 && questionsToSync.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to sync" });
    }

    await db.syncCustomQuizzes(quizzesToSync, questionsToSync);
    return NextResponse.json({
      success: true,
      syncedQuizzes: quizzesToSync.length,
      syncedQuestions: questionsToSync.length,
    });
  } catch (error: any) {
    console.error("Sync custom quizzes error:", error);
    return NextResponse.json({ error: "Failed to sync custom quizzes" }, { status: 500 });
  }
}
