import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getAdminSession,
  verifyPassword,
  hashPassword,
  signAdminToken,
  AUTH_COOKIES,
} from "@/lib/auth";
import { adminChangePasswordSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = adminChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid password format", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    const admin = await db.getAdminCredentials();

    const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password does not match" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.updateAdminPassword(newHash);

    // Refresh token with isDefaultPassword: false
    const newToken = signAdminToken({
      username: admin.username,
      role: "admin",
      isDefaultPassword: false,
    });

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });

    response.cookies.set({
      name: AUTH_COOKIES.admin,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
