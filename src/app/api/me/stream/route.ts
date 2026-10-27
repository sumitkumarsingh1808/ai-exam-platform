import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getUserSession(req);
    const body = await req.json();
    const { targetExam } = body;

    if (!targetExam || typeof targetExam !== "string") {
      return NextResponse.json({ error: "Target stream is required" }, { status: 400 });
    }

    if (session?.uid) {
      const user = await db.getUser(session.uid);
      if (user) {
        user.targetExam = targetExam;
        await db.saveUser(user);
        return NextResponse.json({ success: true, user });
      }
    }

    return NextResponse.json({ success: true, targetExam });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update target stream" }, { status: 500 });
  }
}
