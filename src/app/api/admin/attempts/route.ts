import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const quizId = searchParams.get("quizId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const status = searchParams.get("status") || undefined;

    let attempts = await db.listAttempts({ quizId, userId });
    if (status) {
      attempts = attempts.filter((a) => a.status === status);
    }

    attempts.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return NextResponse.json({ attempts });
  } catch (error: any) {
    console.error("List attempts error:", error);
    return NextResponse.json({ error: "Failed to list attempts" }, { status: 500 });
  }
}
