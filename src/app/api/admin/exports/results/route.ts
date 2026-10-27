import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeCsvCell } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const quizId = searchParams.get("quizId") || undefined;

    const attempts = await db.listAttempts({ quizId });
    const submitted = attempts.filter((a) => a.status === "submitted");

    const header = [
      "Attempt ID",
      "Candidate Name",
      "Candidate Email",
      "Examination Title",
      "Score",
      "Maximum Score",
      "Percentage",
      "Correct Answers",
      "Incorrect Answers",
      "Unanswered Questions",
      "Time Taken (seconds)",
      "Submission Timestamp",
    ].join(",");

    const rows = submitted.map((a) => {
      return [
        sanitizeCsvCell(a.id),
        sanitizeCsvCell(a.userName),
        sanitizeCsvCell(a.userEmail),
        sanitizeCsvCell(a.quizTitle),
        sanitizeCsvCell(a.score ?? 0),
        sanitizeCsvCell(a.maximumScore ?? 0),
        sanitizeCsvCell(`${a.percentage ?? 0}%`),
        sanitizeCsvCell(a.correctCount ?? 0),
        sanitizeCsvCell(a.incorrectCount ?? 0),
        sanitizeCsvCell(a.unansweredCount ?? 0),
        sanitizeCsvCell(a.timeTakenSeconds ?? 0),
        sanitizeCsvCell(a.submittedAt ?? "-"),
      ].join(",");
    });

    const csvContent = [header, ...rows].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="examination_results_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Export results error:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
