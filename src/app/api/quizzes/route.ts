import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    // Only return published quizzes to students
    const quizzes = await db.listQuizzes(false, category);
    return NextResponse.json({ quizzes });
  } catch (error: any) {
    console.error("Fetch published quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
