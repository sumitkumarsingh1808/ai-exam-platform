import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { signUserToken, AUTH_COOKIES } from "@/lib/auth";
import { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, user: inputUser } = body;

    let uid = inputUser?.uid;
    let email = inputUser?.email;
    let displayName = inputUser?.displayName || "Student Candidate";
    let photoURL = inputUser?.photoURL;

    const adminFb = getFirebaseAdmin();
    if (adminFb && idToken) {
      try {
        const decoded = await adminFb.auth.verifyIdToken(idToken);
        uid = decoded.uid;
        email = decoded.email || email;
        displayName = decoded.name || displayName;
        photoURL = decoded.picture || photoURL;
      } catch (err) {
        console.warn("Could not verify Firebase ID token, using provided user metadata:", err);
      }
    }

    if (!uid || !email) {
      return NextResponse.json(
        { error: "User UID and email are required" },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const existing = await db.getUser(uid);
    const now = new Date().toISOString();

    const userData: User = {
      uid,
      displayName,
      email,
      photoURL,
      // CRITICAL SECURITY: Never trust browser role. Always assign 'user' role
      role: existing?.role === "admin" ? "admin" : "user",
      createdAt: existing?.createdAt || now,
      lastLoginAt: now,
    };

    await db.saveUser(userData);

    const token = signUserToken({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
    });

    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    response.cookies.set({
      name: AUTH_COOKIES.user,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to establish user session" },
      { status: 500 }
    );
  }
}
