import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await db.getAttempt(id);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error("Get attempt error:", error);
    return NextResponse.json({ error: "Failed to fetch attempt" }, { status: 500 });
  }
}
