import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;

    // Sync any client-passed deleted quiz IDs from headers or cookies
    const deletedHeader = req.headers.get("x-deleted-quizzes");
    const deletedCookie = req.cookies.get("nta_deleted_quizzes")?.value;
    const deletedList = [
      ...(deletedHeader ? deletedHeader.split(",") : []),
      ...(deletedCookie ? deletedCookie.split(",") : []),
    ].map((s) => s.trim()).filter(Boolean);

    if (deletedList.length > 0) {
      await db.registerDeletedQuizzes(deletedList);
    }

    // Only return published and non-deleted quizzes to students
    const quizzes = await db.listQuizzes(false, category);
    return NextResponse.json({ quizzes });
  } catch (error: any) {
    console.error("Fetch published quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
