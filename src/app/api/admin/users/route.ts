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
    const query = (searchParams.get("q") || "").toLowerCase().trim();

    const users = await db.listUsers();
    const attempts = await db.listAttempts();

    const usersWithStats = users.map((u) => {
      const userAttempts = attempts.filter((a) => a.userId === u.uid && a.status === "submitted");
      const totalScore = userAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const avgScore = userAttempts.length > 0 ? Number((totalScore / userAttempts.length).toFixed(1)) : 0;
      const highestScore = userAttempts.reduce((max, curr) => Math.max(max, curr.score || 0), 0);

      return {
        ...u,
        totalAttempts: userAttempts.length,
        averageScore: avgScore,
        highestScore,
      };
    });

    const filtered = query
      ? usersWithStats.filter(
          (u) =>
            u.displayName.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        )
      : usersWithStats;

    return NextResponse.json({ users: filtered });
  } catch (error: any) {
    console.error("List users error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
