import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  signAdminToken,
  checkRateLimit,
  resetRateLimit,
  AUTH_COOKIES,
} from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "localhost";
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login credentials format", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    // Rate limiting per IP + username
    const rateLimitKey = `admin_login:${ip}:${username}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const admin = await db.getAdminCredentials();

    if (username !== admin.username) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    resetRateLimit(rateLimitKey);

    const token = signAdminToken({
      username: admin.username,
      role: "admin",
      isDefaultPassword: admin.isDefaultPassword,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        role: "admin",
        isDefaultPassword: admin.isDefaultPassword,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIES.admin,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
