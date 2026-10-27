import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Check admin session first
    const adminSession = await getAdminSession(req);
    if (adminSession) {
      return NextResponse.json({
        authenticated: true,
        role: "admin",
        user: {
          username: adminSession.username,
          displayName: "System Administrator",
          role: "admin",
          isDefaultPassword: adminSession.isDefaultPassword,
        },
      });
    }

    // Check user session
    const userSession = await getUserSession(req);
    if (userSession) {
      const fullUser = await db.getUser(userSession.uid);
      return NextResponse.json({
        authenticated: true,
        role: "user",
        user: fullUser || {
          uid: userSession.uid,
          email: userSession.email,
          displayName: userSession.displayName,
          role: "user",
        },
      });
    }

    return NextResponse.json({
      authenticated: false,
      role: null,
      user: null,
    });
  } catch (error: any) {
    console.error("Error in /api/me:", error);
    return NextResponse.json({ authenticated: false, role: null, user: null }, { status: 500 });
  }
}
