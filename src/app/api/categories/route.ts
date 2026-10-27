import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession(req);
    const isLocal =
      req.headers.get("host")?.includes("localhost") ||
      req.headers.get("host")?.includes("127.0.0.1");

    if (!admin && !isLocal) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const updated = await db.addCategory(name);
    return NextResponse.json({ success: true, categories: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
