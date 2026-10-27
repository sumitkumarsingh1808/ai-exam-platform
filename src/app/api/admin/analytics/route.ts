import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await db.getAdminAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Failed to calculate analytics" }, { status: 500 });
  }
}
